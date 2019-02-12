const express = require("express");
const router = express.Router();


router.get("/add", (req, res, next) => {
  res.render("addpost", {"title": "Add Post"});
});

module.exports = router;
