// sklad.js

document.addEventListener('DOMContentLoaded', () => {
    // Kontrola přihlášení
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    initTabs();
    loadMaterialData();
    loadNaradiData();
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

function loadMaterialData() {
    // Simulace načtení dat ze serveru
    const materialData = [
        { id: 1, name: 'Cement', quantity: 100, unit: 'kg', price: 150 },
        { id: 2, name: 'Písek', quantity: 500, unit: 'kg', price: 20 },
        { id: 3, name: 'Cihly', quantity: 1000, unit: 'ks', price: 10 }
    ];

    const tableBody = document.getElementById('material-list');
    tableBody.innerHTML = '';

    materialData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.price} Kč</td>
            <td>
                <button class="btn btn-small" onclick="editMaterial(${item.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteMaterial(${item.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadNaradiData() {
    // Simulace načtení dat ze serveru
    const naradiData = [
        { id: 1, name: 'Vrtačka', stav: 'sklad', lokace: 'Sklad A', price: 2000 },
        { id: 2, name: 'Míchačka', stav: 'stavba', lokace: 'Stavba XYZ', price: 15000 },
        { id: 3, name: 'Bruska', stav: 'servis', lokace: 'Servis ABC', price: 5000 }
    ];

    const tableBody = document.getElementById('naradi-list');
    tableBody.innerHTML = '';

    naradiData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.stav}</td>
            <td>${item.lokace}</td>
            <td>${item.price} Kč</td>
            <td>
                <button class="btn btn-small" onclick="editNaradi(${item.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteNaradi(${item.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('add-material-btn').addEventListener('click', () => showModal('material'));
    document.getElementById('add-naradi-btn').addEventListener('click', () => showModal('naradi'));
    document.getElementById('close-material-modal').addEventListener('click', () => hideModal('material'));
    document.getElementById('close-naradi-modal').addEventListener('click', () => hideModal('naradi'));
    document.getElementById('material-form').addEventListener('submit', handleMaterialSubmit);
    document.getElementById('naradi-form').addEventListener('submit', handleNaradiSubmit);
    document.getElementById('search-material').addEventListener('input', () => searchItems('material'));
    document.getElementById('search-naradi').addEventListener('input', () => searchItems('naradi'));
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function showModal(type) {
    document.getElementById(`${type}-modal`).style.display = 'block';
}

function hideModal(type) {
    document.getElementById(`${type}-modal`).style.display = 'none';
    document.getElementById(`${type}-form`).reset();
}

function handleMaterialSubmit(e) {
    e.preventDefault();
    // Zpracování dat formuláře a odeslání na server
    console.log('Ukládám materiál:', {
        name: document.getElementById('material-name').value,
        quantity: document.getElementById('material-quantity').value,
        unit: document.getElementById('material-unit').value,
        price: document.getElementById('material-price').value
    });
    hideModal('material');
    loadMaterialData(); // Znovu načteme data
}

function handleNaradiSubmit(e) {
    e.preventDefault();
    // Zpracování dat formuláře a odeslání na server
    console.log('Ukládám nářadí:', {
        name: document.getElementById('naradi-name').value,
        stav: document.getElementById('naradi-stav').value,
        lokace: document.getElementById('naradi-lokace').value,
        price: document.getElementById('naradi-price').value
    });
    hideModal('naradi');
    loadNaradiData(); // Znovu načteme data
}

function editMaterial(id) {
    console.log('Úprava materiálu s ID:', id);
    // Zde by bylo načtení dat materiálu a otevření modálního okna s předvyplněnými daty
}

function deleteMaterial(id) {
    if (confirm('Opravdu chcete smazat tento materiál?')) {
        console.log('Mazání materiálu s ID:', id);
        // Zde by bylo volání API pro smazání materiálu
        loadMaterialData(); // Znovu načteme data
    }
}

function editNaradi(id) {
    console.log('Úprava nářadí s ID:', id);
    // Zde by bylo načtení dat nářadí a otevření modálního okna s předvyplněnými daty
}

function deleteNaradi(id) {
    if (confirm('Opravdu chcete smazat toto nářadí?')) {
        console.log('Mazání nářadí s ID:', id);
        // Zde by bylo volání API pro smazání nářadí
        loadNaradiData(); // Znovu načteme data
    }
}

function searchItems(type) {
    const searchTerm = document.getElementById(`search-${type}`).value.toLowerCase();
    const rows = document.querySelectorAll(`#${type}-list tr`);

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}