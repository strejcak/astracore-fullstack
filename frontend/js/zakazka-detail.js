// zakazka-detail.js

document.addEventListener('DOMContentLoaded', () => {
    loadZakazkaDetail();
    setupEventListeners();
});

function loadZakazkaDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const zakazkaId = urlParams.get('id');

    // V reálné aplikaci byste zde volali API pro získání detailů zakázky
    // Pro demonstraci použijeme mock data
    const zakazka = {
        id: zakazkaId,
        nazev: "Rekonstrukce bytu",
        adresa: "Dlouhá 123, Praha",
        investor: {
            typ: "firma",
            nazev: "ABC s.r.o.",
            ico: "12345678",
            dic: "CZ12345678",
            sidlo: "Krátká 456, Brno",
            dphStatus: "platce",
            kontaktniOsoba: "Jan Novák",
            telefon: "+420 123 456 789",
            email: "info@abc.cz"
        },
        finance: {
            castkaBezDPH: 1000000,
            sazbaDPH: 0,
            zaplaceno: 500000
        },
        naklady: [],
        dokumenty: [],
        denik: [],
        komunikace: []
    };

    updateZakazkaDetail(zakazka);
}

function updateZakazkaDetail(zakazka) {
    document.getElementById('zakazka-nazev').textContent = zakazka.nazev;
    document.getElementById('zakazka-adresa').textContent = zakazka.adresa;

    updateInvestorSection(zakazka.investor);
    updateFinanceSection(zakazka.finance);
    updateNakladySection(zakazka.naklady);
    updateDokumentySection(zakazka.dokumenty);
    updateDenikSection(zakazka.denik);
    updateKomunikaceSection(zakazka.komunikace);
}

function updateInvestorSection(investor) {
    document.getElementById('investor-typ').value = investor.typ;
    toggleInvestorFields(investor.typ);

    if (investor.typ === 'firma') {
        document.getElementById('firma-nazev').value = investor.nazev;
        document.getElementById('firma-ico').value = investor.ico;
        document.getElementById('firma-dic').value = investor.dic;
        document.getElementById('firma-sidlo').value = investor.sidlo;
        document.getElementById('firma-dph-status').value = investor.dphStatus;
        document.getElementById('firma-kontaktni-osoba').value = investor.kontaktniOsoba;
        document.getElementById('firma-telefon').value = investor.telefon;
        document.getElementById('firma-email').value = investor.email;
    } else {
        document.getElementById('soukromnik-jmeno').value = investor.jmeno;
        document.getElementById('soukromnik-prijmeni').value = investor.prijmeni;
        document.getElementById('soukromnik-adresa').value = investor.adresa;
        document.getElementById('soukromnik-telefon').value = investor.telefon;
        document.getElementById('soukromnik-email').value = investor.email;
    }
    updateDPHStatus();
}

function updateFinanceSection(finance) {
    document.getElementById('castka-bez-dph').value = formatNumber(finance.castkaBezDPH);
    document.getElementById('sazba-dph').value = finance.sazbaDPH;
    document.getElementById('zaplaceno').value = formatNumber(finance.zaplaceno);
    updateFinanceCalculations();
}

function updateNakladySection(naklady) {
    const seznamFaktur = document.getElementById('seznam-faktur');
    seznamFaktur.innerHTML = '';
    naklady.forEach(naklad => {
        const li = document.createElement('li');
        li.textContent = `${naklad.cislo} - ${formatCurrency(naklad.castka)}`;
        seznamFaktur.appendChild(li);
    });
}

function updateDokumentySection(dokumenty) {
    const seznamDokumentu = document.getElementById('seznam-dokumentu');
    seznamDokumentu.innerHTML = '';
    dokumenty.forEach(dokument => {
        const li = document.createElement('li');
        li.textContent = `${dokument.nazev} (${dokument.typ})`;
        seznamDokumentu.appendChild(li);
    });
}

function updateDenikSection(denik) {
    const denikZaznamy = document.getElementById('denik-zaznamy');
    denikZaznamy.innerHTML = '';
    denik.forEach(zaznam => {
        const p = document.createElement('p');
        p.textContent = `${zaznam.datum}: ${zaznam.text}`;
        denikZaznamy.appendChild(p);
    });
}

function updateKomunikaceSection(komunikace) {
    const komunikaceGalerie = document.getElementById('komunikace-galerie');
    komunikaceGalerie.innerHTML = '';
    komunikace.forEach(screenshot => {
        const img = document.createElement('img');
        img.src = screenshot.url;
        img.alt = screenshot.popis;
        komunikaceGalerie.appendChild(img);
    });
}

function setupEventListeners() {
    document.getElementById('investor-typ').addEventListener('change', (e) => toggleInvestorFields(e.target.value));
    document.getElementById('firma-dph-status').addEventListener('change', updateDPHStatus);
    document.getElementById('castka-bez-dph').addEventListener('blur', formatInputOnBlur);
    document.getElementById('zaplaceno').addEventListener('blur', formatInputOnBlur);
    document.getElementById('castka-bez-dph').addEventListener('input', updateFinanceCalculations);
    document.getElementById('sazba-dph').addEventListener('change', updateFinanceCalculations);
    document.getElementById('zaplaceno').addEventListener('input', updateFinanceCalculations);
    document.getElementById('pridat-fakturu').addEventListener('click', pridatFakturu);
    document.getElementById('ulozit-dokument').addEventListener('click', ulozitDokument);
    document.getElementById('ulozit-zaznam').addEventListener('click', ulozitZaznamDeniku);
    document.getElementById('export-pdf').addEventListener('click', exportDenikuDoPDF);
    document.getElementById('ulozit-komunikaci').addEventListener('click', ulozitKomunikaci);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function toggleInvestorFields(typ) {
    document.getElementById('investor-firma').style.display = typ === 'firma' ? 'block' : 'none';
    document.getElementById('investor-soukromnik').style.display = typ === 'soukromnik' ? 'block' : 'none';
}

function updateDPHStatus() {
    const dphStatus = document.getElementById('firma-dph-status').value;
    const sazbaDPHSelect = document.getElementById('sazba-dph');
    
    if (dphStatus === 'platce') {
        sazbaDPHSelect.value = '0';
        sazbaDPHSelect.disabled = true;
    } else {
        sazbaDPHSelect.disabled = false;
        if (sazbaDPHSelect.value === '0') {
            sazbaDPHSelect.value = '21';
        }
    }
    
    updateFinanceCalculations();
}

function formatInputOnBlur(event) {
    const input = event.target;
    const value = parseFloat(input.value.replace(/\s/g, '').replace(',', '.')) || 0;
    input.value = formatNumber(value);
}

function updateFinanceCalculations() {
    const dphStatus = document.getElementById('firma-dph-status').value;
    const castkaBezDPH = parseFloat(document.getElementById('castka-bez-dph').value.replace(/\s/g, '').replace(',', '.')) || 0;
    const sazbaDPH = dphStatus === 'platce' ? 0 : (parseFloat(document.getElementById('sazba-dph').value) || 21);
    const zaplaceno = parseFloat(document.getElementById('zaplaceno').value.replace(/\s/g, '').replace(',', '.')) || 0;

    const dph = castkaBezDPH * (sazbaDPH / 100);
    const castkaSDPH = castkaBezDPH + dph;
    const zbyvaDoplatit = castkaSDPH - zaplaceno;

    document.getElementById('castka-s-dph').textContent = formatCurrency(castkaSDPH);
    document.getElementById('dph').textContent = formatCurrency(dph);
    document.getElementById('zbyva-doplatit').textContent = formatCurrency(zbyvaDoplatit);
    
    // Zde by bylo načtení nákladů a výpočet zisku
    const naklady = 0; // Toto by mělo být načteno z dat
    const zisk = castkaSDPH - naklady;
    document.getElementById('naklady').textContent = formatCurrency(naklady);
    document.getElementById('zisk').textContent = formatCurrency(zisk);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('cs-CZ', { 
        style: 'currency', 
        currency: 'CZK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('cs-CZ', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).format(number);
}

function pridatFakturu() {
    console.log('Přidávání faktury');
    // Zde by bylo otevření modálního okna pro přidání faktury nebo přesměrování na stránku s fakturami
}

function ulozitDokument() {
    const typDokumentu = document.getElementById('typ-dokumentu').value;
    const soubor = document.getElementById('nahrat-dokument').files[0];
    if (soubor) {
        console.log(`Ukládání dokumentu typu ${typDokumentu}: ${soubor.name}`);
        // Zde by bylo nahrání souboru na server a aktualizace seznamu dokumentů
    }
}

function ulozitZaznamDeniku() {
    const zaznam = document.getElementById('denik-zaznam').value;
    if (zaznam) {
        console.log('Ukládání záznamu do deníku:', zaznam);
        // Zde by bylo uložení záznamu na server a aktualizace seznamu záznamů
        document.getElementById('denik-zaznam').value = '';
    }
}

function exportDenikuDoPDF() {
    console.log('Exportování deníku do PDF');
    // Zde by byla implementace exportu do PDF
}

function ulozitKomunikaci() {
    const soubor = document.getElementById('nahrat-komunikaci').files[0];
    if (soubor) {
        console.log('Ukládání screenshotu komunikace:', soubor.name);
        // Zde by bylo nahrání souboru na server a aktualizace galerie komunikace
    }
}

function logout() {
    console.log('Odhlašování uživatele');
    // Zde by bylo odstranění auth tokenu a přesměrování na přihlašovací stránku
    window.location.href = '../index.html';
}