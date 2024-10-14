// dokumenty.js

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    loadDokumenty();
    setupEventListeners();
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function loadDokumenty() {
    // Simulace načtení dat ze serveru
    const dokumenty = [
        { id: 1, name: 'Smlouva o dílo.pdf', kategorie: 'smlouvy', datum: '2023-05-15', velikost: '2.5 MB' },
        { id: 2, name: 'Faktura č. 2023001.pdf', kategorie: 'faktury', datum: '2023-06-01', velikost: '1.2 MB' },
        { id: 3, name: 'Technická specifikace.docx', kategorie: 'technicke-dokumenty', datum: '2023-06-10', velikost: '3.7 MB' }
    ];

    updateDokumentyTable(dokumenty);
}

function updateDokumentyTable(dokumenty) {
    const tableBody = document.getElementById('dokument-list');
    tableBody.innerHTML = '';

    dokumenty.forEach(dokument => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dokument.name}</td>
            <td>${formatKategorie(dokument.kategorie)}</td>
            <td>${formatDate(dokument.datum)}</td>
            <td>${dokument.velikost}</td>
            <td>
                <button class="btn btn-small" onclick="downloadDokument(${dokument.id})">Stáhnout</button>
                <button class="btn btn-small btn-danger" onclick="deleteDokument(${dokument.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('add-dokument-btn').addEventListener('click', showModal);
    document.getElementById('close-dokument-modal').addEventListener('click', hideModal);
    document.getElementById('dokument-form').addEventListener('submit', handleDokumentSubmit);
    document.getElementById('search-dokument').addEventListener('input', filterDokumenty);
    document.getElementById('filter-kategorie').addEventListener('change', filterDokumenty);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Přidáme event listener pro zavření modálního okna kliknutím mimo něj
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('dokument-modal');
        if (event.target === modal) {
            hideModal();
        }
    });
}

function showModal() {
    const modal = document.getElementById('dokument-modal');
    const form = document.getElementById('dokument-form');
    form.reset();
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('dokument-modal');
    modal.style.display = 'none';
}

function handleDokumentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dokumentData = Object.fromEntries(formData.entries());
    console.log('Nahrávám dokument:', dokumentData);
    
    // Zde by bylo volání API pro nahrání dokumentu
    
    hideModal();
    loadDokumenty(); // Znovu načteme data
}

function downloadDokument(id) {
    console.log('Stahování dokumentu s ID:', id);
    // Zde by byla implementace stahování dokumentu
}

function deleteDokument(id) {
    if (confirm('Opravdu chcete smazat tento dokument?')) {
        console.log('Mazání dokumentu s ID:', id);
        // Zde by bylo volání API pro smazání dokumentu
        loadDokumenty(); // Znovu načteme data
    }
}

function filterDokumenty() {
    const searchTerm = document.getElementById('search-dokument').value.toLowerCase();
    const kategorieFilter = document.getElementById('filter-kategorie').value;
    const rows = document.querySelectorAll('#dokument-list tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const kategorie = row.cells[1].textContent.toLowerCase();
        const matchesSearch = name.includes(searchTerm);
        const matchesKategorie = kategorieFilter === '' || kategorie === formatKategorie(kategorieFilter).toLowerCase();

        row.style.display = matchesSearch && matchesKategorie ? '' : 'none';
    });
}

function formatKategorie(kategorie) {
    const kategorieMap = {
        'smlouvy': 'Smlouvy',
        'faktury': 'Faktury',
        'nabidky': 'Nabídky',
        'technicke-dokumenty': 'Technické dokumenty',
        'ostatni': 'Ostatní'
    };
    return kategorieMap[kategorie] || kategorie;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('cs-CZ', options);
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}