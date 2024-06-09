"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const inputElements = document.querySelectorAll('.validate-input .input100');

    function isValid() {
        let _isValid = true;
        if (document.getElementById("password").value !== document.getElementById("confirm-password").value)
            _isValid = false;

        for (let input of inputElements) {
            if (!validate(input)) {
                showValidate(input);
                _isValid = false;
            }
        }
        return _isValid;
    };

    inputElements.forEach(input => {
        input.addEventListener('focus', function () {
            hideValidate(input);
        });
    });

    function validate(input) {
        if (input.type === 'email' || input.name === 'email') {
            const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
            return emailPattern.test(input.value.trim());
        } else {
            return input.value.trim() !== '';
        }
    }

    function showValidate(input) {
        const alertElement = input.parentElement;
        alertElement.classList.add('alert-validate');
    }

    function hideValidate(input) {
        const alertElement = input.parentElement;
        alertElement.classList.remove('alert-validate');
    }

    document.getElementById('sign-up-btn').addEventListener('click', function (event) {

        let data = {
            Emp_Code: document.getElementById('emp-code').value,
            Email: document.getElementById('email').value,
            Password: document.getElementById('password').value,
            ConfirmPassword: document.getElementById('confirm-password').value,
        }

        if (isValid())
            fetch('http://localhost:3000/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            })
                .then(async (response) => {
                    let resp = await response.json()
                    alert(resp.message)
                    console.log(resp)
                })
                .catch(error => console.error('Error:', error));
    })
});