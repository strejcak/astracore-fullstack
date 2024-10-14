// adresar.js

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    loadKontakty();
    setupEventListeners();
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function loadKontakty() {
    // Simulace načtení dat ze serveru
    const kontakty = [
        { id: 1, name: 'Firma ABC', typ: 'klient', telefon: '+420 123 456 789', email: 'info@firmaabc.cz', adresa: 'Hlavní 123, Praha' },
        { id: 2, name: 'Jan Novotný', typ: 'dodavatel', telefon: '+420 987 654 321', email: 'jan@novotny.cz', adresa: 'Dlouhá 456, Brno' },
        { id: 3, name: 'Servis XYZ', typ: 'subdodavatel', telefon: '+420 111 222 333', email: 'servis@xyz.cz', adresa: 'Nová 789, Ostrava' }
    ];

    updateKontaktyTable(kontakty);
}

function updateKontaktyTable(kontakty) {
    const tableBody = document.getElementById('kontakt-list');
    tableBody.innerHTML = '';

    kontakty.forEach(kontakt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${kontakt.name}</td>
            <td>${formatTyp(kontakt.typ)}</td>
            <td>${kontakt.telefon}</td>
            <td>${kontakt.email}</td>
            <td>${kontakt.adresa}</td>
            <td>
                <button class="btn btn-small" onclick="editKontakt(${kontakt.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteKontakt(${kontakt.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('add-kontakt-btn').addEventListener('click', () => showModal());
    document.getElementById('close-kontakt-modal').addEventListener('click', hideModal);
    document.getElementById('kontakt-form').addEventListener('submit', handleKontaktSubmit);
    document.getElementById('search-kontakt').addEventListener('input', filterKontakty);
    document.getElementById('filter-typ').addEventListener('change', filterKontakty);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Přidáme event listener pro zavření modálního okna kliknutím mimo něj
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('kontakt-modal');
        if (event.target === modal) {
            hideModal();
        }
    });
}

function showModal(id = null) {
    const modal = document.getElementById('kontakt-modal');
    const title = document.getElementById('kontakt-modal-title');
    const form = document.getElementById('kontakt-form');

    if (id) {
        title.textContent = 'Upravit kontakt';
        // Zde by bylo načtení dat kontaktu podle ID a předvyplnění formuláře
    } else {
        title.textContent = 'Přidat nový kontakt';
        form.reset();
    }

    modal.style.display = 'block';
    
    // Zajistíme, že modální okno bude scrollovatelné, pokud je obsah příliš dlouhý
    document.body.style.overflow = 'hidden';
    modal.style.overflow = 'auto';
}

function hideModal() {
    const modal = document.getElementById('kontakt-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleKontaktSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const kontaktData = Object.fromEntries(formData.entries());
    console.log('Ukládám kontakt:', kontaktData);
    
    // Zde by bylo volání API pro uložení kontaktu
    
    hideModal();
    loadKontakty(); // Znovu načteme data
}

function editKontakt(id) {
    console.log('Úprava kontaktu s ID:', id);
    showModal(id);
}

function deleteKontakt(id) {
    if (confirm('Opravdu chcete smazat tento kontakt?')) {
        console.log('Mazání kontaktu s ID:', id);
        // Zde by bylo volání API pro smazání kontaktu
        loadKontakty(); // Znovu načteme data
    }
}

function filterKontakty() {
    const searchTerm = document.getElementById('search-kontakt').value.toLowerCase();
    const typFilter = document.getElementById('filter-typ').value;
    const rows = document.querySelectorAll('#kontakt-list tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const typ = row.cells[1].textContent.toLowerCase();
        const matchesSearch = name.includes(searchTerm);
        const matchesTyp = typFilter === '' || typ === formatTyp(typFilter).toLowerCase();

        row.style.display = matchesSearch && matchesTyp ? '' : 'none';
    });
}

function formatTyp(typ) {
    const typMap = {
        'klient': 'Klient',
        'dodavatel': 'Dodavatel',
        'subdodavatel': 'Subdodavatel'
    };
    return typMap[typ] || typ;
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}