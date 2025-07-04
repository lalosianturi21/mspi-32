const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simpan data sementara di memori (bisa diganti dengan database)
let latestData = {};

// Route untuk menerima data POST dari ESP32
app.post('/api/data', (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature !== undefined && humidity !== undefined) {
    latestData = { temperature, humidity, time: new Date() };
    console.log('Data diterima dari ESP32:', latestData);
    res.status(200).json({ message: 'Data diterima' });
  } else {
    res.status(400).json({ message: 'Data tidak lengkap' });
  }
});

// Route untuk melihat data terakhir
app.get('/api/data', (req, res) => {
  res.json(latestData);
});

// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
