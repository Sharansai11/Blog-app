//create user api app
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../Middleware/verifyToken')
require("dotenv").config();

let userscollection;
let articlescollection;
//get userscollection app
userApp.use((req, res, next) => {
  userscollection = req.app.get("userscollection");
  articlescollection = req.app.get("articlescollection");
  next();
});

//user registration route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    //get user resource from client
    const newUser = req.body;
    //check for duplicate user based on username
    const dbuser = await userscollection.findOne({ username: newUser.username });
    //if user found in db
    if (dbuser !== null) {
      res.send({ message: "User existed" });
    } else {
      //hash the password
      const hashedPassword = await bcryptjs.hash(newUser.password, 6);
      //replace plain pw with hashed pw
      newUser.password = hashedPassword;
      //create user
      await userscollection.insertOne(newUser);
      //send res
      res.send({ message: "User created" });
    }
  })
);

//user login
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body;
    //check for username
    const dbuser = await userscollection.findOne({
      username: userCred.username,
    });
    if (dbuser === null) {
      res.send({ message: "Invalid username" });
    } else {
      //check for password
      const status = await bcryptjs.compare(userCred.password, dbuser.password);
      if (status === false) {
        res.send({ message: "Invalid password" });
      } else {
        //create jwt token and encode it
        const signedToken = jwt.sign(
          { username: dbuser.username },
          process.env.SECRET_KEY,
          { expiresIn: '1d' }
        );
        //send res
        res.send({
          message: "login success",
          token: signedToken,
          user: dbuser,
        });
      }
    }
  })
);

//get articles of all authors
userApp.get(
  "/articles",verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get articlescollection from express app
    const articlescollection = req.app.get("articlescollection");
    //get all articles
    let articlesList = await articlescollection
      .find({ status: true })
      .toArray();
    //send res
    res.send({ message: "articles", payload: articlesList });
  })
);
userApp.get('/articles/:articleId', verifyToken, expressAsyncHandler(async (req, res) => {
  // Extract the article ID from the URL and convert it to a number
  const articleIdFromUrl = +req.params.articleId;

  // Get articles whose status is true and match the articleIdFromUrl
  const articlesList = await articlescollection.find({
    status: true,
    articleId: articleIdFromUrl
  }).toArray();

  // Send the response
  res.send({ message: "List of articles", payload: articlesList });
}));


//post comments for an arcicle by atricle id
userApp.post(
  "/comment/:articleId", verifyToken,
  expressAsyncHandler(async (req, res) => {
    try {
      // Get user comment object from the request body
      const userComment = req.body;
      // Get the article ID from the URL and convert it to a number
      const articleIdFromUrl = +req.params.articleId;

      // Insert the userComment object into the comments array of the article by ID
      let result = await articlescollection.findOneAndUpdate(
        { articleId: articleIdFromUrl },
        { $addToSet: { comments: userComment } }, // or use $push if you want to always add the comment
        { returnOriginal: false } // Option to return the updated document
      );

      console.log(result);
      res.send({ message: "Comment posted", payload: result}); // Return the updated document
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).send({ message: "Failed to post comment", error });
    }
  })
);


//export userApp
module.exports = userApp;