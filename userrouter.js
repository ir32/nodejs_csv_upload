const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csv = require('csv-parser'); // Import the csv-parser module
const fs = require('fs');

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

router.get('/hi', (req, res) => {
  res.status(200).json({ message: 'Hello from the user router!' });
});

router.get('/customers', async (req, res) => {
  try {
    const customers = await getCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from the database' });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileRows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => fileRows.push(data))
      .on('end', async () => {
        const connection = await pool.getConnection();
        for (const row of fileRows) {
          await connection.query('INSERT INTO customers SET ?', row);
        }
        connection.release();
        res.status(200).json({ message: 'CSV file uploaded successfully' });
      });
  } catch (error) {
    console.error('Error uploading CSV file:', error.message);
    res.status(500).json({ error: 'Failed to upload CSV file' });
  }
});

module.exports = router;
