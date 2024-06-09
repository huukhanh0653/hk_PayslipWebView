const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const env = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const {initializeHandlebars, compile} = require("./config/handlebars");
const Payslip = require('./models/Payslip');

env.config();

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("DB Connection Successfully!"))
    .catch((err) => {
        console.log(err);
    });

// View engine
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

// import configurations
require('./config/passport');
initializeHandlebars();

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 15 }
}))

app.use(passport.initialize())
app.use(passport.session())

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");

app.use('/', indexRouter);
app.use('/admin', adminRouter);


app.get('/testing', function (req, res, next) {
    res.status(200).send(compile('pages/admin.hbs', {
        layout: 'admin.hbs'
    }))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;