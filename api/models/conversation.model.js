import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    latestMessage: {
      type: {},
      ref: "User",
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
