// src/controllers/feed.controller.ts

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*export const getFeed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
        where: {
          status: "APPROVED",
          deleted: false, // ✅ now valid
        },
        orderBy: { createdAt: "desc" },
      });
      

    res.status(200).json({ feed: posts });
  } catch (error) {
    console.error("❌ Error fetching feed:", error);
    next(error);
  }
};*/
export const getFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          status: "APPROVED",
          deleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error("❌ Error fetching feed:", error);
      next(error);
    }
  };
  
