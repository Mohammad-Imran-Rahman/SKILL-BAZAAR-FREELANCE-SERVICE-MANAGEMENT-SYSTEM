import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  content: {
    type: String,
    trim: true,
    require: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    require: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Message", MessageSchema)