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