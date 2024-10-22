// zakazky.js

document.addEventListener('DOMContentLoaded', () => {
    // Kontrola přihlášení
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    loadUserInfo();
    loadZakazky();
    updateZakazkySummary();

    // Event listeners
    document.getElementById('search-zakazky').addEventListener('input', filterZakazky);
    document.getElementById('filter-stav').addEventListener('change', filterZakazky);
    document.getElementById('add-zakazka-btn').addEventListener('click', showZakazkaModal);
    document.getElementById('close-modal').addEventListener('click', hideZakazkaModal);
    document.getElementById('zakazka-form').addEventListener('submit', handleZakazkaSubmit);
    document.getElementById('logout-btn').addEventListener('click', logout);
});

function checkAuth() {
    return localStorage.getItem('authToken') !== null;
}

function loadUserInfo() {
    const userName = 'Jan Novák'; // V reálné aplikaci by toto přišlo ze serveru
    document.getElementById('user-name').textContent = userName;
}

function loadZakazky() {
    // Simulace načtení zakázek ze serveru
    const zakazky = [
        { id: 1, nazev: 'Rekonstrukce bytu', investor: 'Petr Svoboda', stav: 'probiha' },
        { id: 2, nazev: 'Stavba garáže', investor: 'Jana Nováková', stav: 'ceka-na-zahajeni' },
        { id: 3, nazev: 'Oprava střechy', investor: 'František Dvořák', stav: 'dokonceno' },
    ];

    const zakazkyList = document.getElementById('zakazky-list');
    zakazkyList.innerHTML = '';

    zakazky.forEach(zakazka => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${zakazka.nazev}</td>
            <td>${zakazka.investor}</td>
            <td>${formatStav(zakazka.stav)}</td>
            <td>
                <button class="btn btn-small" onclick="editZakazka(${zakazka.id})">Upravit</button>
                <button class="btn btn-small btn-danger" onclick="deleteZakazka(${zakazka.id})">Smazat</button>
            </td>
        `;
        zakazkyList.appendChild(row);
    });
}

function updateZakazkySummary() {
    // Simulace získání souhrnných dat
    const summary = {
        celkem: 10,
        probiha: 3,
        dokonceno: 5,
        cekaNaZahajeni: 2
    };

    const summaryList = document.getElementById('zakazky-summary-list');
    summaryList.innerHTML = `
        <li>Celkem zakázek: ${summary.celkem}</li>
        <li>Probíhající: ${summary.probiha}</li>
        <li>Dokončené: ${summary.dokonceno}</li>
        <li>Čeká na zahájení: ${summary.cekaNaZahajeni}</li>
    `;
}

function formatStav(stav) {
    const stavMap = {
        'neziskano': 'Nezískáno',
        'obhlidka': 'Obhlídka',
        'cenova-nabidka': 'Cenová nabídka',
        'ceka-na-zahajeni': 'Čeká na zahájení',
        'probiha': 'Probíhá',
        'dokonceno': 'Dokončeno'
    };
    return stavMap[stav] || stav;
}

function filterZakazky() {
    const searchTerm = document.getElementById('search-zakazky').value.toLowerCase();
    const filterStav = document.getElementById('filter-stav').value;
    const rows = document.querySelectorAll('#zakazky-list tr');

    rows.forEach(row => {
        const nazev = row.cells[0].textContent.toLowerCase();
        const investor = row.cells[1].textContent.toLowerCase();
        const stav = row.cells[2].textContent.toLowerCase();

        const matchesSearch = nazev.includes(searchTerm) || investor.includes(searchTerm);
        const matchesFilter = filterStav === '' || stav === formatStav(filterStav).toLowerCase();

        row.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
}

function showZakazkaModal() {
    document.getElementById('zakazka-modal').style.display = 'block';
}

function hideZakazkaModal() {
    document.getElementById('zakazka-modal').style.display = 'none';
    document.getElementById('zakazka-form').reset();
}

function handleZakazkaSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const zakazkaData = Object.fromEntries(formData.entries());
    
    // Zde by bylo volání API pro uložení nové zakázky
    console.log('Nová zakázka:', zakazkaData);

    // Simulace úspěšného uložení
    hideZakazkaModal();
    loadZakazky();
    updateZakazkySummary();
}

function editZakazka(id) {
    // Implementace editace zakázky
    console.log('Editace zakázky s ID:', id);
}

function deleteZakazka(id) {
    // Implementace smazání zakázky
    if (confirm('Opravdu chcete smazat tuto zakázku?')) {
        console.log('Smazání zakázky s ID:', id);
        // Zde by bylo volání API pro smazání zakázky
        loadZakazky();
        updateZakazkySummary();
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}