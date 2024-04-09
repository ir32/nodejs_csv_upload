const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csvParser = require('csv-parser');
const fs = require('fs');

const pool = require('./db');
const { readCSV, getCustomers } = require('./csvReader');

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

router.post('/api/upload', upload.single('csvFile'), (req, res) => {
  const filePath = req.file.path;

  readCSV(filePath, (result) => {
    fs.unlinkSync(filePath); // Remove the file after processing
    res.status(200).json(result);
  });
});

module.exports = router;
