import express from 'express';

const router = express.Router();
import { getAllData, getAllSensorData, getLatestData, postSensorData } from "../controllers/sensorController.js";
import { authGuard } from '../middleware/authMiddleware.js';


router.route("/")
    .post(postSensorData)
    .get(getLatestData)

router.route("/all")
    .get(authGuard, getAllData);

router.route("/allsensor")
    .get(authGuard,getAllSensorData)

export default router;
