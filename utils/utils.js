const keyMap = {
    //! for Payslip JSON
    "fff": "fff",
    "DEPT": "Dept",
    "CLASS": "Class",
    "OFFICE": "Office",
    "CO": "CO",
    "BU": "BU",
    "No.": "No",
    "Emp.\r\nCode": "Emp_Code",
    "Full name": "Full_Name",
    'Name 2': "Name_2",
    "Basic Salary": "Basic_Salary",
    "NoPay (Absent)": "NoPay",
    "Pay (Working)": "Pay",
    SickPay: "SickPay",
    Allowance: "Allowance",
    Overtime: "Overtime",
    Incentive: "Incentive",
    "Bonus/13th Month Salary-PAID": "Bonus",
    "Salary Adjustment": "Salary_Adjustment",
    "Others Expense (Add or Deduct)": "Others_Expense",
    "Social 8%": "Social",
    'Health 1.5%': "Health",
    "Unemployment 1%": "Unemployment",
    "Self Reduce": "Self_Reduce",
    "No of Dependent": "No_Of_Dependent",
    'Family Reduce': "Family_Reduce",
    UnionFee: "Union_Fee",
    //! for User JSON
    'Employee Code':"Emp_Code",
    "Passkey": "Password"
  };

function changeKeys(obj, keyMap) {
    let newObj = {};
    for (let key in obj) {
        if (keyMap[key]) {
            newObj[keyMap[key]] = obj[key];
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

function fixData(data) {
    let newData = data;

    newData.Incentive = {
        "Value": data.Incentive,
        "Description": data.Description
    }

    newData.Bonus = {
        "Value": data.Bonus,
        "Description": data.Description_1
    }

    newData.Others_Expense = {
        "Value": data.Others_Expense,
        "Description": data['Description_2']
    }

    delete newData['Description'];
    delete newData['Description_1'];
    delete newData['Description_2'];
    return newData;
}

module.exports = {keyMap, fixData, changeKeys};