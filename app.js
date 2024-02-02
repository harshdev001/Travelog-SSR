require('dotenv').config() 

const express = require("express");
const path = require("path");
const userRoute = require ("./Routes/user");
const blogRoute = require("./Routes/blog")
const Blog = require("./Models/Blog")
const { connectToMongoDB} = require('./connectors/connect');
const cookieParser = require('cookie-parser');
const { checkforAuthenticationCookie } = require("./Middleware/authentication");



const app = express();
const PORT = process.env.PORT || 300;

const mongoURL = process.env.MONGO_URL;
connectToMongoDB(mongoURL);



app.set('view engine','ejs');
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    navbar : "/images/logo.png",
    user: req.user,
    blogs: allBlogs,
  });
});
app.use('/user',userRoute);
app.use("/blog", blogRoute);

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})