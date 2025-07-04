import { Schema, model } from "mongoose";

const SensorSchema = new Schema (
  {
    suhu: { type: Number, default: null },
    kelembaban_tanah: { type: Number, required: true },
    nilai_ldr: { type: Number, required: true },
    persentase_cahaya: { type: Number, required: true },
    waktu: { type: Date, default: Date.now }
  }
);

const Sensor = model("Sensor", SensorSchema);
export default Sensor;