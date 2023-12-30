import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import complaintRoute from "./routes/complaint.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

//MongoDB Connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/order", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/complaint", complaintRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

const host = app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});

const io = new Server(host, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  },
})

io.on("connection", (socket) => {
  console.log('connected to socket.io')

  socket.on("setup", (userData)=>{
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on('join chat', (room) => {
    socket.join(room)
  })

  socket.on("new msg", (newMsgRecieved)=>{
    var chat = newMsgRecieved.chat
    if(!chat.users) return console.log("chat.users not defined")

    chat.users.forEach((user)=>{
       if(user._id == newMsgRecieved.sender._id) return;
       socket.in(user._id).emit("msg recieved", newMsgRecieved)
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
