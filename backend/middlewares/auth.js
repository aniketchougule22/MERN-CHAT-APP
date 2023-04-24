const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const isValidToken = asyncHandler(async (req, res, next) => {
    // check if authentication header exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            let token = req.headers.authorization.split(" ")[1];      //get the token
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = await userModel.findById(decode.id).select('-password');
                next();
            } else {
                res.status(401).json({
                    status: false,
                    msg: "Unauthorized! Please login",
                });
            }
            
        } catch (error) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "something went wrong..!",
                error: error.stack
            });
        }   
    } else {
        res.status(401).json({
            status: false,
            msg: "Unauthorized! Please login",
        });
    }
});

module.exports = {
    isValidToken
};