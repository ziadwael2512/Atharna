import express from 'express';
import { changeUserToAdmin } from '../controllers/adminController';
import { protect, authorize } from "../Middlleware/authMiddleware";
import { getAllUsers } from '../controllers/adminController'; 
import { deleteUser } from '../controllers/adminController';
import { getUser } from '../controllers/adminController';
import { approvePost } from "../controllers/adminController";
import { getAllPostsForAdmin } from '../controllers/adminController';




const router = express.Router();

router.put("/posts/:postId/approve", protect, authorize(["ADMIN"]), async (req, res, next) => {
    try {
      await approvePost(req, res, next);
    } catch (error) {
      next(error);
    }
  });
  
  

router.put("/users/:userId/admin", protect, authorize(["ADMIN"]), changeUserToAdmin);
router.get("/users/getAllUsers", protect, authorize(["ADMIN"]), getAllUsers);
router.delete("/users/:userId?", protect, authorize(["ADMIN"]), deleteUser);
router.get("/users/getUser/:id?", protect, authorize(["ADMIN"]), getUser);
router.get("/users/getUserByEmail/:email?", protect, authorize(["ADMIN"]), getUser);
router.put("/posts/:postId/approve", protect, authorize(["ADMIN"]), approvePost);
router.get("/posts", protect, authorize(["ADMIN"]), getAllPostsForAdmin);
//router.get('/posts', authenticate, authorizeAdmin, getAllPostsForAdmin);



export default router;