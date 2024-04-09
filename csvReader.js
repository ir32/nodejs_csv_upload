const pool = require('./db');
const csvParser = require('csv-parser');
const fs = require('fs');

async function getCustomers() {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.query('SELECT * FROM customers');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error fetching data from MySQL:', error.message);
    throw error;
  }
}

function readCSV(filePath, callback) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', async (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const row of results) {
          await connection.query('INSERT INTO customers SET ?', row);
        }

        await connection.commit();

        connection.release();

        callback({ message: 'Data inserted into customers table successfully' });
      } catch (error) {
        if (connection) {
          await connection.rollback();
          connection.release();
        }
        callback({ error: 'Error inserting data into customers table: ' + error.message });
      }
    });
}

module.exports = {
  getCustomers,
  readCSV
};
