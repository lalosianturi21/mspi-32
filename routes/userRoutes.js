import express from "express";
const router = express.Router();
import{
    getAllUsers,
    loginUser,
    registerUser,
    updateProfile,
    userProfile
} from "../controllers/userController.js"
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

router.post ("/register", registerUser);
router.post ("/login", loginUser);
router.get ("/profile", authGuard, userProfile);
router.put ("/updateProfile/:userId", authGuard, updateProfile);
router.get("/", authGuard, adminGuard, getAllUsers);

export default router;