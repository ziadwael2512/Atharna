import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new post (Pending Approval)
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !userId) {
      res.status(400).json({ error: "Title, content, and userId are required" });
      return;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        userId: Number(userId),
        status: "PENDING",
        imageUrl,
      },
      include: {
        user: {
          select: {
            Fname: true, // Use Fname instead of name
          },
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        status: newPost.status,
        uploadedBy: newPost.user.Fname, // Display Fname here
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = (req as any).user;
      const { postId } = req.params;
  
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
  
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });
  
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
  
      // Users can only delete their own posts
      if (user.role !== "ADMIN" && post.userId !== user.id) {
        res.status(403).json({ error: "Forbidden: Cannot delete this post" });
        return;
      }
  
      await prisma.post.delete({
        where: { id: Number(postId) },
      });
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      next(error);
    }
  };
