const express = require('express')
const userInfo = require('../controller/user.js')
const { protect } = require("../middleware/auth.js")
const { profileImgs } = require("../middleware/imageauth.js");

const routes = express.Router();

// routes.get("/post", userInfo.getUserInfo);
// routes.get('/login', userInfo.longinInfo)
// routes.get('/home', userInfo.home)
routes.get("/alluser", userInfo.getAllUser)
routes.get("/detail/:id", userInfo.getDetail)
routes.post('/post', userInfo.postUserInfo)
routes.post('/login', userInfo.loginUser)
routes.put("/profileupdate/:id", protect, profileImgs, userInfo.updateUserProfile)
routes.put("/update/:id", protect, userInfo.updateUser)
routes.delete('/delete/:id',protect, userInfo.deleteUser)
module.exports= routes;