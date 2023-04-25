const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const accessChat = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.sendStatus(400);
    }

    let isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const create = await chatModel.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const chat = await chatModel
        .findOne({ _id: create._id })
        .populate("users", "-password");
      res.status(200).send({ status: true, statusCode: 200, data: chat });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).json({
          status: true,
          statusCode: 200,
          data: results,
        });
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

const createGroupChat = asyncHandler(async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "please fill all the fields..!" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send({
        message: "More than 2 users are required to form a group chat..!",
      });
    }

    users.push(req.user);

    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: fullGroupChat,
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

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const update = await chatModel
      .findByIdAndUpdate(chatId, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!update) {
      res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Chat not found..!",
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Chat updated successfully..!",
        data: update,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const update = await chatModel
      .findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!update) {
      res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Chat not found..!",
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added successfully..!",
        data: update,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const remove = await chatModel
      .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!remove) {
      res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Chat not found..!",
      });
    } else {
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Removed successfully..!",
        data: remove,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
