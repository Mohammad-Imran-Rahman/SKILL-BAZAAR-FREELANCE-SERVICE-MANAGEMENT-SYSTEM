import mongoose from "mongoose";
const { Schema } = mongoose;

const ComplaintSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        regarding: {
            type: String,
            required: true,
        },
        photo: [{
            url: String,
            publicId: String
        }],
        desc: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Complaint", ComplaintSchema);
