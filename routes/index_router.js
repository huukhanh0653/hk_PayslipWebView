const router = require('express').Router();
const passport = require('passport');
const Payslip = require("../models/Payslip");
const {isAuthenticated} = require("../middleware/auth")
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

router.get("/payslip/:Emp_Code", isAuthenticated, async (req, res) => {
    try {
        const order = req.query.order || 0;
        const payslip = await Payslip.find({"Emp_Code": req.params.Emp_Code }).lean();
        payslip.sort((a, b) => b.Upload_Date - a.Upload_Date);

        console.log(order)

        res.status(200).send(compile('pages/table.hbs', {layout: 'table.hbs', Payslip: payslip[order], Payslips: payslip}));
    } catch (err) {
        res.status(500).json(err);
    }
});

// // Find payslip
// router.get("/payslip/:Emp_Code", isAuthenticated, async (req, res) => {
//     try {
//         console.log(req.params)
//         const payslip = await Payslip.find({"Emp_Code": req.user.Emp_Code, Upload_Date:{}}).lean();
//         payslip.sort((a, b) => b.Upload_Date - a.Upload_Date);
//         res.status(200).send(compile('pages/table.hbs', {layout: 'table.hbs', Payslip: payslip[0]}));
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


module.exports = router;