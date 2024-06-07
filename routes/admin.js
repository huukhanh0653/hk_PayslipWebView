const router = require('express').Router();
const passport = require('passport');
const Payslip = require("../models/Payslip");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/auth");
const { keyMap, changeKeys, fixData } = require("../utils/utils");
const multer = require('multer');
const XLSX = require('xlsx');

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", isAdmin, function (req, res, next) {
  res.render('page/uploadFile.hbs', { layout: 'admin.hbs' })
})

router.post('/upload/account',
  isAdmin,
  upload.array('files'), async (req, res, next) => {
    try {
      const files = req.files;
      for (file in files) {
        let workbook = XLSX.read(file.buffer, { type: 'buffer' });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = xlsx.utils.sheet_to_json(sheet);
        jsonData = jsonData.map(obj => changeKeys(obj, keyMap))
        for (row in jsonData) {
          await User.create({
            Emp_Code: row.Emp_Code,
            Email: row.Email,
            Password: bcrypt.hashSync(row.Password, parseInt(process.env.SALT)),
            Admin: row.Admin || false
          });
        }
      }
    } catch (err) {
      next(err);
    }
    res.status(200).json({ message: "Data uploaded successfully!" })

  });

router.post('/upload/payslip',
  isAdmin,
  upload.array('files'), async (req, res, next) => {
    try {
      const files = req.files;
      for (file in files) {
        let workbook = XLSX.read(file.buffer, { type: 'buffer' });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = xlsx.utils.sheet_to_json(sheet);
        jsonData = jsonData.map(obj => changeKeys(obj, keyMap))
        jsonData = jsonData.map(obj => fixData(obj, keyMap))
        const addNewData = await Payslip.create(jsonData);
      }
    } catch (err) {
      next(err);
    }
    res.status(200).json({ message: "Data uploaded successfully!" })
  })

  router.post('/register', async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ Emp_Code: req.body.Emp_Code });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      console.log(req.body)
      const NewUser = new User({
        Emp_Code: req.body.Emp_Code,
        Email: req.body.Email,
        Password: bcrypt.hashSync(req.body.Password, parseInt(process.env.SALT)),
        Admin: req.body.Admin || false
      });
  
      const savedUser = await NewUser.save();
      res.status(200).json(savedUser);
    } catch (err) {
      next(err);
    }
  });  

router.post('/change-info', isAdmin, async function (req, res, next) {
  try {
    if (req.query.newPassword !== req.query.confirmedPassword)
      return res.status(400).json({ message: 'confirmed password does not match new password' })
    let user = await User.findOne({ Email: req.query.email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exists' });
    }

    user.Password = req.query.newpassword;

    const savedUser = await NewUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    next(err);
  }
})

module.exports = router;