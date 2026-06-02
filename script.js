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

    // Ruft die Logik aus der tree.js auf
    const treeData = buildSimpleTree(rows, headers, 0);
    
    const container = document.getElementById('tree-container');
    container.innerHTML = `<div class="tree"><ul>${renderTreeHTML(treeData)}</ul></div>`;
}

show("main-content", "tree_generator")