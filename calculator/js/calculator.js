var operator = '',
    num1 = '',
    num2 = '',
    equation = '';

function isOperator(value) {
  if ((value === '+') ||  (value === '-') || (value === '*') || (value === '/')) {
    return true;
  }
  else {
    return false;
  }
}

function calculate() {
  var value = 0,
      num1Value = (num1.indexOf('.') >= 0) ? parseFloat(num1) : parseInt(num1),
      num2Value = (num2.indexOf('.') >= 0) ? parseFloat(num2) : parseInt(num2);

  if (!num1Value) {
    num1Value = 0;
  }
  if (!num2Value) {
    num2Value = 0;
  }

  if (operator === '+') {
    value = num1Value + num2Value;
  }
  else if (operator === '-') {
    value = num1Value - num2Value;
  }
  else if (operator === '*') {
    value = num1Value * num2Value;
  }
  else if (operator === '/') {
    value = num1Value / num2Value;
  }

  num1 = value.toString();
  operator = '';
  num2 = '';

  return value;
}

function update(keyValue) {
  var result = 0;

  if (isOperator(keyValue)) {
    if (num1 && num2) {
      result = calculate();
      operator = keyValue;    
    }
    else {
      if (num1) {
        operator = keyValue;
        result = operator;        
      }
    }    
  }
  else if (keyValue === '=') {
    result = calculate();
    num1 = '';
    equation = '';
  }
  else if (keyValue === 'C') {
    reset();
  }
  else if (keyValue === 'CE') {
    if (num2) {
      equation = equation.substr(0, equation.length - num2.length);
      num2 = '';
    }
    else if (num1 && !operator) {
      equation = equation.substr(0, equation.length - num1.length);
      num1 = '';
    }
  }
  else if (keyValue === 'Back') {
    if (num2) {
      equation = equation.substr(0, equation.length - 1);
      num2 = num2.substr(0, num2.length - 1);
      if (num2) {
        result = num2;        
      }
    }
    else if (num1 && !operator) {
      equation = equation.substr(0, equation.length - 1);
      num1 = num1.substr(0, num1.length - 1);
      if (num1) {
        result = num1;        
      }
    }
  }
  else if (keyValue === 'PI') {
    if (operator) {
      num2 = Math.PI.toString();
      result = num2;
    }
    else {
      num1 = Math.PI.toString();
      result = num1;
    }
  }
  else {
    if (operator) {
      num2 += keyValue;
      result = num2;
    }
    else {
      num1 += keyValue;
      result = num1;
    }
  }

  return result;
}

function reset() {
  num1 = '';
  operator = '';
  num2 = '';
  equation = '';
  result = '';
}

function showResult(result) {
  var formulaElement = document.getElementById('formula'),
      resultElement = document.getElementById('result');

  formulaElement.innerHTML = equation;
  resultElement.innerHTML = result;
}

function onmousedown(evt) {
  var keyElement = evt.target;
  keyElement.classList.add('pressed');
}

function onmouseup (evt) {
  var result,
      operator,
      key = evt.target,
      keyValue = key.dataset.key;

  key.classList.remove('pressed');

  if (keyValue !== 'CE' && keyValue !== 'C' && keyValue !== 'Back') {
    if (keyValue === 'PI') {
      equation += '3.14';
    }
    else {
      operator = isOperator(keyValue);
      if ((operator && equation.length) || (!operator)) {
        equation += keyValue;                  
      }
    }
  }

  result = update(keyValue);

  showResult(result);
}

function initListeners() {
var i,
		keyElements = document.querySelectorAll('.key'),
	numKeys = keyElements.length;
  
  for (i = 0; i < numKeys; i++) {
  	keyElement = keyElements[i];
    
    keyElement.onmousedown = onmousedown;
    keyElement.onmouseup = onmouseup;
  }

}

initListeners();