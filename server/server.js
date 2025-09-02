import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin : "*"}
});

// Store Online Users
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Middleware
app.use(express.json({limit: "4mb"}));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use('/api/messages', messageRouter);

// MongoDB
await connectDB();

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`PORT was connected on ${PORT}`);
})
