import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import sensorRoutes from './routes/sensorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tanamanRoutes from './routes/tanamanRoutes.js';

dotenv.config();
connectDB();

// Middleware
const app = express();
app.use(express.json());

const corsOption = {
    exposedHeaders: "*",
};

app.use(cors(corsOption));

// Routes
app.use('/api/data', sensorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tanaman", tanamanRoutes)
// Start server


const PORT  = process.env.PORT || 5551;


app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`))
