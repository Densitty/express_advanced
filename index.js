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

// middleware to extract from the query string
app.use((req, res, next) => {
  if (req.query.status === "fail") {
    res.locals.msg =
      "Sorry. This username and password is incorrect. Please enter the correct details";
  } else {
    res.locals.msg = ``;
  }
  // send me to the next piece of middleware
  next();
});

app.get("/", (req, res) => {
  res.send("Are we still OK?");
});

app.get("/login", (req, res, next) => {
  // the request object has a query property in express, where we put all insecure data
  console.log(req.query);
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
    // "?" is a delimiter
    // everything before "?" is the actual path
    // everything after "?" is the query string and it's a key:value pair. More than one string gets separated by '&'
    res.redirect("/login?status=fail&message=incorrect details");
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

app.get("/story/:storyID", (req, res) => {
  res.send(`<h2>Story ${req.params.storyID}</h2>`);
});

app.get("/story/:storyID/:chapter", (req, res) => {
  res.send(`<h2>Story ${req.params.storyID} - ${req.params.chapter}</h2>`);
});

/* instead of having 3 routes to different pages, as below, we use req. params above for a single request to multiple routes */
/*
app.get("/story/1", (req, res) => {
  res.send("<h1>Story 1</h1>");
});

app.get("/story/2", (req, res) => {
  res.send("<h1>Story 1</h1>");
});
*/

// on clicking logout
app.get("/logout", (req, res, next) => {
  // clear the cookie information stored on the browser or client
  res.clearCookie("username");
  // redirect back to the login
  res.redirect("/login");
});

app.listen(3000);

console.log("Listening on port 3000");
