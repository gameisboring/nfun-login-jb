/* eslint-disable no-console */
const express = require("express");

const router = express.Router();

/* GET login page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.get("/home", (req, res) => {
  res.render("home", { title: "Express" });
});

module.exports = router;
