const express = require("express");
const router = express.Router();

// instead of app.get() we now do

router.get("/", (req, res, next) => {
  res.json({
    message: "Router works",
  });
});

module.exports = router;
