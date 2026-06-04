const body = document.body

function handleEnter(e) {
    if (e.key === 'Enter') loginAdmin();
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'F1') {
        toggleTest();
    }
});

function toggleTest() {
    if (body.style.getPropertyValue("--test") == "none") {
        body.style.setProperty("--test","flex");
        console.log("flex");
    } else {
        body.style.setProperty("--test","none");
        console.log("none");
    }
}

// --- Theme Logik ---
function toggleTheme() {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
}

// --- Entscheidungsbaum-Trigger ---
function generateTree() {
    const table = document.getElementById('data-table');
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const dataSets = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
    });

    generateTreeFromData(dataSets, headers);
}

// Der Aufruf an die Baum-KI
function generateTreeFromData(dataSets, headers) {
    // Hier rufen wir jetzt buildSmartTree auf!
    const rootNode = buildSmartTree(dataSets, headers);
    
    const container = document.getElementById('tree-container');
    container.innerHTML = `<div class="tree"><ul>${renderTreeHTML(rootNode)}</ul></div>`;
}

function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Optional: Zeige den Dateinamen im UI an, falls das Element existiert
    const nameDisplay = document.getElementById('file-name-display');
    if (nameDisplay) nameDisplay.innerText = `Geladen: ${file.name}`;

    const reader = new FileReader();

    // Diese Funktion startet, sobald die CSV-Datei komplett eingelesen wurde
    reader.onload = function(e) {
        const text = e.target.result;
        
        // 1. Text in einzelne Zeilen zerlegen
        const zeilen = text.split(/\r?\n/);

        // Falls die Datei leer ist, abbrechen
        if (zeilen.length === 0 || zeilen[0].trim() === "") {
            alert("Die CSV-Datei ist leer!");
            return;
        }

        // 2. Trennzeichen automatisch erkennen (Komma oder Semikolon für Excel)
        const trennzeichen = zeilen[0].includes(';') ? ';' : ',';

        // 3. Überschriften (Headers) aus der ersten Zeile ziehen
        const geladeneHeaders = zeilen[0].split(trennzeichen).map(h => h.trim());

        // 4. Die restlichen Zeilen als Datensätze einlesen
        const geladeneDataSets = [];
        for (let i = 1; i < zeilen.length; i++) {
            const zeileText = zeilen[i].trim();
            if (zeileText === "") continue; // Leere Zeilen überspringen

            const spalten = zeileText.split(trennzeichen).map(s => s.trim());
            
            // Nur Zeilen hinzufügen, die korrekt formatiert sind
            if (spalten.length === geladeneHeaders.length) {
                geladeneDataSets.push(spalten);
            }
        }

        // ==========================================================
        // AB HIER: DIE TABELLE DIREKT IM HTML AKTUALISIEREN
        // ==========================================================
        const tableElement = document.getElementById('data-table');
        
        if (tableElement) {
            // Tabellenkopf (thead) neu aufbauen
            const thead = tableElement.querySelector('thead') || tableElement.createTHead();
            thead.innerHTML = ""; // Alten Inhalt komplett löschen
            
            const headerRow = document.createElement('tr');
            geladeneHeaders.forEach(headerText => {
                const th = document.createElement('th');
                th.innerText = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Tabellenkörper (tbody) neu aufbauen
            let tbody = tableElement.querySelector('tbody');
            if (!tbody) {
                tbody = document.createElement('tbody');
                tableElement.appendChild(tbody);
            }
            tbody.innerHTML = ""; // Alte Zeilen komplett löschen

            // Jede Datenzeile aus der CSV in das HTML schreiben
            geladeneDataSets.forEach(zeile => {
                const row = document.createElement('tr');
                zeile.forEach(zellenText => {
                    const td = document.createElement('td');
                    td.innerText = zellenText;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
        }
    };

    // Datei als Text einlesen
    reader.readAsText(file);
}