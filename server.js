const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let latestData = {};

app.post('/api/data', (req, res) => {
  const {
    suhu,
    kelembaban_tanah,
    nilai_ldr,
    persentase_cahaya
  } = req.body;

  if (
    kelembaban_tanah !== undefined &&
    nilai_ldr !== undefined &&
    persentase_cahaya !== undefined
  ) {
    latestData = {
      suhu: suhu ?? null, // Bisa null jika sensor gagal
      kelembaban_tanah,
      nilai_ldr,
      persentase_cahaya,
      waktu: new Date().toISOString()
    };
    console.log('Data diterima:', latestData);
    res.status(200).json({ message: 'Data berhasil diterima' });
  } else {
    res.status(400).json({ message: 'Data tidak lengkap' });
  }
});

app.get('/api/data', (req, res) => {
  res.json(latestData);
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
