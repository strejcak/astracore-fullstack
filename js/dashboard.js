// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Kontrola přihlášení
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    loadFinancialData();
    loadCurrentOrders();
    initializeCalendar();

    // Event listener pro odhlášení
    document.getElementById('logout-btn').addEventListener('click', logout);
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function loadFinancialData() {
    // Simulace načtení finančních dat
    const monthlyIncome = 150000;
    const monthlyExpenses = 100000;

    document.getElementById('monthly-income').textContent = `${monthlyIncome.toLocaleString()} Kč`;
    document.getElementById('monthly-expenses').textContent = `${monthlyExpenses.toLocaleString()} Kč`;

    createFinancialChart(monthlyIncome, monthlyExpenses);
}

function createFinancialChart(income, expenses) {
    const ctx = document.getElementById('finance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Příjmy', 'Výdaje'],
            datasets: [{
                label: 'Finance aktuálního měsíce',
                data: [income, expenses],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 14
                        },
                        callback: function(value) {
                            return value.toLocaleString() + ' Kč';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'rgba(255, 255, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 1)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function loadCurrentOrders() {
    // Simulace načtení aktuálních zakázek
    const orders = [
        { name: 'Rekonstrukce bytu', client: 'Petr Svoboda' },
        { name: 'Stavba garáže', client: 'Jana Nováková' },
        { name: 'Oprava střechy', client: 'František Dvořák' }
    ];

    const ordersList = document.getElementById('current-orders');
    ordersList.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `${order.name} - ${order.client}`;
        ordersList.appendChild(li);
    });
}

function initializeCalendar() {
    // Zde by byla implementace kalendáře
    // Pro jednoduchost zde použijeme placeholder
    document.getElementById('calendar').textContent = 'Kalendář bude implementován později';
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}