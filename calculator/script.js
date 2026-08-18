// 获取 DOM 元素
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const angleModeBtn = document.getElementById('angle-mode');
const buttons = document.querySelectorAll('.btn');

// 状态管理
let currentInput = '0';
let previousInput = '';
let operator = null;
let expression = '';
let isAngleMode = true; // true = 角度, false = 弧度
let justCalculated = false;

// 更新显示
function updateDisplay() {
    resultEl.textContent = currentInput;
    expressionEl.textContent = expression;
}

// 输入数字
function inputNumber(value) {
    if (justCalculated) {
        currentInput = value;
        expression = '';
        justCalculated = false;
    } else {
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            if (value === '.' && currentInput.includes('.')) {
                return;
            }
            currentInput += value;
        }
    }
    updateDisplay();
}

// 输入运算符
function inputOperator(op) {
    if (operator && previousInput && !justCalculated) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    expression = `${previousInput} ${getOperatorSymbol(op)} `;
    currentInput = '0';
    justCalculated = false;
    updateDisplay();
}

// 获取运算符符号
function getOperatorSymbol(op) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷',
        'power': '^'
    };
    return symbols[op] || op;
}

// 执行计算
function calculate() {
    if (!operator || !previousInput) return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;

    switch (operator) {
        case 'add':
            result = prev + curr;
            break;
        case 'subtract':
            result = prev - curr;
            break;
        case 'multiply':
            result = prev * curr;
            break;
        case 'divide':
            if (curr === 0) {
                resultEl.textContent = '错误：不能除以零';
                currentInput = '0';
                previousInput = '';
                operator = null;
                expression = '';
                justCalculated = true;
                return;
            }
            result = prev / curr;
            break;
        case 'power':
            result = Math.pow(prev, curr);
            break;
        default:
            return;
    }

    expression = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput} =`;
    currentInput = formatResult(result);
    previousInput = '';
    operator = null;
    justCalculated = true;
    updateDisplay();
}

// 格式化结果
function formatResult(num) {
    if (Number.isInteger(num) && Math.abs(num) < 1e15) {
        return num.toString();
    }
    if (Math.abs(num) < 1e-10 || Math.abs(num) > 1e15) {
        return num.toExponential(8);
    }
    return parseFloat(num.toPrecision(12)).toString();
}

// 科学计算函数
function scientificCalc(action) {
    const num = parseFloat(currentInput);
    let result;

    switch (action) {
        case 'sin':
            result = isAngleMode ? Math.sin(num * Math.PI / 180) : Math.sin(num);
            expression = `sin(${currentInput})`;
            break;
        case 'cos':
            result = isAngleMode ? Math.cos(num * Math.PI / 180) : Math.cos(num);
            expression = `cos(${currentInput})`;
            break;
        case 'tan':
            result = isAngleMode ? Math.tan(num * Math.PI / 180) : Math.tan(num);
            expression = `tan(${currentInput})`;
            break;
        case 'asin':
            if (num < -1 || num > 1) {
                resultEl.textContent = '错误：输入超出范围';
                return;
            }
            result = isAngleMode ? Math.asin(num) * 180 / Math.PI : Math.asin(num);
            expression = `asin(${currentInput})`;
            break;
        case 'acos':
            if (num < -1 || num > 1) {
                resultEl.textContent = '错误：输入超出范围';
                return;
            }
            result = isAngleMode ? Math.acos(num) * 180 / Math.PI : Math.acos(num);
            expression = `acos(${currentInput})`;
            break;
        case 'atan':
            result = isAngleMode ? Math.atan(num) * 180 / Math.PI : Math.atan(num);
            expression = `atan(${currentInput})`;
            break;
        case 'sqrt':
            if (num < 0) {
                resultEl.textContent = '错误：负数不能开平方';
                return;
            }
            result = Math.sqrt(num);
            expression = `√(${currentInput})`;
            break;
        case 'square':
            result = Math.pow(num, 2);
            expression = `(${currentInput})²`;
            break;
        case 'cube':
            result = Math.pow(num, 3);
            expression = `(${currentInput})³`;
            break;
        case 'inverse':
            if (num === 0) {
                resultEl.textContent = '错误：不能求零的倒数';
                return;
            }
            result = 1 / num;
            expression = `1/(${currentInput})`;
            break;
        case 'factorial':
            if (num < 0 || !Number.isInteger(num)) {
                resultEl.textContent = '错误：阶乘仅适用于非负整数';
                return;
            }
            if (num > 170) {
                resultEl.textContent = '错误：数字太大';
                return;
            }
            result = factorial(num);
            expression = `${currentInput}!`;
            break;
        case 'log':
            if (num <= 0) {
                resultEl.textContent = '错误：对数输入必须大于0';
                return;
            }
            result = Math.log10(num);
            expression = `log(${currentInput})`;
            break;
        case 'ln':
            if (num <= 0) {
                resultEl.textContent = '错误：对数输入必须大于0';
                return;
            }
            result = Math.log(num);
            expression = `ln(${currentInput})`;
            break;
        case 'exp':
            result = Math.exp(num);
            expression = `e^(${currentInput})`;
            break;
        case 'pi':
            currentInput = Math.PI.toString();
            expression = 'π';
            updateDisplay();
            return;
        case 'e':
            currentInput = Math.E.toString();
            expression = 'e';
            updateDisplay();
            return;
        case 'percent':
            result = num / 100;
            expression = `${currentInput}%`;
            break;
        default:
            return;
    }

    currentInput = formatResult(result);
    justCalculated = true;
    updateDisplay();
}

// 阶乘计算
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// 清除
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    expression = '';
    justCalculated = false;
    updateDisplay();
}

// 退格
function backspace() {
    if (justCalculated) return;
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// 正负号
function negate() {
    if (currentInput === '0') return;
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.slice(1);
    } else {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

// 切换角度/弧度模式
function toggleAngleMode() {
    isAngleMode = !isAngleMode;
    angleModeBtn.textContent = isAngleMode ? '角度 (DEG)' : '弧度 (RAD)';
    angleModeBtn.classList.toggle('active', !isAngleMode);
}

// 角度/弧度模式切换
angleModeBtn.addEventListener('click', toggleAngleMode);

// 按钮点击事件
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value) {
            inputNumber(value);
        } else if (action) {
            switch (action) {
                case 'clear':
                    clearAll();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'negate':
                    negate();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                case 'power':
                    inputOperator(action);
                    break;
                case 'equals':
                    calculate();
                    break;
                default:
                    scientificCalc(action);
            }
        }
    });
});

// 键盘事件
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputNumber('.');
    } else if (key === '+') {
        inputOperator('add');
    } else if (key === '-') {
        inputOperator('subtract');
    } else if (key === '*') {
        inputOperator('multiply');
    } else if (key === '/') {
        e.preventDefault();
        inputOperator('divide');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === '%') {
        scientificCalc('percent');
    } else if (key === '^') {
        inputOperator('power');
    }
});

// 初始化
updateDisplay();