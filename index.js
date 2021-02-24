const path = require("path");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

app.use(helmet());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// read data stored in cookies
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Are we still OK?");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

// the login action process
app.post("/process_login", (req, res) => {
  // req.body is made by urlencoded, which parses the http message for sent data
  const username = req.body.username;
  const password = req.body.password;
  // make a password check and redirect to the appropriate url
  if (password === "x") {
    // save the stored username on the cookie
    res.cookie("username", username);
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail");
  }
  // res.json(req.body);
});

// the page we get redirected to if everything is correct
app.get("/welcome", (req, res) => {
  console.log(req.cookies);
  res.render("welcome", {
    // read stored cookie from the cookies over the wire through the cookieParser, since express cannot do that
    username: req.cookies.username,
  });
});

// on clicking logout
app.get("/logout", (req, res, next) => {
  // clear the cookie information stored on the browser or client
  res.clearCookie("username");
  // redirect back to the login
  res.redirect("/login");
});

app.listen(3000);

console.log("Listening on port 3000");
