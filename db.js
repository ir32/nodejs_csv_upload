//db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6697313',
  password: 'qZahfLMSf7',
  database: 'sql6697313',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0 
});

// Handle pool connection errors
pool.getConnection()
  .then(connection => {
    console.log('MySQL pool connected: threadId ' + connection.threadId);
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL pool: ' + err.message);
  });

module.exports = pool;
