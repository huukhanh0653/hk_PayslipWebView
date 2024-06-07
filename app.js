const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const env = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const handlebars = require("./config/handlebars");
const Payslip = require('./models/Payslip');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

env.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB Connection Successfully!"))
  .catch((err) => {
    console.log(err);
  });

// View engine
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// import configurations
require('./config/passport');

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

app.get('/testing', function (req, res, next){
  res.render('page/index.admin.hbs', {layout: 'admin.hbs', })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
