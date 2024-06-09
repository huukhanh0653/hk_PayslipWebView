const router = require('express').Router();
const passport = require('passport');
const Payslip = require("../models/Payslip");
const {isAuthenticated} = require("../middleware/auth")
const User = require("../models/User");
const {compile} = require("../config/handlebars");

require("dotenv").config();

router.get("/", function (req, res, next) {
    res.redirect("/login");
})

router.get('/login', function (req, res, next) {
    res.status(200).send(compile('pages/login.hbs', {
        title: 'Payslip', layout: 'login.hbs'
    }))
})

router.post('/auth', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(401).json({message: "Unauthorized"});
        req.logIn(user, (err) => {
            if (err) return next(err);
            if (user.Admin) res.redirect('/admin'); else res.redirect('/payslip/' + user.Emp_Code)
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        req.session.destroy();
        if (err) return next(err);
        res.redirect('/login');
    });
});

// Find payslip
router.get("/payslip/:Emp_Code", isAuthenticated, async (req, res) => {
    try {
        console.log(req.user)
        const payslip = await Payslip.findOne({"Emp_Code": req.user.Emp_Code}).lean();
        console.log(payslip)
        res.status(200).send(compile('pages/table.hbs', {layout: 'table.hbs', Payslip: payslip}));
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;