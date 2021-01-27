var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("index", {
        info: "fail"
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      if (req.session.returnTo) {
        return res.redirect(req.session.returnTo); // Redirects to previous page
      }

      return res.redirect("/dashboard"); // Redirects to event list
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  req.session = null;
  res.redirect('/');
});

module.exports = router;