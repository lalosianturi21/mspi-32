import express from "express";
const router = express.Router();
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { createTanaman, deleteTanaman, getAllTanaman, getAllTanamanData, getSingleTanaman, updateTanaman } from "../controllers/tanamanController.js";


router
    .route("/")
    .post(authGuard, adminGuard, createTanaman)
    .get(getAllTanaman);

router
    .route("/alltanaman")
    .get(getAllTanamanData);

router
    .route("/:tanamanId")
    .get(getSingleTanaman)
    .put(authGuard, adminGuard, updateTanaman)
    .delete(authGuard, adminGuard, deleteTanaman);

export default router;