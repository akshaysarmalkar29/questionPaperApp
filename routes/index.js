var express = require('express');
var router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');
const {getRegister, postRegister, getLogin, postLogin, getLogout} = require("../controllers");

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get("/register", getRegister);

router.post("/register", upload.single('image'), catchAsync(postRegister))

router.get("/login", getLogin)

router.post("/login", catchAsync(postLogin))

router.get("/logout", getLogout)

router.get("/profile/:user_id", (req, res, next) => {
  res.send("GET /profile/:user_id");
})

router.put("/profile/:user_id", (req, res, next) => {
  res.send("PUT /profile/:user_id");
})

router.get("/forgot", (req, res, next) => {
  res.send("GET /forgot");
})

router.post("/forgot", (req, res, next) => {
  res.send("POST /forgot");
})

router.get("/reset/:token", (req, res, next) => {
  res.send("GET /reset/:token");
})

router.put("/reset/:token", (req, res, next) => {
  res.send("PUT /reset/:token");
})

module.exports = router;
