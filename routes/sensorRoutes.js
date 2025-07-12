import express from 'express';

const router = express.Router();
import { generatePDFReport, getAllData, getAllSensorData, getLatestData, postSensorData } from "../controllers/sensorController.js";
import { authGuard } from '../middleware/authMiddleware.js';


router.route("/")
    .post(postSensorData)
    .get(getLatestData)

router.route("/all")
    .get(authGuard, getAllData);

router.route("/allsensor")
    .get(authGuard,getAllSensorData)

router.route("/report")
    .get(authGuard, generatePDFReport)

export default router;
