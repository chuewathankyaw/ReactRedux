const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const mainPath = require("./baseFilepath");

dotenv.config();

// const getUserInfo = (req, res) => {
//   res.render("index/index", {
//     pageTitle: "Info",
//     path: "/post",
//   });
// };

// const longinInfo = (req, res) => {
//   res.render("index/login", {
//     path: "/login",
//     pageTitle: "Login",
//   });
// };

// const home = (req, res) => {
//   res.render("index/home", {
//     pageTitle: "Home",
//     path: "/home",
//   });
// };

const postUserInfo = asyncHandler(async (req, res) => {
  let { name, email, password, gender } = req.body;

  name = (name || "").trim();
  email = (email || "").trim();
  password = (password || "").trim();

  if (!name || !email || !password) {
    res.status(400).json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.status(400).json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.status(400).json({
      status: "FAITLED",
      message: "Invalid email entered",
    });
  } else if (password.length < 4) {
    res.status(400).json({
      status: "FAILED",
      message: "password is too short!",
    });
  } else {
    await User.find({ email })
      .then((result) => {
        if (result.length) {
          res.status(400).json({
            status: "FAILED",
            message: "User with the provided email already exists",
          });
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const nweUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                gender: gender,
              });
              nweUser
                .save()
                .then((result) => {
                  console.log("user login is success");
                  res.status(201).json(result);

                  // res.redirect("/post");
                })
                .catch((err) => {
                  res.status(400).json({
                    status: "FAILED",
                    message: "An error occurred while saving user account!",
                  });
                });
            })
            .catch((err) => {
              res.status(400).json({
                status: "FAILED",
                message: "An error occurred while hashing password!",
              });
            });
        }
      })
      .catch((err) => {
        res.status(400).json({
          status: "FAILED",
          message: "An error occured while checking for existing user!",
        });
      });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  email = (email || "").trim();
  password = (password || "").trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      User.updateOne({ _id: user.id }, { login: true })
        .then((result) => {
          res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            login: true,
            token: generateToken(user._id),
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: "FAILED",
            message: "An error occur while updating login data update",
          });
        });
    } else {
      res.status(400).json({
        status: "FAILED",
        message: "Email or Password is something wrong",
      });
    }
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, gender } = req.body;
  const id = req.user.id;

  if (!req.user) {
    return res.status(404).json({
      status: "FAILED",
      message: "user not found",
    });
  }

  //update user
  await User.updateOne(
    { _id: id },
    {
      $set: {
        name: name,
        login: true,
        gender: gender,
      },
    }
  );

  const updateData = await User.findById(id);
  res.status(200).json({
    _id: id,
    name: updateData.name,
    gender: updateData.gender,
    email: updateData.email,
    login: updateData.login,
    profilePicture: updateData.profilePicture,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const profilePicture = req.file;

  const id = req.user.id;
  const userDetail = await User.findById(id);

  if (!req.user) {
    return res.status(404).json({
      status: "FAILED",
      message: "user not found",
    });
  }

  let filesArray = [];
  if (profilePicture !== undefined && profilePicture !== []) {
    const file = {
      fileName: profilePicture.filename,
      filePath: profilePicture.path,
      fileType: profilePicture.mimetype,
      fileSize: fileSizeFormatter(profilePicture.size, 2),
    };
    filesArray.push(file);

    if (userDetail.profilePicture[0] !== "") {
      //for Image File to when when we do update picture
      fs.unlink(
        path.join(mainPath, userDetail.profilePicture[0].filePath),
        (err) => {
          if (err) {
            return console.log("error occur", err);
          }
          console.log("file is deleted successully");
        }
      );
    }

    await User.updateOne(
      { _id: id },
      {
        $set: {
          profilePicture: filesArray,
        },
      }
    );
  }
  const updatedData = await User.findById(id);
  res.status(200).json({
    _id: id,
    name: updatedData.name,
    email: updatedData.email,
    gender: updatedData.gender,
    profilePicture: updatedData.profilePicture,
    login: updatedData.login,
  });
});

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 byte";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + "-" + sizes[index]
  );
};

const deleteUser = async (req, res) => {
  const id = req.user.id;

  const userDetail = await User.findById(id);

  if (!req.user) {
    return res.status(404).json({
      status: "FAILED",
      message: "user not found",
    });
  }
  userDetail.image[0] === "" || userDetail.image.length === 0
    ? console.log("file is empty file")
    : fs.unlink(path.join(mainPath, userDetail.image[0].filePath), (err) => {
        // return fs.unlink(path.join(data.filePath), (err) => {
        if (err) {
          return console.log("error occur", err);
        }
        console.log("file is deleted successully");
      });

  await User.findByIdAndRemove(id).exec();
  res.status(200).json("User Account Deleted Successfully");
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const userdetail = await User.findById(id);
    res.status(200).send(userdetail);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, `${process.env.SECRET_TOKEN}`, {
    expiresIn: "30d",
  });
};

module.exports = {
  postUserInfo,
  loginUser,
  deleteUser,
  updateUser,
  updateUserProfile,
  getAllUser,
  getDetail,
  // loginUser,
};
