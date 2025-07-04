import { Schema, model } from "mongoose";

const TanamanSchema = new Schema(
    {
        nama: { type: String, required: true },
        umur: { type: String, required: true },
        tinggi: { type: Number, required: true },
        warna: { type: String, required: true },
    },
    { timestamps: true }
);

const Tanaman = model("Tanamans", TanamanSchema);
export default Tanaman;
