function handleEnter(e) {
    if (e.key === 'Enter') checkPassword();
}

function show(id, contentname) {
  element = document.getElementById(id);
  element.innerHTML = apps[contentname];
  if (extrafuncs[contentname]) {
    extrafuncs[contentname]();
  };
}

// --- Theme Logik ---
function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
}

// --- Tabellen Logik ---
table = document.getElementById('data-table');

function addColumn() {
    const trHead = table.querySelector('thead tr');
    const th = document.createElement('th');
    th.contentEditable = "true";
    th.innerText = "Neues Feature";
    
    // Vor der letzten Spalte (Ziel) einfügen
    trHead.insertBefore(th, trHead.lastElementChild);

    const trsBody = table.querySelectorAll('tbody tr');
    trsBody.forEach(tr => {
        const td = document.createElement('td');
        td.contentEditable = "true";
        td.innerText = "Wert";
        tr.insertBefore(td, tr.lastElementChild);
    });
}

function removeColumn() {
    const trHead = table.querySelector('thead tr');
    const cols = trHead.querySelectorAll('th');
    
    // Wir wollen nicht die Zielspalte löschen, und mindestens 2 Spalten behalten
    if (cols.length > 2) {
        // Löscht die vorletzte Spalte (die Spalte direkt vor dem "Ziel")
        trHead.removeChild(cols[cols.length - 2]);

        const trsBody = table.querySelectorAll('tbody tr');
        trsBody.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            tr.removeChild(tds[tds.length - 2]);
        });
    } else {
        alert("Du musst mindestens eine Feature-Spalte und eine Ziel-Spalte behalten!");
    }
}

function addRow() {
    const tbody = table.querySelector('tbody');
    const cols = table.querySelectorAll('thead th').length;
    const tr = document.createElement('tr');
    for (let i = 0; i < cols; i++) {
        const td = document.createElement('td');
        td.contentEditable = "true";
        td.innerText = "-";
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}

function removeRow() {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    if (rows.length > 1) {
        tbody.removeChild(rows[rows.length - 1]); // Löscht die letzte Zeile
    } else {
        alert("Es muss mindestens eine Zeile übrig bleiben!");
    }
}

// --- Entscheidungsbaum-Trigger ---
function generateTree() {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText);
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
    });

    console.log(rows)

    // Ruft die Logik aus der tree.js auf
    const treeData = buildSimpleTree(rows, headers, 0);

    test(headers, rows);

    console.log(treeData)
    
    const container = document.getElementById('tree-container');
    container.innerHTML = `<div class="tree"><ul>${renderTreeHTML(treeData)}</ul></div>`;
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

login()
show("main-content", "tree_generator")