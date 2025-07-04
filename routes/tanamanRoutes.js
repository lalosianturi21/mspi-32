import express from "express";
const router = express.Router();
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { createTanaman, deleteTanaman, getAllTanaman, getSingleTanaman, updateTanaman } from "../controllers/tanamanController.js";


router
    .route("/")
    .post(authGuard, adminGuard, createTanaman)
    .get(getAllTanaman);

router
    .route("/:tanamanId")
    .get(getSingleTanaman)
    .put(authGuard, adminGuard, updateTanaman)
    .delete(authGuard, adminGuard, deleteTanaman);

export default router;