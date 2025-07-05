import Sensor from "../models/Sensor.js"

let latestData = {}; // Simpan data terakhir (opsional)

const postSensorData = async (req, res) => {
  const {
    suhu,
    kelembaban_tanah,
    nilai_ldr,
    persentase_cahaya,
    status_pompa, // ✅ Tambahkan ini
  } = req.body;

  if (
    kelembaban_tanah !== undefined &&
    nilai_ldr !== undefined &&
    persentase_cahaya !== undefined &&
    status_pompa !== undefined // ✅ Pastikan status_pompa juga dikirim
  ) {
    latestData = {
      suhu: suhu ?? null,
      kelembaban_tanah,
      nilai_ldr,
      persentase_cahaya,
      status_pompa, // ✅ Simpan ke latestData
      waktu: new Date().toISOString(),
    };

    try {
      await Sensor.create(latestData);
      console.log("✅ Data disimpan:", latestData);
      res.status(200).json({ message: "Data berhasil disimpan" });
    } catch (error) {
      console.error("❌ Gagal simpan:", error);
      res.status(500).json({ message: "Gagal menyimpan data" });
    }
  } else {
    res.status(400).json({ message: "Data tidak lengkap" });
  }
};


const getLatestData = (req, res) => {
  res.json(latestData);
};

const getAllData = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};

    if (filter) {
      const numericFilter = Number(filter);
      const isNumeric = !isNaN(numericFilter);

      if (isNumeric) {
        where.$or = [
          { nilai_ldr: numericFilter },
          { suhu: numericFilter },
          { kelembaban_tanah: numericFilter },
          { persentase_cahaya: numericFilter },
        ];
      } else {
        // kalau mau cari berdasarkan string, tambahkan field yang string di sini
        where.$or = [
          { waktu: { $regex: filter, $options: "i" } },
        ];
      }
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Sensor.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter || "",
      "x-totalcount": total,
      "x-currentpage": page,
      "x-pagesize": pageSize,
      "x-totalpagecount": pages,
    });

    if (page > pages && pages !== 0) {
      return res.json([]);
    }

    const result = await Sensor.find(where)
      .skip(skip)
      .limit(pageSize)
      .sort({ waktu: -1 });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getAllSensorData = async (req, res, next) => {
  try {
    const data = await Sensor.find().sort({ waktu: -1 }); // Urutkan dari terbaru
    res.json(data);
  } catch (error) {
    console.error("❌ Gagal mengambil semua data sensor:", error);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
};


export {
  postSensorData,
  getLatestData,
  getAllData,
  getAllSensorData
};
