import express from 'express';

const router = express.Router();
import { getAllData, getAllSensorData, getLatestData, postSensorData } from "../controllers/sensorController.js";


router.route("/")
    .post(postSensorData)
    .get(getLatestData)

router.route("/all")
    .get(getAllData);

router.route("/allsensor")
    .get(getAllSensorData)

export default router;
