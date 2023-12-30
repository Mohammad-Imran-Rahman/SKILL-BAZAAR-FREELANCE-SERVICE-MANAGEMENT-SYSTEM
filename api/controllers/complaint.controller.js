import Complaint from "../models/complaint.model.js";
import { cloudinaryDeleteImg, gigsImageUpload } from "../utils/cloudinary.js";
import createError from "../utils/createError.js";

export const createComplaint = async (req, res, next) => {
    if (req.files)
        req.body.photo = await gigsImageUpload(req.files, `Fiver/Complaint`)

    const newComplaint = new Complaint({
      userId: req.userId,
      ...req.body,
    });
  
    try {
      const savedComplaint = await newComplaint.save();
      if(savedComplaint) res.status(201).json(newComplaint);
      else res.status(401).json("Something went wrong.");
    } catch (err) {
      next(err);
    }
  };