const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let connection = null;

function createConnection() {
  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  conn.connect((err) => {
    if (err) {
      console.error('MySQL connection failed:', err.stack);
      setTimeout(createConnection, 2000); // Retry after 2s
    } else {
      console.log('Connected to MySQL as ID', conn.threadId);
    }
  });

  // Auto-reconnect on connection loss
  conn.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('MySQL connection lost. Reconnecting...');
      connection = createConnection();
    } else {
      throw err;
    }
  });

  return conn;
}

function getConnection() {
  if (!connection) {
    connection = createConnection();
  }
  return connection;
}

module.exports = getConnection();