/*import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../Athuintication/auth';
import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token

    if (!token) {
      res.status(401).json({ error: "Unauthorized. No token provided." });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Unauthorized. Invalid token." });
      return;
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, type: true },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized. User not found." });
      return;
    }

    req.user = { id: user.id, role: user.type }; // ✅ Attach user
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
          res.status(403).json({ message: "Forbidden: Insufficient permissions" })
          return ;
        }
        next();
  };
};*/

/*import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Athuintication/auth"; // Fixed typo in folder name
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

// ✅ Middleware to protect routes (requires authentication)
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "❌ Not authorized, no token" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "❌ Not authorized, invalid token" });
  }

  try {
    // Fetch user from DB to verify role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, type: true },
    });

    if (!user) {
      return res.status(401).json({ message: "❌ User not found" });
    }

    req.user = { id: user.id, role: user.type }; 
    next();
  } catch (error) {
    return res.status(500).json({ message: "❌ Internal server error", error });
  }
};

// ✅ Middleware to authorize specific roles (e.g., "admin")
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "❌ Forbidden: Insufficient permissions" });
    }
    next();
  };
};*/

/*import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Athuintication/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🛡️ Middleware to check authentication
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token

    if (!token) {
      res.status(401).json({ message: "❌ Not authorized, no token" });
      return; // ✅ Make sure to return to avoid further execution
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ message: "❌ Not authorized, invalid token" });
      return;
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, type: true }, // ✅ Select only ID & type
    });

    if (!user) {
      res.status(401).json({ message: "❌ User not found" });
      return;
    }

    // ✅ Attach user to request
    (req as any).user = { id: user.id, role: user.type }; // Map "type" to "role"
    next(); // ✅ Call next() only when everything is fine
  } catch (error) {
    res.status(401).json({ message: "❌ Authentication failed" });
  }
};

// 🔒 Middleware to check authorization (role-based access)
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: "🚫 Forbidden: Insufficient permissions" });
      return;
    }

    next(); // ✅ Call next() if authorized
  };
};*/

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../Athuintication/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

// ✅ Middleware to protect routes (authentication required)
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized. No token provided" });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Unauthorized. Invalid token" });
      return;
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, type: true },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized. User not found" });
      return;
    }

    // ✅ Attach user to request
    req.user = { id: user.id, role: user.type };
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

// ✅ Middleware to authorize specific roles (e.g., "admin")
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};
