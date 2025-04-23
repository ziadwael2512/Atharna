import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import * as userModel from "@prisma/client";


const prisma = new PrismaClient();
console.log(prisma); // Check if `post` is part of the Prisma client


export const changeUserToAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = parseInt(req.params.userId);
  
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
  
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
  
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: { type: "ADMIN" },  // Ensure this field matches your Prisma schema
      });
  
      res.status(200).json({ message: "User role updated to ADMIN" });
    } catch (error) {
      console.error("Error updating user role:", error);
      next(error);  // Use next() to pass the error to an error-handling middleware
    }
  };
  

  export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          Fname: true,
          Lname: true,
          email: true,
          type: true
        },
      });
  
      if (users.length === 0) {
        res.status(404).json({ message: "No users found" });
        return;
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  
  
  export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.params;  // userId from URL parameter
    const { email } = req.query;    // email from query parameter

    if (!userId && !email) {
        res.status(400).json({ message: "Please provide either userId or email to delete a user." });
        return;
    }

    try {
        // Find the user
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId ? Number(userId) : undefined },
                    { email: email ? String(email) : undefined },
                ],
            },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // 🔥 DELETE related posts first before deleting the user
        await prisma.post.deleteMany({
            where: { userId: user.id },
        });

        // ✅ Now delete the user
        await prisma.user.delete({
            where: { id: user.id },
        });

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        next(error);
    }
};

  

  export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, email } = req.params;
  
      if (!id && !email) {
        res.status(400).json({ message: "Please provide an id or email" });
        return;
      }
  
      const user = await prisma.user.findUnique({
        where: id ? { id: parseInt(id) } : { email },
        select: {
          id: true,
          Fname: true,
          Lname: true,
          email: true,
          type: true
        },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  export const approvePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("🔥 Checking user in approvePost:", (req as any).user);
  
      const user = (req as any).user;
      if (!user || !user.id) {
        console.log("❌ User ID is missing in approvePost");
        res.status(401).json({ error: "Unauthorized. User ID is missing" });
        return;
      }
  
      if (user.role !== "ADMIN") {
        console.log("❌ User is not an admin");
        res.status(403).json({ error: "Forbidden. Only admins can approve posts" });
        return;
      }
  
      const { postId } = req.params;
      console.log(`🔍 Approving Post ID: ${postId}`);
  
      const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
      if (!post) {
        console.log("❌ Post not found");
        res.status(404).json({ error: "Post not found" });
        return;
      }
  
      await prisma.post.update({
        where: { id: Number(postId) },
        data: { status: "APPROVED" },
      });
  
      console.log("✅ Post approved successfully");
  
      res.status(200).json({ message: "Post approved successfully" });
    } catch (error) {
      console.error("❌ Error approving post:", error);
      next(error); // ✅ Pass the error to Express error handler
    }
  };

  export const getAllPostsForAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("🔥 Checking user in getAllPostsForAdmin:", (req as any).user);
  
      const user = (req as any).user;
      if (!user || !user.id) {
        console.log("❌ User ID is missing");
        res.status(401).json({ error: "Unauthorized. User ID is missing" });
        return;
      }
  
      if (user.role !== "ADMIN") {
        console.log("❌ User is not an admin");
        res.status(403).json({ error: "Forbidden. Only admins can view all posts" });
        return;
      }
  
      console.log("🔍 Fetching all posts for admin");
  
      const allPosts = await prisma.post.findMany({
        where: {
          OR: [
            { status: "PENDING" },
            { status: "APPROVED" }
          ]
        },
        orderBy: { createdAt: "desc" }, // Optional: to sort by newest
      });
  
      console.log(`✅ Found ${allPosts.length} posts`);
  
      res.status(200).json({ 
        posts: allPosts,
        counts: {
          total: allPosts.length,
          pending: allPosts.filter(post => post.status === "PENDING").length,
          approved: allPosts.filter(post => post.status === "APPROVED").length
        }
      });
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      next(error);
    }
  };