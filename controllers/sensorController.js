import Sensor from "../models/Sensor.js"
import PDFDocument from 'pdfkit';


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

const generatePDFReport = async (req, res) => {
  try {
    const data = await Sensor.find().sort({ waktu: -1 });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=sensor-report.pdf");
    doc.pipe(res);

    // Judul
    doc.fontSize(16).text("Laporan Data Sensor", { align: "center" });
    doc.moveDown(1);

    // Kolom tabel
    const columns = [
      { label: "Tanggal", width: 100 },
      { label: "Suhu", width: 60 },
      { label: "Kelembapan", width: 100 },
      { label: "Cahaya", width: 100 },
      { label: "Pompa", width: 80 }
    ];

    const rowHeight = 20;
    const startX = 40;
    let y = doc.y;

    // Fungsi menggambar header tabel
    const drawTableHeader = () => {
      let x = startX;
      doc.font("Helvetica-Bold").fontSize(10);
      columns.forEach(col => {
        doc.rect(x, y, col.width, rowHeight)
           .fillAndStroke('#eeeeee', '#000000');
        doc.fillColor('#000000').text(col.label, x + 5, y + 5);
        x += col.width;
      });
      y += rowHeight;
      doc.font("Helvetica");
    };

    drawTableHeader(); // header pertama

    // Loop data baris demi baris
    data.forEach(item => {
      // Cek jika baris akan melewati batas halaman
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.page.margins.top;
        drawTableHeader(); // header di halaman baru
      }

      const date = new Date(item.waktu).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      });

      const row = [
        date,
        `${item.suhu?.toFixed(1) ?? "-"} °C`,
        `${item.kelembaban_tanah} %`,
        `${item.persentase_cahaya} %`,
        item.status_pompa?.toUpperCase()
      ];

      let x = startX;
      row.forEach((val, i) => {
        doc.rect(x, y, columns[i].width, rowHeight).stroke();
        doc.fillColor('#000000').text(val, x + 5, y + 5);
        x += columns[i].width;
      });

      y += rowHeight;
    });

    doc.end();
  } catch (err) {
    console.error("❌ Gagal membuat PDF:", err);
    res.status(500).json({ message: "Gagal membuat PDF" });
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
  getAllSensorData,
  generatePDFReport
};
