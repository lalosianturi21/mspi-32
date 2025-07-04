import Sensor from "../models/Sensor.js"

let latestData = {}; // Simpan data terakhir (opsional)

const postSensorData = async (req, res) => {
  const { suhu, kelembaban_tanah, nilai_ldr, persentase_cahaya } = req.body;

  if (
    kelembaban_tanah !== undefined &&
    nilai_ldr !== undefined &&
    persentase_cahaya !== undefined
  ) {
    latestData = {
      suhu: suhu ?? null,
      kelembaban_tanah,
      nilai_ldr,
      persentase_cahaya,
      waktu: new Date().toISOString()
    };

    try {
      await Sensor.create(latestData);
      console.log('✅ Data disimpan:', latestData);
      res.status(200).json({ message: 'Data berhasil disimpan' });
    } catch (error) {
      console.error('❌ Gagal simpan:', error);
      res.status(500).json({ message: 'Gagal menyimpan data' });
    }
  } else {
    res.status(400).json({ message: 'Data tidak lengkap' });
  }
};

const getLatestData = (req, res) => {
  res.json(latestData);
};

const getAllData = async (req, res) => {
  try {
    const data = await Sensor.find().sort({ waktu: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};


export {
  postSensorData,
  getLatestData,
  getAllData
};
