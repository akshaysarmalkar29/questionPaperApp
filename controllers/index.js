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
      },
      getLogin(req, res, next) {
        if (req.isAuthenticated()) return res.redirect('/');
        if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
        res.render('login', { title: 'Login' });
      },
      async postLogin(req, res, next) {
        const { email, password } = req.body;
        const { user, error } = await User.authenticate()(email, password);
        if (!user && error) return next(error);
        req.login(user, function(err) {
          if (err) return next(err);
          req.session.success = `Welcome back, ${user.first} ${user.last}!`;
          const redirectUrl = req.session.redirectTo || '/';
          delete req.session.redirectTo;
          res.redirect(redirectUrl);
        });
      },
      getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
      },
}