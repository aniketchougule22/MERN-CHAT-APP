const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");
const chatModel = require("../models/chatModel");
const asyncHandler = require("express-async-handler");

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: "something went wrong..!",
            error: error.stack,
        });
    }

    var create = await messageModel.create({
        sender: req.user._id,
        content: content,
        chat: chatId
    });

    create = await create.populate("sender", "name pic");
    create = await create.populate("chat");
    create = await userModel.populate(create, {
        path: "chat.users",
        select: "name pic email"
    });
    
    await chatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: create });
    // console.log('create', create);

    res.status(200).json({
        status: true,
        statusCode: 200,
        data: create
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const get = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: get
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack
    });
  }
});

module.exports = {
  sendMessage,
  allMessages,
};
