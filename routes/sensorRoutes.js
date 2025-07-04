import express from 'express';

const router = express.Router();
import { getAllData, getLatestData, postSensorData } from "../controllers/sensorController.js";


router.route("/")
    .post(postSensorData)
    .get(getLatestData)

router.route("/all")
    .get(getAllData);

export default router;
