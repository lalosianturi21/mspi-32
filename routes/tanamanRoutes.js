import express from "express";
const router = express.Router();
import { authGuard } from "../middleware/authMiddleware.js";
import { createTanaman, deleteTanaman, getAllTanaman, getAllTanamanData, getSingleTanaman, updateTanaman } from "../controllers/tanamanController.js";


router
    .route("/")
    .post(authGuard, createTanaman)
    .get(getAllTanaman);

router
    .route("/alltanaman")
    .get(getAllTanamanData);

router
    .route("/:tanamanId")
    .get(getSingleTanaman)
    .put(authGuard, updateTanaman)
    .delete(authGuard, deleteTanaman);

export default router;