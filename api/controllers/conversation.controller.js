import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createChat = async (req, res, next) => {
  const { userId } = req.body
  
  // Finding both user chat exist or not
  let isChat = await Conversation.find({
      $and: [
          { users: { $elemMatch: { $eq: req.userId } } },
          { users: { $elemMatch: { $eq: userId } } },
      ],
  }).populate("users", "-password").populate("latestMessage");

  isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username photo",
  });
  // Checking chat exist or not
  if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
  } else {
      let chatData = {
        users: [req.userId, userId],
        readBy: [req.userId, userId],
      };
      try {
          const createdChat = await Conversation.create(chatData);
          const chat = await Conversation.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
          );
          res.status(200).json(chat);
      } catch (error) {
          next(error)
      }
  }
}

export const updateConversation = async (req, res, next) => {
  try {
    console.log(req.userId)
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
         $push : {readBy: req.userId}
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id }).populate("users", "-password");
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    let results = Conversation.find({ users: { $elemMatch: { $eq: req.userId } } })
        .populate("users", "-password")
        .populate("latestMessage.sender")
        .sort({ updatedAt: -1 })
    
 results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "username photo",
    });
    res.status(200).send(results)
} catch (error) {
    next(error)
}
};
