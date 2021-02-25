const path = require("path");
const express = require("express");
const app = express();
const helmet = require("helmet");

const router = require("./theRouter");

app.use(helmet());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to now get to the path we want
app.use("/", router);

app.listen(3000, () => {
  console.log("Serving our files on port 3000");
});
