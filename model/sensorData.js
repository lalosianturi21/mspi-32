const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  suhu: { type: Number, default: null },
  kelembaban_tanah: { type: Number, required: true },
  nilai_ldr: { type: Number, required: true },
  persentase_cahaya: { type: Number, required: true },
  waktu: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', SensorDataSchema);
