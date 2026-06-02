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

function calculateGini(data, targetColIndex) {
    const counts = {};
    data.forEach(row => {
        const val = row[targetColIndex];
        counts[val] = (counts[val] || 0) + 1;
    });
    
    let impurity = 1;
    for (let val in counts) {
        let prob = counts[val] / data.length;
        impurity -= (prob * prob);
    }
    return impurity;
}

// Sucht die beste Spalte, um die Daten aufzuteilen (höchster Informationsgewinn)
function findBestSplit(data, headers, targetColIndex) {
    let bestGain = -1;
    let bestColIndex = -1;
    const baseGini = calculateGini(data, targetColIndex);

    for (let col = 0; col < headers.length; col++) {
        if (col === targetColIndex) continue; // Zielspalte nicht prüfen

        // Daten nach dieser Spalte testweise gruppieren
        const groups = {};
        data.forEach(row => {
            const val = row[col];
            if (!groups[val]) groups[val] = [];
            groups[val].push(row);
        });

        // Berechnen, wie rein die neuen Untergruppen wären
        let weightedGini = 0;
        for (let key in groups) {
            const subset = groups[key];
            const weight = subset.length / data.length;
            weightedGini += weight * calculateGini(subset, targetColIndex);
        }

        // Informationsgewinn = Altes Chaos - Neues Chaos
        const gain = baseGini - weightedGini;
        if (gain > bestGain) {
            bestGain = gain;
            bestColIndex = col;
        }
    }
    return bestColIndex;
}

// Der smarte, rekursive Haupt-Algorithmus
function buildSmartTree(data, headers) {
    const targetColIndex = headers.length - 1;

    // Abbruch 1: Keine Daten
    if (data.length === 0) return { name: "Keine Daten", isLeaf: true };

    // Abbruch 2: Alle Ergebnisse sind bereits gleich (Perfektes Blatt!)
    const uniqueTargets = [...new Set(data.map(r => r[targetColIndex]))];
    if (uniqueTargets.length === 1) {
        return { name: "Ergebnis: " + uniqueTargets[0], isLeaf: true };
    }

    // Abbruch 3: Keine Spalten mehr übrig, aber Daten noch gemischt (Mehrheitsentscheid)
    if (headers.length <= 1) {
        const counts = {};
        data.forEach(r => counts[r[targetColIndex]] = (counts[r[targetColIndex]] || 0) + 1);
        const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        return { name: "Wahrscheinlich: " + mostCommon, isLeaf: true };
    }

    // Die beste Spalte für den nächsten Schnitt finden!
    const bestColIndex = findBestSplit(data, headers, targetColIndex);
    const featureName = headers[bestColIndex];

    // Daten nach der besten Spalte gruppieren
    const groups = {};
    data.forEach(row => {
        const val = row[bestColIndex];
        if (!groups[val]) groups[val] = [];
        groups[val].push(row);
    });

    const children = [];
    
    // Wir entfernen die genutzte Spalte, damit sie weiter unten nicht nochmal geprüft wird
    const neueHeaders = headers.filter((_, i) => i !== bestColIndex);

    for (let val in groups) {
        // Auch aus den Datenzeilen schneiden wir die genutzte Spalte heraus
        const bereinigteDaten = groups[val].map(row => row.filter((_, i) => i !== bestColIndex));
        
        children.push({
            edgeLabel: val,
            node: buildSmartTree(bereinigteDaten, neueHeaders) // Rekursion!
        });
    }

    return { name: featureName, children: children, isLeaf: false };
}

// Zeichnet das HTML für den CSS-Baum
function renderTreeHTML(node) {
    let html = `<li>`;
    // Unterschiedliches Styling für Ergebnisse (Blätter) und Fragen (Knoten)
    if (node.isLeaf) {
        html += `<div class="node" style="background-color: var(--success-color); color: white; border-color: var(--success-color);">${node.name}</div>`;
    } else {
        html += `<div class="node">${node.name}</div>`;
    }
    
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