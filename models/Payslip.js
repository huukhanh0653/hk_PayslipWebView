const mongoose = require("mongoose");

const PayslipSchema = new mongoose.Schema(
    {
        fff: { type: String },
        Dept: { type: String },
        Class: { type: String },
        Office: { type: String },
        CO: { type: String },
        BU: { type: String },
        NO: { type: String },
        Emp_Code: { type: String },
        Full_Name: { type: String },
        Name_2: { type: String },
        Basic_Salary: { type: Number },
        No_Pay: { type: Number },
        Pay: { type: Number },
        Sick_Day: { type: Number },
        Allowance: { type: Number },
        Overtime: { type: Number },
        Incentive: { type: Object },
        Bonus: { type: Object }, // 13th month salary paid
        Salary_Adjustment: { type: Number },
        Others_Expense: { type: Object },
        Social: { type: Number },
        Health: { type: Number },
        Unemployment: { type: Number },
        Self_Reduce: { type: Number },
        No_Of_Dependent: { type: Number },
        Family_Reduce: { type: Number },
        Tax: { type: Number },
        Advance: { type: Number },
        Union_Fee: { type: Number },
        Net: { type: Number },
        Upload_Date: {type: Date},
    },
    { timestamps: true }
)

module.exports = mongoose.model("Payslip", PayslipSchema);