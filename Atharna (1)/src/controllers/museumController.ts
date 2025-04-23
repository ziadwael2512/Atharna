import { Request, Response } from "express";
import { PrismaClient, Governorate, Category } from "@prisma/client";

const prisma = new PrismaClient();

export const searchMuseumsByLocation = async (req: Request, res: Response) => {
  try {
    const { location } = req.query;

    if (!location || typeof location !== "string") {
        res.status(400).json({ error: "Location query parameter is required." })
        return ;
    }

    // upperCase & convert white space with underscore
    const formattedLocation = location.trim().toUpperCase().replace(/\s+/g, "_");

    // check Governorate enum
    if (!(formattedLocation in Governorate)) {
        res.status(400).json({ error: "Invalid location. Please enter a valid governorate." })  
      return ;
    }

    // Query museums 
    const museums = await prisma.museum.findMany({
      where: {
        location: formattedLocation as Governorate,
      },
    });

    res.json(museums);
  } catch (error) {
    console.error("Error searching museums:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const searchMuseumsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (!type || typeof type !== "string") {
        res.status(400).json({ error: "Type query parameter is required." })
      return;
    }

    // upperCase & convert white space with underscore
    // trim is to remove the intial space => ( cairo)
    const formattedType = type.trim().toUpperCase().replace(/\s+/g, "_");

    // check Category enum
    if (!(formattedType in Category)) {
        res.status(400).json({ error: "Invalid type. Please enter a valid category." })
      return ;
    }

    // Query museums 
    const museums = await prisma.museum.findMany({
      where: {
        type: formattedType as Category,
      },
    });

    res.json(museums);
  } catch (error) {
    console.error("Error searching museums by type:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getInfo = async (req: Request, res: Response) => {
    try {
      const { name } = req.query;
  
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Name query parameter is required." })
        return ;
      }
  
      // Query museums 
      const museums = await prisma.museum.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive", // Case-insensitive search
          },
        },
      });
  
      res.json(museums);
    } catch (error) {
      console.error("Error searching museums by name:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const updateTicketPrice = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; 
      const { ticketPrice } = req.body; 
  
      // Validate ID 
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid museum ID. It must be a number." })
        return ;
      }
  
      // Validate ticketPrice 
      if (ticketPrice === undefined || isNaN(Number(ticketPrice)) || Number(ticketPrice) < 0) {
        res.status(400).json({ error: "Invalid ticket price. It must be a positive number." })
        return ;
      }
  
      // Convert values to the correct types
      const museumId = Number(id);
      const newPrice = Number(ticketPrice);
  
      const existingMuseum = await prisma.museum.findUnique({
        where: { id: museumId },
      });
  
      if (!existingMuseum) {
        res.status(404).json({ error: "Museum not found." })
        return ;
      }
  
      // Update the price
      const updatedMuseum = await prisma.museum.update({
        where: { id: museumId },
        data: { ticketPrice: newPrice },
      });
  
      res.json({ message: "Ticket price updated successfully.", museum: updatedMuseum });
    } catch (error) {
      console.error("Error updating ticket price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


export const createMuseum = async (req: Request, res: Response) => {
  try {
    const { name, type, location, info, ticketPrice } = req.body;

    if (!name || !type || !location || !info || ticketPrice === undefined) {
      res.status(400).json({ error: "All fields (name, type, location, info, ticketPrice) are required." });
      return ;
    }

    // Convert to match enum 
    const formattedLocation = location.trim().toUpperCase().replace(/\s+/g, "_");
    const formattedType = type.trim().toUpperCase().replace(/\s+/g, "_");
    
    // Validate location and type
    if (!(formattedLocation in Governorate)) {
      res.status(400).json({ error: "Invalid location. Please enter a valid governorate." });
      return;
    }

    if (!(formattedType in Category)) {
      res.status(400).json({ error: "Invalid type. Please enter a valid category." });
      return;
    }

    // Validate ticket price
    if (!Number.isInteger(ticketPrice) || ticketPrice < 0) {
      res.status(400).json({ error: "Ticket price must be a non-negative integer." });
      return;
    }

    // Create in DB
    const newMuseum = await prisma.museum.create({
      data: {
        name,
        type: formattedType as Category,
        location: formattedLocation as Governorate,
        info,
        ticketPrice,
      },
    });

    res.status(201).json(newMuseum);
  } catch (error) {
    console.error("Error creating museum:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const deleteMuseumById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    const museumId = parseInt(id);
    if (isNaN(museumId) || museumId <= 0) {
      res.status(400).json({ error: "Invalid museum ID. It must be a positive integer." });
      return;
    }

    // Check if museum exists
    const existingMuseum = await prisma.museum.findUnique({
      where: { id: museumId },
    });

    if (!existingMuseum) {
      res.status(404).json({ error: "Museum not found." });
      return;
    }

    // Delete the museum
    await prisma.museum.delete({
      where: { id: museumId },
    });

    res.json({ message: "Museum deleted successfully." });
  } catch (error) {
    console.error("Error deleting museum:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateMuseumInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { info } = req.body; 

    // Validate ID
    const museumId = parseInt(id);
    if (isNaN(museumId) || museumId <= 0) {
      res.status(400).json({ error: "Invalid museum ID. It must be a positive integer." });
      return;
    }

    // Validate Info
    if (!info || typeof info !== "string" || info.trim().length === 0) {
      res.status(400).json({ error: "New info is required and must be a non-empty string." });
      return;
    }

    // Check if  exists
    const existingMuseum = await prisma.museum.findUnique({
      where: { id: museumId },
    });

    if (!existingMuseum) {
      res.status(404).json({ error: "Museum not found." });
      return;
    }

    // Update museum info
    const updatedMuseum = await prisma.museum.update({
      where: { id: museumId },
      data: { info },
    });

    res.json({ message: "Museum info updated successfully.", museum: updatedMuseum });
  } catch (error) {
    console.error("Error updating museum info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllMuseums = async (req: Request, res: Response) => {
  try {
    const museums = await prisma.museum.findMany();
    res.json(museums);
  } catch (error) {
    console.error("Error fetching museums:", error);
    res.status(500).json({ error: "Internal server error"});
}
};
export const searchMuseumsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Name query parameter is required." });
      return;
    }

    const museums = await prisma.museum.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    res.json(museums);
  } catch (error) {
    console.error("Error searching museums by name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMuseumById= async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID query parameter is required." });
      return;
    }

    const museum = await prisma.museum.findUnique({
      where: { id: parseInt(id) }
    });

    if (!museum) {
      res.status(404).json({ error: "Museum not found" });
      return;
    }

    res.json(museum);
  } catch (error) {
    console.error("Error fetching museum:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};