const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },

    login: {
      type: Boolean,
      default: false,
    },
    // comfirmpassword: {
    //   type: String,
    //   require: true,
    // },
    gender: {
      type: String,
    },
    profilePicture: {
      type: [],
      default: "",
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("user", UserSchema)
module.exports = UserModel
