import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import path from 'path';
import express from 'express'
import { connectDB } from './config/connection.js';

dotenv.config();
const PORT = process.env.PORT || 3000; 

const server = createServer(app);


const dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") { 
  app.use(express.static(path.join(dirname, "/frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server and connect to the database
server.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});