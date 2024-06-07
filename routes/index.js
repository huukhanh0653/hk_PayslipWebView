const router = require('express').Router();
const passport = require('passport');
const Payslip = require("../models/Payslip");
const { isAuthenticated, isAdmin } = require("../middleware/auth")
const User = require("../models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

router.get("/", function (req, res, next) {
  res.redirect("/login");
})

router.get('/login', function (req, res, next) {
  res.render('page/login', {
    title: 'Payslip', layout: 'login.hbs'
  })
})

router.post('/auth', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { next(err); }
    if (!user) { return res.status(401).json({ message: "Unauthorized" }); }
    req.logIn(user, (err) => {
      if (err) { next(err); }
      if (user.Admin) res.redirect('/admin');
      else
        res.redirect('/payslip/' + user.Emp_Code)
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    console.log(req.user)
    req.session.destroy();
      if (err) { return next(err); }
      res.redirect('/login');
  });
});

// Find payslip
router.get("/payslip/:Emp_Code", isAuthenticated, async (req, res) => {
  try {
    const payslip = await Payslip.findOne({ "Emp_Code": req.user.Emp_Code }).lean();
    res.status(200).render("page/table.hbs", { layout: 'table.hbs', Payslip: payslip });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;