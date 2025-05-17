// const driver = require('../config/neo4j');

// // Get bus info for a single path (shortestPath)
// exports.getDirectBusInfo = async (startLoc, endLoc) => {
//   const session = driver.session();

//   const query = `
//     MATCH (start:Location {name: $startLoc}), (end:Location {name: $endLoc})
//     MATCH path = shortestPath((start)-[:ROAD*]->(end))
//     WITH relationships(path) AS rels, path
//     WITH [r IN rels | r.bus_ids] AS all_bus_ids,
//          reduce(totalDist = 0.0, r IN rels | totalDist + r.distance) AS totalDistance,
//          reduce(totalTime = 0, r IN rels | totalTime + r.time) AS totalTime
//     WITH reduce(common = all_bus_ids[0], ids IN all_bus_ids[1..] | 
//          [x IN common WHERE x IN ids]
//     ) AS common_buses, totalDistance, totalTime
//     RETURN common_buses AS available_bus_ids_on_all_edges, totalDistance, totalTime
//   `;

//   try {
//     const result = await session.run(query, { startLoc, endLoc });

//     if (!result.records.length) return [];

//     const record = result.records[0];

//     const busIds = record.get('available_bus_ids_on_all_edges');
//     const totalDistance = record.get('totalDistance');
//     const totalTime = record.get('totalTime');

//     return busIds.map(id => ({
//       bus_id: (typeof id === 'object' && id.low !== undefined) ? id.low : id,
//       totalDistance: typeof totalDistance === 'object' ? totalDistance.toNumber() : totalDistance,
//       totalTime: typeof totalTime === 'object' ? totalTime.toNumber() : totalTime
//     }));

//   } catch (error) {
//     console.error('Neo4j Error in getDirectBusInfo:', error);
//     return [];
//   } finally {
//     await session.close();
//   }
// };

// // Get bus info for all connected paths (up to 5 hops) excluding direct routes
// exports.getConnectingBusInfo = async (startLoc, endLoc, excludeBusIds = []) => {
//   const session = driver.session();
//   const query = `
//     MATCH (start:Location {name: $startLoc}), (end:Location {name: $endLoc})
//     MATCH path = (start)-[:ROAD*1..5]->(end)
//     WHERE NOT path = shortestPath((start)-[:ROAD*]->(end))
//     WITH relationships(path) AS rels
//     UNWIND rels AS r
//     UNWIND r.bus_ids AS bus_id
//     RETURN DISTINCT bus_id, sum(r.distance) AS totalDistance, sum(r.time) AS totalTime
//   `;

//   try {
//     const result = await session.run(query, { startLoc, endLoc });
//     const routes = result.records.map(r => ({
//       bus_id: r.get('bus_id')?.low || r.get('bus_id'),
//       totalDistance: r.get('totalDistance'),
//       totalTime: r.get('totalTime')
//     }));

//     // Filter out excluded bus IDs if provided
//     return excludeBusIds.length 
//       ? routes.filter(route => !excludeBusIds.includes(route.bus_id))
//       : routes;
//   } finally {
//     await session.close();
//   }
// };

// exports.getBusRoutes = async (startLoc, endLoc) => {
//   try {
//     // Fetch all routes — both direct (shortestPath only) and connecting (multi-hop)
//     const directRoutes = await exports.getDirectBusInfo(startLoc, endLoc); // should return only shortestPath-based common bus_ids
//     const connectingRoutes = await exports.getConnectingBusInfo(startLoc, endLoc); // returns other bus_ids

//     // Combine both
//     const combined = [...directRoutes, ...connectingRoutes];

//     if (combined.length === 0) {
//       return {
//         busRoutes: {
//           direct: [],
//           connecting: []
//         }
//       };
//     }

//     // Find the route with the minimum distance
//     let minDistance = Math.min(...combined.map(r => r.totalDistance));

//     // Mark only one shortest route (first match)
//     let direct = [];
//     let connecting = [];

//     for (let route of combined) {
//       const formatted = {
//         id: route.bus_id,
//         neo4j_id: route.bus_id,
//         bus_route_no: `BUS-${route.bus_id}`,
//         bus_route_name: `Route ${route.bus_id}`,
//         system_date: new Date().toISOString(),
//         totalDistance: route.totalDistance,
//         totalTime: route.totalTime
//       };

//       if (route.totalDistance === minDistance && direct.length === 0) {
//         direct.push(formatted); // first shortest becomes direct
//       } else {
//         connecting.push(formatted);
//       }
//     }

//     return {
//       busRoutes: {
//         direct,
//         connecting
//       }
//     };

//   } catch (error) {
//     console.error('Error in getBusRoutes:', error);
//     return {
//       busRoutes: {
//         direct: [],
//         connecting: []
//       }
//     };
//   }
// };

const driver = require('../config/neo4j');

// Get bus info for a single path (shortestPath)
exports.getDirectBusInfo = async (startLoc, endLoc) => {
  const session = driver.session();

    const query = `
    MATCH (start:Location {name: $startLoc}), (end:Location {name: $endLoc})
    MATCH path = shortestPath((start)-[:ROAD*]->(end))
    WITH path, relationships(path) AS rels
    WITH rels, 
        [r IN rels | r.bus_ids] AS all_bus_ids,
        reduce(totalDist = 0.0, r IN rels | totalDist + r.distance) AS totalDistance,
        reduce(totalTime = 0, r IN rels | totalTime + r.time) AS totalTime
    WITH all_bus_ids, totalDistance, totalTime,
        reduce(common = all_bus_ids[0], ids IN all_bus_ids[1..] | 
          [x IN common WHERE x IN ids]
        ) AS common_buses
    RETURN common_buses AS available_bus_ids_on_all_edges, totalDistance, totalTime
  `;

  try {
    const result = await session.run(query, { startLoc, endLoc });

    if (!result.records.length) return [];

    const record = result.records[0];

    const busIds = record.get('available_bus_ids_on_all_edges');
    const totalDistance = record.get('totalDistance');
    const totalTime = record.get('totalTime');

    return busIds.map(id => ({
      bus_id: (typeof id === 'object' && id.low !== undefined) ? id.low : id,
      totalDistance: typeof totalDistance === 'object' ? totalDistance.toNumber() : totalDistance,
      totalTime: typeof totalTime === 'object' ? totalTime.toNumber() : totalTime
    }));

  } catch (error) {
    console.error('Neo4j Error in getDirectBusInfo:', error);
    return [];
  } finally {
    await session.close();
  }
};

// Get bus info for all connected paths (up to 5 hops) excluding direct routes
exports.getConnectingBusInfo = async (startLoc, endLoc, excludeBusIds = []) => {
  const session = driver.session();

  const query = `
    MATCH (start:Location {name: $startLoc}), (end:Location {name: $endLoc})
    MATCH path = shortestPath((start)-[:ROAD*]->(end))
    WITH relationships(path) AS rels
    UNWIND rels AS r
    UNWIND r.bus_ids AS bus_id
    RETURN COLLECT(DISTINCT bus_id) AS all_unique_bus_ids_in_path,
          SUM(r.distance) AS totalDistance,
          SUM(r.time) AS totalTime
  `;

  try {
    const result = await session.run(query, { startLoc, endLoc });
  
    const record = result.records[0];

    const busIds = record.get('all_unique_bus_ids_in_path');
    const totalDistance = record.get('totalDistance');
    const totalTime = record.get('totalTime');

    return busIds.map(id => ({
      bus_id: (typeof id === 'object' && id.low !== undefined) ? id.low : id,
      totalDistance: typeof totalDistance === 'object' ? totalDistance.toNumber() : totalDistance,
      totalTime: typeof totalTime === 'object' ? totalTime.toNumber() : totalTime
    }));

    // Filter out excluded bus IDs if provided
    return excludeBusIds.length 
      ? routes.filter(route => !excludeBusIds.includes(route.bus_id))
      : routes;
  } finally {
    await session.close();
  }
};


exports.getBusRoutes = async (startLoc, endLoc) => {
  try {
    const directRoutes = await exports.getDirectBusInfo(startLoc, endLoc);
    const connectingRoutes = await exports.getConnectingBusInfo(startLoc, endLoc);

    if (directRoutes.length === 0 && connectingRoutes.length === 0) {
      return {
        busRoutes: {
          direct: [],
          connecting: []
        }
      };
    }

    // Format all routes
    const formatRoute = (route) => ({
      id: route.bus_id,
      neo4j_id: route.bus_id,
      bus_route_no: `BUS-${route.bus_id}`,
      bus_route_name: `Route ${route.bus_id}`,
      system_date: new Date().toISOString(),
      totalDistance: route.totalDistance,
      totalTime: route.totalTime
    });

    const direct = directRoutes.map(formatRoute);

    // Remove duplicates: exclude any in `connecting` if the ID already exists in `direct`
    const directIds = new Set(direct.map(r => r.id));
    const connecting = connectingRoutes
      .filter(route => !directIds.has(route.bus_id))
      .map(formatRoute);

    return {
      busRoutes: {
        direct,
        connecting
      }
    };

  } catch (error) {
    console.error('Error in getBusRoutes:', error);
    return {
      busRoutes: {
        direct: [],
        connecting: []
      }
    };
  }
};


