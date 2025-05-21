// Get DOM elements
const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const transactionListEl = document.getElementById('transaction-list');

// Get transactions from localStorage or initialize empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize the app
function init() {
    transactionListEl.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: generateID(),
        description: descriptionEl.value,
        amount: +amountEl.value,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateValues();
    updateLocalStorage();

    descriptionEl.value = '';
    amountEl.value = '';
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Add transaction to DOM
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'expense' : 'income');

    item.innerHTML = `
        ${transaction.description}
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
    `;

    transactionListEl.appendChild(item);
}

// Update balance, income and expense values
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);
    const income = amounts
        .filter(amount => amount > 0)
        .reduce((acc, amount) => acc + amount, 0)
        .toFixed(2);
    const expense = (amounts
        .filter(amount => amount < 0)
        .reduce((acc, amount) => acc + amount, 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `$${total}`;
    incomeAmountEl.innerText = `$${income}`;
    expenseAmountEl.innerText = `$${expense}`;
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
transactionFormEl.addEventListener('submit', addTransaction);

// Initialize app
init();
