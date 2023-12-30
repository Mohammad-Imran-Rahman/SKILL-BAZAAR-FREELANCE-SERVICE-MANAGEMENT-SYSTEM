import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "In Progress",
        "Canceled",
        "Failed",
        "Delivered",
        "Completed"
      ]
    },
    work:{
      url: String,
      publicId: String
    },
    total: {
      type: Number,
    },
    stripeId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
