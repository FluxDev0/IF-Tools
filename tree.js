// Rekursive Funktion zum Bauen der Baum-Datenstruktur
function buildSimpleTree(dataSubset, headers, colIndex) {
    const targetColIndex = headers.length - 1;
    
    if (dataSubset.length === 0) return { name: "Keine Daten", isLeaf: true };
    
    // Wenn alle Features durch sind, nimm das häufigste Ergebnis
    if (colIndex >= targetColIndex) {
        const results = dataSubset.map(row => row[targetColIndex]);
        const mostCommon = results.sort((a,b) => 
            results.filter(v => v===a).length - results.filter(v => v===b).length
        ).pop();
        return { name: "Ergebnis: " + mostCommon, isLeaf: true };
    }

    const featureName = headers[colIndex];
    const groups = {};
    dataSubset.forEach(row => {
        const val = row[colIndex];
        if (!groups[val]) groups[val] = [];
        groups[val].push(row);
    });

    const children = [];
    for (const [val, subset] of Object.entries(groups)) {
        const uniqueTargets = [...new Set(subset.map(r => r[targetColIndex]))];
        if (uniqueTargets.length === 1) {
            children.push({ edgeLabel: val, node: { name: "Ergebnis: " + uniqueTargets[0], isLeaf: true } });
        } else {
            children.push({ edgeLabel: val, node: buildSimpleTree(subset, headers, colIndex + 1) });
        }
    }

    return { name: featureName, children: children, isLeaf: false };
}

// Rekursive Funktion zum Rendern des HTMLs für den CSS-Baum
function renderTreeHTML(node) {
    let html = `<li>`;
    html += `<div class="node">${node.name}</div>`;
    
    if (node.children && node.children.length > 0) {
        html += `<ul>`;
        node.children.forEach(child => {
            html += `<li>`;
            html += `<span class="edge-label">${child.edgeLabel}</span>`;
            html += `<ul>${renderTreeHTML(child.node)}</ul>`;
            html += `</li>`;
        });
        html += `</ul>`;
    }
    html += `</li>`;
    return html;
}

function test(headers, dataSets) {
    const alleGleich = arr => arr.every(wert => wert === arr[0]);
    const targetColIndex = headers.length - 1;

    headers.slice(0, -1).forEach((header, colIndex) => {
        groupByCol(dataSets, colIndex).forEach(array => {
            if (alleGleich(getCol(array, targetColIndex))) {
                console.log("Wurzel:");
                console.log(header, array[0][colIndex], array[0][targetColIndex]);
            }
        });
    });
}

function groupByCol(dataSets, colIndex) {
    const gruppenObjekt = {};

    // 1. Schlage für jede Zeile nach, welcher Wert in der gesuchten Spalte steht
    dataSets.forEach(zeile => {
        const schluessel = zeile[colIndex]; // z.B. "Sonnig" oder "Regen"

        // Wenn es für diesen Wert noch kein Array gibt, erstelle ein leeres
        if (!gruppenObjekt[schluessel]) {
            gruppenObjekt[schluessel] = [];
        }

        // Schiebe die komplette Zeile in das passende Gruppen-Array
        gruppenObjekt[schluessel].push(zeile);
    });

    // 2. Extrahiere nur die Arrays aus dem Hilfsobjekt
    return Object.values(gruppenObjekt);
}

function getCol(dataSets, colIndex) {
    const rows = [];

    dataSets.forEach(row => {
        rows.push(row[colIndex]);
    });

    return rows;
}

function removeCol(dataSets, headers, colIndex) {
    neueHeaders = headers.filter((_, index) => index !== colIndex);

    neueDataSets = dataSets.map(zeile => 
        zeile.filter((_, index) => index !== colIndex)
    );

    return neueDataSets, neueHeaders;
}