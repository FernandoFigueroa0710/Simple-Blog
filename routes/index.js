const express = require("express");
const router = express.Router();
const mongo = require("mongodb");
const db = require("monk")("localhost/simpleblog");

/* GET home page. */
router.get("/", (req, res, next) => {
  const db = req.db;
  const posts = db.get("posts");
  posts.find({}, {}, (err, posts) => {
    res.render("index", { posts: posts });
  });
});

module.exports = router;
