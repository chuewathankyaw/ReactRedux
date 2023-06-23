const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose') 
const bodyParser = require('body-parser')
const path = require('path')
const userRoutes = require('./routes/user.js')
const jwt = require('jsonwebtoken');
const user = require('./model/user.js')
dotenv.config();
const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/ProfileImages",
  express.static(path.join(__dirname, "ProfileImages"))
);

mongoose
  .connect(
    process.env.MONGO_URL,
    // "mongodb+srv://testing123:testing123@cluster0.nmtta3p.mongodb.net/?retryWrites=true&w=majority",

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

app.use(userRoutes);




// app.post("/users", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();

//     res.status(201).json({ message: "User created" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.post("/register", (req, res) => {
//   const { Name, email, password } = req.body;
//   User.findOne({ email: email }, (err, user) => {
//     if (user) {
//       res.send({ message: "User already have" });
//     } else {
//       const user = new User({
//         Name,
//         email,
//         password,
//       });
//       user.save((err) => {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send({ message: "Successful registered" });
//         }
//       });
//     }
//   });
// });

app.listen(7003, () => {
  console.log("starting in 7003");
});
