const pool = require('../config/db');
const { getBusRoutes } = require('../services/busService');

exports.getBusIds = async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and End locations are required' });
  }

  try {
    // Get both categorized routes
    const { busRoutes } = await getBusRoutes(start, end);

    // Collect all unique bus IDs
    const allBusIds = [...new Set([
      ...busRoutes.direct.map(b => b.id),
      ...busRoutes.connecting.map(b => b.id)
    ])];

    if (allBusIds.length === 0) {
      return res.status(200).json({ message: 'No bus routes found.' });
    }

    const placeholders = allBusIds.map(() => '?').join(',');
    const sql = `SELECT * FROM bus_routetb WHERE neo4j_id IN (${placeholders})`;

    pool.query(sql, allBusIds, (err, results) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ error: 'MySQL query failed' });
      }

      const mapById = {};
      results.forEach(r => {
        mapById[r.neo4j_id] = r;
      });

      const enrich = (routes) =>
        routes.map(r => ({
          ...mapById[r.id],
          totalDistance: r.totalDistance,
          totalTime: r.totalTime
        }));

      return res.status(200).json({
        busRoutes: {
          direct: enrich(busRoutes.direct),
          connecting: enrich(busRoutes.connecting)
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
