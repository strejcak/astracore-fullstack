// majetek.js

document.addEventListener('DOMContentLoaded', () => {
    // Kontrola přihlášení
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    loadMajetekData();
    setupEventListeners();
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function loadMajetekData() {
    // Simulace načtení dat ze serveru
    const majetekData = [
        { id: 1, name: 'Firemní automobil', kategorie: 'vozidla', porizovaci_cena: 500000, datum_porizeni: '2022-05-15', aktualni_hodnota: 450000 },
        { id: 2, name: 'Stavební míchačka', kategorie: 'stroje', porizovaci_cena: 50000, datum_porizeni: '2021-03-10', aktualni_hodnota: 40000 },
        { id: 3, name: 'Kancelářská budova', kategorie: 'nemovitosti', porizovaci_cena: 5000000, datum_porizeni: '2020-01-01', aktualni_hodnota: 5500000 },
        { id: 4, name: 'Počítačové vybavení', kategorie: 'it', porizovaci_cena: 200000, datum_porizeni: '2023-01-20', aktualni_hodnota: 180000 }
    ];

    updateMajetekTable(majetekData);
    updateTotalValue(majetekData);
}

function updateMajetekTable(data) {
    const tableBody = document.getElementById('majetek-list');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatKategorie(item.kategorie)}</td>
            <td>${formatCurrency(item.porizovaci_cena)}</td>
            <td>${formatDate(item.datum_porizeni)}</td>
            <td>${formatCurrency(item.aktualni_hodnota)}</td>
            <td>
                <button class="btn btn-small" onclick="editMajetek(${item.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteMajetek(${item.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateTotalValue(data) {
    const totalValue = data.reduce((sum, item) => sum + item.aktualni_hodnota, 0);
    document.getElementById('total-value').textContent = formatCurrency(totalValue);
}

function setupEventListeners() {
    document.getElementById('add-majetek-btn').addEventListener('click', () => showModal());
    document.getElementById('close-majetek-modal').addEventListener('click', hideModal);
    document.getElementById('majetek-form').addEventListener('submit', handleMajetekSubmit);
    document.getElementById('search-majetek').addEventListener('input', filterMajetek);
    document.getElementById('filter-kategorie').addEventListener('change', filterMajetek);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function showModal(id = null) {
    const modal = document.getElementById('majetek-modal');
    const title = document.getElementById('majetek-modal-title');
    const form = document.getElementById('majetek-form');

    if (id) {
        title.textContent = 'Upravit majetek';
        // Zde by bylo načtení dat majetku podle ID a předvyplnění formuláře
    } else {
        title.textContent = 'Přidat nový majetek';
        form.reset();
    }

    modal.style.display = 'block';
}

function hideModal() {
    document.getElementById('majetek-modal').style.display = 'none';
}

function handleMajetekSubmit(e) {
    e.preventDefault();
    // Zpracování dat formuláře a odeslání na server
    const formData = new FormData(e.target);
    const majetekData = Object.fromEntries(formData.entries());
    console.log('Ukládám majetek:', majetekData);
    
    hideModal();
    loadMajetekData(); // Znovu načteme data
}

function editMajetek(id) {
    console.log('Úprava majetku s ID:', id);
    showModal(id);
}

function deleteMajetek(id) {
    if (confirm('Opravdu chcete smazat tento majetek?')) {
        console.log('Mazání majetku s ID:', id);
        // Zde by bylo volání API pro smazání majetku
        loadMajetekData(); // Znovu načteme data
    }
}

function filterMajetek() {
    const searchTerm = document.getElementById('search-majetek').value.toLowerCase();
    const kategorie = document.getElementById('filter-kategorie').value;
    const rows = document.querySelectorAll('#majetek-list tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const itemKategorie = row.cells[1].textContent.toLowerCase();
        const matchesSearch = name.includes(searchTerm);
        const matchesKategorie = kategorie === '' || itemKategorie === formatKategorie(kategorie).toLowerCase();

        row.style.display = matchesSearch && matchesKategorie ? '' : 'none';
    });
}

function formatKategorie(kategorie) {
    const kategorieMap = {
        'vozidla': 'Vozidla',
        'stroje': 'Stroje',
        'nemovitosti': 'Nemovitosti',
        'it': 'IT vybavení',
        'ostatni': 'Ostatní'
    };
    return kategorieMap[kategorie] || kategorie;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('cs-CZ');
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}