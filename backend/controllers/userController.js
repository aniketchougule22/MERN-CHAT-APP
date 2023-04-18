const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../services/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    const get = await userModel.findOne({ email });
    if (!get) {
      const create = await userModel.create({ name, email, password, pic });
      if (create) {
        const token = generateToken(create._id);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "User inserted successfully..!",
          data: create,
          token,
        });
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "something went wrong..!",
          error: create,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Email already exists..!",
      });
    }
  } catch (error) {
    // console.log("error", error);
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "something went wrong..!",
      error: error.stack,
    });
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const get = await userModel.findOne({ email });
    if (get && (await get.matchPassword(password))) {
      const token = generateToken(get._id);
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Logged in successfully..!",
        data: get,
        token,
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invalid Email OR Password..!",
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
  registerUser,
  authUser,
};
