"use strict";

var input = document.getElementById('input'),
    numbers = [],
    operators = "",
    resultDisplayed = false;
// Function to set the selected grade
function setGrade(selectedIndex) {
    var gradeOptions = ['grade1', 'grade2', 'grade3'];
    var selectedGrade = gradeOptions[selectedIndex] || gradeOptions[0]; 
    localStorage.setItem('selectedGrade', selectedGrade);
    updateCalculator();
}

// Function to retrieve the selected grade from localStorage and adjust the calculator's functionality
function getSelectedGrade() {
    var gradeOptions = ['grade1', 'grade2', 'grade3'];
    var selectedGrade = localStorage.getItem('selectedGrade') || gradeOptions[0]; // Default is KSSR Grade 1
    return selectedGrade;
}

function adjustCalculator() {

    var multiplyButton = document.getElementById('multiply');
    var divideButton = document.getElementById('divide');

    var selectedGrade = getSelectedGrade();

    if (selectedGrade === 'grade3') {
        multiplyButton.style.display = 'inline-block';
        divideButton.style.display = 'inline-block';
    } else if (selectedGrade === 'grade2') {
        multiplyButton.style.display = 'none';
        divideButton.style.display = 'inline-block';
    } else {
        multiplyButton.style.display = 'none';
        divideButton.style.display = 'none';
    }
}

// Function to run when the calculator page is loaded
function calculatorPageLoaded() {
    adjustCalculator();
}

// Register an event listener to run the calculatorPageLoaded function when the DOM is ready
document.addEventListener('DOMContentLoaded', calculatorPageLoaded);

// Function to handle calculation
function calculate() {

    var selectedGrade = getSelectedGrade();
    var currentInput = input.textContent || input.innerText;

    var result = calculateResult(currentInput.toString());

    if (operators.length > 0 && !resultDisplayed) {
        //numbers.push(result);
        if (selectedGrade === 'grade1' && (result < 1 || result > 100)) {
            handleGradeSelectionError('Error: Numbers must be in the range 1-100 for KSSR Grade 1.', '1-100');
            return;
        } else if ((selectedGrade === 'grade2' && (result < 1 || result > 1000)) ||
            (selectedGrade === 'grade3' && (result < 1 || result > 10000))) {
            handleGradeSelectionError(`Error: Numbers must be in the specified range for ${selectedGrade}.`, (selectedGrade === 'grade2' ? '1-1000' : '1-10000'));
            return;
        }
    }

    resultDisplayed = true;

    if (result < 0) {
        input.innerHTML = 'Cannot display negative number';
    } else {
        input.innerHTML = result;
    }

    numbers = [];
    operators = [];
}

// Function to handle an error message for grade selection
function handleGradeSelectionError(errorMessage, validRange) {
    var errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = errorMessage + ' <br>Valid Range: ' + validRange;
    setTimeout(clearErrorMessage, 10000);
}

// Function to clear the error message
function clearErrorMessage() {
    var errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerHTML = '';

}

// Function to calculate the result based on the selected grade
function calculateResult(input) {
    var operators = ['+', '-', '*', '/'];

    if (typeof input !== 'string') {
        return 'Error: Invalid input';
    }

    // Split the input based on the operators and calculate sequentially
    var operands = input.split(new RegExp(`[${operators.join('\\')}]`));
    var operatorsArray = input.split(/[\d.]+/).filter(Boolean);

    // Perform the calculation based on the operators
    for (var i = 0; i < operatorsArray.length; i++) {
        var operator = operatorsArray[i];
        var num1 = parseFloat(operands[i]);
        var num2 = parseFloat(operands[i + 1]);

        switch (operator) {
            case '+':
                operands[i + 1] = num1 + num2;
                break;
            case '-':
                operands[i + 1] = num1 - num2;
                break;
            case '*':
                operands[i + 1] = num1 * num2;
                break;
            case '/':
                if (num2 === 0) {
                    alert('Division by zero detected');
                    return 'Error: Division by zero';
                }
                operands[i + 1] = num1 / num2;
                break;
            default:
                alert('Unknown operator detected');
                return 'Error: Invalid operator';
        }
    }

    return operands[operands.length - 1];
}
// Function to handle number button click
function numberClicked(num) {
    if (resultDisplayed) {
        input.innerHTML = num;
        resultDisplayed = false;
    } else {
        input.innerHTML += num;
    }

    numbers += num.toString(); 
}

// Function to handle operator button click
function operatorClicked(op) {
    if (resultDisplayed) {
        resultDisplayed = false;
        clearErrorMessage();
    }
    
    operators += op;

    input.innerHTML += op;

    var selectedGrade = getSelectedGrade();
    if ((selectedGrade === 'grade1' || selectedGrade === 'grade2') && op === '*') {
        handleGradeSelectionError('Error: Multiplication (*) is not allowed for KSSR Grade 1 and Grade 2.');
        return;
    }
    if (selectedGrade === 'grade1' && op === '/') {
        handleGradeSelectionError('Error: Division (/) is not allowed for KSSR Grade 1.');
        return;
    }
}

// Function to update the calculator based on the selected grade
function updateCalculator() {
    adjustCalculator();
    clearInput();
    alert('Calculator adjusted for ' + getSelectedGrade());
}
// Function to clear the input and reset resultDisplayed flag
function clearInput() {
    input.innerHTML = '';
    numbers = [];
    operators = [];
    resultDisplayed = false;
}
