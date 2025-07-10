import express from "express";
const router = express.Router();
import{
    deleteUser,
    getAllUsers,
    loginUser,
    registerUser,
    updateProfile,
    userProfile
} from "../controllers/userController.js"
import {authGuard } from "../middleware/authMiddleware.js";

router.post ("/register", registerUser);
router.post ("/login", loginUser);
router.get ("/profile", authGuard, userProfile);
router.put ("/updateProfile/:userId", authGuard, updateProfile);
router.get("/", authGuard,getAllUsers);
router.delete("/:userId", authGuard,deleteUser);

export default router;