const User = require('../models/user');
const passport = require('passport');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto');

module.exports = {
    getRegister(req, res, next) {
        if (req.isAuthenticated()) {
          req.session.error = 'Please logout before ';
          return res.redirect('back');
        }
        res.render('register', { title: 'Register', email: '', first: "", last: "", code: "" });
    },
    postRegister: async (req, res, next) => {
        try {
          if (req.file) {
            const { path:url, filename } = req.file;
            req.body.avatar = { url, filename };
          }
          const user = await User.register(new User(req.body), req.body.password);
          req.login(user, function(err) {
            if (err) return next(err);
            req.session.success = `Welcome to QP Maker, ${user.first} ${user.last}!`
            res.redirect('/');
          });
        } catch(err) {
          console.log(err);
          const { email, first, last, code } = req.body;
          let error = err.message;
          if (error.includes('A user with the given username')) {
            error = 'A user with the given email is already registered';
          }
          res.render('register', { title: 'Register', email, first, last, code, error });
        }
      }
}