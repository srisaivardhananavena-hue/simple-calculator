// Minimal calculator logic
(() => {
  const display = document.getElementById('display');
  const buttons = document.getElementById('buttons');

  let expr = ''; // expression string shown/evaluated

  function updateDisplay(value) {
    display.value = value === '' ? '0' : value;
  }

  function appendValue(v) {
    // Prevent multiple leading zeros
    if (expr === '0' && v === '0') return;
    // Prevent multiple decimals in the same number
    if (v === '.') {
      const parts = expr.split(/[\+\-\*\/]/);
      if (parts[parts.length - 1].includes('.')) return;
      if (parts[parts.length - 1] === '') v = '0.';
    }
    expr += v;
    updateDisplay(expr);
  }

  function appendOperator(op) {
    if (expr === '' && op === '-') { // allow leading negative
      expr = '-';
      updateDisplay(expr);
      return;
    }
    // Replace last operator if operator pressed consecutively
    if (/[\+\-\*\/]$/.test(expr)) {
      expr = expr.slice(0, -1) + op;
    } else if (expr !== '') {
      expr += op;
    }
    updateDisplay(expr);
  }

  function clearAll() {
    expr = '';
    updateDisplay(expr);
  }

  function evaluateExpr() {
    if (expr === '') return;
    // Prevent trailing operator
    if (/[\+\-\*\/]$/.test(expr)) expr = expr.slice(0, -1);
    try {
      // Evaluate safely using Function; keep it minimal for this demo
      // Only numbers and operators + - * / and . are produced by the UI
      const result = Function('"use strict"; return (' + expr + ')')();
      expr = String(result);
      updateDisplay(expr);
    } catch (e) {
      updateDisplay('Error');
      expr = '';
    }
  }

  buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');

    if (action === 'clear') {
      clearAll();
      return;
    }
    if (action === 'equals') {
      evaluateExpr();
      return;
    }
    if (val != null) {
      if (/^[0-9.]$/.test(val)) appendValue(val);
      else if (/^[\+\-\*\/]$/.test(val)) appendOperator(val);
    }
  });

  // keyboard support (basic)
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      appendValue(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
      appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      evaluateExpr();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      clearAll();
    }
  });
})();
