const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
  } catch (error) {
    return error;
  }
};

module.exports = generateToken;
