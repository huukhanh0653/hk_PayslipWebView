const router = require('express').Router();
const Payslip = require("../models/Payslip");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/auth");
const { keyMap, changeKeys, fixData, isValidData } = require("../utils/utils");
const multer = require('multer');
const XLSX = require('xlsx');
const { compile } = require("../config/handlebars");

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20971520 } }).array('files');

router.get("/", isAdmin, function (req, res, next) {
    res.status(200).send(compile('pages/admin.hbs', {
        layout: 'admin.hbs'
    }))
});

// router.post('/upload/account', isAdmin, upload.array('files'), async (req, res, next) => {
//     try {
//         const files = req.files;
//         for (let file in files) {
//             let workbook = XLSX.read(file.buffer, {type: 'buffer'});
//             let sheet = workbook.Sheets[workbook.SheetNames[0]];
//             let jsonData = XLSX.utils.sheet_to_json(sheet);
//             jsonData = jsonData.map(obj => changeKeys(obj, keyMap))
//             for (let row in jsonData) {
//                 await User.create({
//                     Emp_Code: row.Emp_Code,
//                     Email: row.Email,
//                     Password: bcrypt.hashSync(row.Password, parseInt(process.env.SALT)),
//                     Admin: row.Admin || false
//                 });
//             }
//         }
//     } catch (err) {
//         next(err);
//     }
//     res.status(200).json({message: "Data uploaded successfully!"})

// });

router.post('/upload/payslip', isAdmin, async (req, res, next) => {
    upload(req, res, (err) => {
        try {
            const date = req.body.date;
            const files = req.files;
            files.map(file => {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                var totalJSON = []
                workbook.SheetNames.forEach(sheetName => {
                    let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);            
                    sheet.map(obj => {
                        if (isValidData(obj)) {
                            let converted = changeKeys(obj, keyMap);
                            converted.Upload_Date = (new Date(date));
                            converted = fixData(converted)
                            totalJSON.push(converted);
                        }
                    });
                });
                const addNewData = Payslip.create(totalJSON);
            })
        } catch (err) {
            next(err);
        }
        res.status(200).json({ message: 'Files uploaded successfully' });
    });
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
        res.status(200).send("Registered successfully!");
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