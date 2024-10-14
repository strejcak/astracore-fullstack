// finance.js

document.addEventListener('DOMContentLoaded', () => {
    // Kontrola přihlášení
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    initTabs();
    loadFinancialData();
    setupEventListeners();
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function loadFinancialData() {
    // Simulace načtení dat ze serveru
    const financialData = {
        totalIncome: 1500000,
        totalExpenses: 1000000,
        estimatedTax: 75000,
        monthlyIncome: 150000,
        monthlyExpenses: 100000,
        estimatedVAT: 10500
    };

    updateFinancialSummary(financialData);
    createFinancialChart();
    loadInvoices('prijate');
    loadInvoices('vydane');
}

function updateFinancialSummary(data) {
    document.getElementById('total-income').textContent = `${data.totalIncome.toLocaleString()} Kč`;
    document.getElementById('total-expenses').textContent = `${data.totalExpenses.toLocaleString()} Kč`;
    document.getElementById('estimated-tax').textContent = `${data.estimatedTax.toLocaleString()} Kč`;
    document.getElementById('monthly-income').textContent = `${data.monthlyIncome.toLocaleString()} Kč`;
    document.getElementById('monthly-expenses').textContent = `${data.monthlyExpenses.toLocaleString()} Kč`;
    document.getElementById('estimated-vat').textContent = `${data.estimatedVAT.toLocaleString()} Kč`;
}

function createFinancialChart() {
    const ctx = document.getElementById('finance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen'],
            datasets: [{
                label: 'Příjmy',
                data: [120000, 150000, 180000, 130000, 160000, 150000],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }, {
                label: 'Výdaje',
                data: [100000, 120000, 140000, 110000, 130000, 100000],
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadInvoices(type) {
    // Simulace načtení faktur ze serveru
    const invoices = [
        { id: 1, number: 'F2023001', party: 'ABC s.r.o.', amount: 50000, dueDate: '2023-07-15', status: 'Zaplaceno' },
        { id: 2, number: 'F2023002', party: 'XYZ a.s.', amount: 75000, dueDate: '2023-07-30', status: 'Nezaplaceno' },
        { id: 3, number: 'F2023003', party: 'DEF s.r.o.', amount: 30000, dueDate: '2023-08-10', status: 'Částečně zaplaceno' }
    ];

    const tableBody = document.getElementById(`${type}-faktury-list`);
    tableBody.innerHTML = '';

    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.number}</td>
            <td>${invoice.party}</td>
            <td>${invoice.amount.toLocaleString()} Kč</td>
            <td>${invoice.dueDate}</td>
            <td>${invoice.status}</td>
            <td>
                <button class="btn btn-small" onclick="editInvoice('${type}', ${invoice.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteInvoice('${type}', ${invoice.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('add-prijata-faktura-btn').addEventListener('click', () => addInvoice('prijate'));
    document.getElementById('add-vydana-faktura-btn').addEventListener('click', () => addInvoice('vydane'));
    document.getElementById('month-select').addEventListener('change', handleMonthChange);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function addInvoice(type) {
    console.log(`Přidávání ${type} faktury`);
    // Zde by bylo otevření modálního okna pro přidání faktury
}

function editInvoice(type, id) {
    console.log(`Úprava ${type} faktury s ID: ${id}`);
    // Zde by bylo otevření modálního okna pro úpravu faktury
}

function deleteInvoice(type, id) {
    if (confirm(`Opravdu chcete smazat tuto ${type} fakturu?`)) {
        console.log(`Mazání ${type} faktury s ID: ${id}`);
        // Zde by bylo volání API pro smazání faktury a následné překreslení seznamu
    }
}

function handleMonthChange() {
    const selectedMonth = document.getElementById('month-select').value;
    console.log(`Vybrán měsíc: ${selectedMonth}`);
    // Zde by bylo načtení dat pro vybraný měsíc a aktualizace přehledu
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}