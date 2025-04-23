import app from './app';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import path from 'path';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`server is running on localhost ${PORT}`)
});

app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });
  
  app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // use '../' if using dist folder
