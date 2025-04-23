import express from "express";
import { createPost } from "../controllers/postController"; // ✅ Import createPost
import { deletePost } from "../controllers/postController";
import upload from "../Middlleware/uploadMiddleware"; // ✅ Correct import for uploadMiddleware
import { authorize, protect } from "../Middlleware/authMiddleware";
import { approvePost } from "../controllers/adminController";
import uploadMiddleware from "../Middlleware/uploadMiddleware";

const router = express.Router();

// Route to create a post (protected route)
router.post("/posts", protect, createPost);
router.put("/posts/:postId/approve", protect, authorize(["ADMIN"]), approvePost);
/*router.post("/posts", uploadMiddleware, createPost);*/
router.post("/", upload.single("image"), createPost);
router.delete("/posts/:postId", protect, deletePost);


export default router;
