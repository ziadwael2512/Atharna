import express from 'express';
import authRoutes from './routes/authRouts';
import adminRoutes from './routes/adminRoutes';
import cors from 'cors';
import bodyParser from "body-parser";
import postRoutes from './routes/postRoutes';
import feedRoutes from './routes/feed.routes';
import MuseumRoutes  from  './routes/museumRoutes';



const app = express();
app.use(cors({
    origin: 'http://localhost:3000', //frontend URL
    credentials: true,
    exposedHeaders: "Authorization",
  }));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/posts", postRoutes);
app.use("/api", postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/museum', MuseumRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/api", feedRoutes); // <- this mounts GET /api/feed


// ✅ Register routes
app.use("/api", postRoutes); // so your full route becomes /api/feed

export default app;