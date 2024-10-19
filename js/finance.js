// finance.js

document.addEventListener('DOMContentLoaded', () => {
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
    loadUvery();
    updateFinancniUkazatele();
}

function updateFinancialSummary(data) {
    document.getElementById('total-income').textContent = formatCurrency(data.totalIncome);
    document.getElementById('total-expenses').textContent = formatCurrency(data.totalExpenses);
    document.getElementById('estimated-tax').textContent = formatCurrency(data.estimatedTax);
    document.getElementById('monthly-income').textContent = formatCurrency(data.monthlyIncome);
    document.getElementById('monthly-expenses').textContent = formatCurrency(data.monthlyExpenses);
    document.getElementById('estimated-vat').textContent = formatCurrency(data.estimatedVAT);
}

function createFinancialChart() {
    const ctx = document.getElementById('finance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
            datasets: [{
                label: 'Příjmy',
                data: [120000, 150000, 180000, 130000, 160000, 150000, 170000, 140000, 190000, 200000, 180000, 210000],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }, {
                label: 'Výdaje',
                data: [100000, 120000, 140000, 110000, 130000, 100000, 150000, 120000, 160000, 170000, 140000, 180000],
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
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
            <td>${formatCurrency(invoice.amount)}</td>
            <td>${formatDate(invoice.dueDate)}</td>
            <td>${invoice.status}</td>
            <td>
                <button class="btn btn-small" onclick="editInvoice('${type}', ${invoice.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteInvoice('${type}', ${invoice.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadUvery() {
    // Simulace načtení úvěrů ze serveru
    const uvery = [
        { id: 1, veritel: 'Banka XYZ', puvodniCastka: 1000000, zbyvaSplatit: 800000, urok: 3.5, mesicniSplatka: 10000, datumSplatnosti: '2028-12-31' },
        { id: 2, veritel: 'Půjčka od známého', puvodniCastka: 200000, zbyvaSplatit: 150000, urok: 2, mesicniSplatka: 5000, datumSplatnosti: '2025-06-30' }
    ];

    const tableBody = document.getElementById('uvery-list');
    tableBody.innerHTML = '';

    uvery.forEach(uver => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${uver.veritel}</td>
            <td>${formatCurrency(uver.puvodniCastka)}</td>
            <td>${formatCurrency(uver.zbyvaSplatit)}</td>
            <td>${uver.urok} %</td>
            <td>${formatCurrency(uver.mesicniSplatka)}</td>
            <td>${formatDate(uver.datumSplatnosti)}</td>
            <td>
                <button class="btn btn-small" onclick="splatitSplatku(${uver.id})">Splatit splátku</button>
                <button class="btn btn-small btn-danger" onclick="deleteUver(${uver.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateFinancniUkazatele() {
    // Simulace výpočtu finančních ukazatelů
    document.getElementById('celkova-zadluzenost').textContent = '45 %';
    document.getElementById('bezna-likvidita').textContent = '1.5';
    document.getElementById('rentabilita-trzeb').textContent = '12 %';
    document.getElementById('cisty-pracovni-kapital').textContent = formatCurrency(500000);
    document.getElementById('pohotova-likvidita').textContent = '1.2';
    document.getElementById('okamzita-likvidita').textContent = '0.8';
    document.getElementById('mira-samofinancovani').textContent = '55 %';
    document.getElementById('produktivita-prace').textContent = formatCurrency(1000000);
    document.getElementById('nakladovost-trzeb').textContent = '85 %';
    document.getElementById('break-even-point').textContent = formatCurrency(800000);
    document.getElementById('cash-flow-ratio').textContent = '0.2';
    document.getElementById('doba-splaceni-dluhu').textContent = '3.5 let';
    document.getElementById('ekonomicka-pridana-hodnota').textContent = formatCurrency(200000);
    document.getElementById('ziskovy-ucinek-financni-paky').textContent = '1.2';
    document.getElementById('altmanovo-z-skore').textContent = '2.8';
}

function setupEventListeners() {
    document.getElementById('add-prijata-faktura-btn').addEventListener('click', () => addInvoice('prijate'));
    document.getElementById('add-vydana-faktura-btn').addEventListener('click', () => addInvoice('vydane'));
    document.getElementById('add-uver-btn').addEventListener('click', addUver);
    document.getElementById('year-select').addEventListener('change', handleYearMonthChange);
    document.getElementById('month-select').addEventListener('change', handleYearMonthChange);
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
        loadInvoices(type);
        updateFinancniUkazatele();
    }
}

function addUver() {
    console.log('Přidávání nového úvěru');
    // Zde by bylo otevření modálního okna pro přidání úvěru
}

function splatitSplatku(id) {
    console.log(`Splácení splátky úvěru s ID: ${id}`);
    // Zde by byla logika pro odečtení splátky
    loadUvery();
    updateFinancniUkazatele();
}

function deleteUver(id) {
    if (confirm('Opravdu chcete smazat tento úvěr?')) {
        console.log(`Mazání úvěru s ID: ${id}`);
        // Zde by bylo volání API pro smazání úvěru
        loadUvery();
        updateFinancniUkazatele();
    }
}

function handleYearMonthChange() {
    const selectedYear = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;
    console.log(`Vybrán rok: ${selectedYear}, měsíc: ${selectedMonth}`);
    // Zde by bylo načtení dat pro vybraný rok a měsíc a aktualizace přehledu
    loadFinancialData();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('cs-CZ', { 
        style: 'currency', 
        currency: 'CZK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('cs-CZ');
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}