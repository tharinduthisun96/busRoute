const pool = require('../config/db.js');

exports.getAllLocations = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM locationtb ORDER BY name ASC';
      pool.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results); // Return the full result set with all fields
      });
    });
};

exports.getAllBusRoutes = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM bus_routetb ORDER BY bus_route_name ASC';
      pool.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results); // Return the full result set with all fields
      });
    });
};

exports.getAllLocationsKey = (name) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM locationtb WHERE name LIKE ?';
    const searchTerm = `%${name}%`; // Match any location that contains the input string

    pool.query(sql, [searchTerm], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};