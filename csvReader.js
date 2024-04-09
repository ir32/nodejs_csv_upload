const pool = require('./db');

// Function to fetch data from the customers table
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

module.exports = {
  getCustomers
};
