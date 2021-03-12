var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get("/register", (req, res, next) => {
  res.send("GET /register");
})

router.post("/register", (req, res, next) => {
  res.send("POST /register");
})

router.get("/login", (req, res, next) => {
  res.send("GET /login");
})

router.post("/login", (req, res, next) => {
  res.send("POST /login");
})

router.get("/logout", (req, res, next) => {
  res.send("GET /logout");
})

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
