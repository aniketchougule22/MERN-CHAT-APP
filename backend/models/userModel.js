const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },

    pic: {
      type: String,
      required: [true, "pic is required"],
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;