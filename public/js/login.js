"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const inputElements = document.querySelectorAll('.validate-input .input100');

    document.querySelector('.validate-form').addEventListener('submit', function (event) {
        let isValid = true;
        for (let input of inputElements) {
            if (!validate(input)) {
                showValidate(input);
                isValid = false;
            }
        }
        if (!isValid) {
            event.preventDefault();
        }
    });

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
});