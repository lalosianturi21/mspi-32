const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simpan data sementara di memori
let latestData = {};

// Route untuk menerima data POST dari ESP32
app.post('/api/data', (req, res) => {
  const { suhu, kelembaban_tanah, nilai_ldr, persentase_cahaya } = req.body;

  if (
    suhu !== undefined &&
    kelembaban_tanah !== undefined &&
    nilai_ldr !== undefined &&
    persentase_cahaya !== undefined
  ) {
    latestData = {
      suhu,
      kelembaban_tanah,
      nilai_ldr,
      persentase_cahaya,
      waktu: new Date().toISOString()
    };
    console.log('Data diterima dari ESP32:', latestData);
    res.status(200).json({ message: 'Data berhasil diterima' });
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
