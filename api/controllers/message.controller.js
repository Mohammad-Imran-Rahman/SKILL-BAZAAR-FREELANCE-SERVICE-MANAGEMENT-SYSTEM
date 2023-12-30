import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import userModel from "../models/user.model.js";

export const createMessage = async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(createError(400, "Something wents wrong."))
  }

  let newMsg = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };

  try {
    let createMessage = await Message.create(newMsg);

    let result = await Message.findOne({ _id: createMessage._id }).populate("sender", "username photo email").populate("chat")
    let message = await userModel.populate(result, {
      path: "chat.users",
      select: "username photo email",
    });

    await Conversation.findByIdAndUpdate(chatId,
      {
        $set : {latestMessage: result, readBy: [req.userId]}
      },
      {
        new: true,
      })
    res.status(200).send(message);
  } catch (error) {
    next(error)
  }
};
export const getMessages = async (req, res, next) => {
  try {
    const msg = await Message.find({ chat: req.params.id })
      .populate("sender", "username photo email").populate("chat")

    const chat = await Conversation.findById(req.params.id).populate("users", "-password");

    res.status(200).json({msg:msg, chat:chat});
  } catch (error) {
    next(error)
  }
};
