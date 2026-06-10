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

function findBestSplit(data, headers, targetColIndex) {
    let bestGain = -1;
    let bestColIndex = -1;
    const baseGini = calculateGini(data, targetColIndex);

    for (let col = 0; col < headers.length; col++) {
        if (col === targetColIndex) continue;

        const groups = {};
        data.forEach(row => {
            const val = row[col];
            if (!groups[val]) groups[val] = [];
            groups[val].push(row);
        });

        let weightedGini = 0;
        for (let key in groups) {
            const subset = groups[key];
            const weight = subset.length / data.length;
            weightedGini += weight * calculateGini(subset, targetColIndex);
        }

        const gain = baseGini - weightedGini;
        if (gain > bestGain) {
            bestGain = gain;
            bestColIndex = col;
        }
    }
    return bestColIndex;
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

function buildSmartTree(data, headers, isRoot = true) {
    const targetColIndex = headers.length - 1;

    if (data.length === 0) return { name: "Keine Daten", isLeaf: true };

    // =========================================================================
    // STRUKTURIERTES TRACKING: Wir speichern ID und Werte getrennt als Objekt
    // =========================================================================
    if (isRoot) {
        data = data.map((row, index) => [...row, { id: index + 1, values: [...row] }]);
    }

    // Das Tracking-Objekt befindet sich immer am allerletzten Index der Zeile
    const trackingIndex = data[0].length - 1;

    // Abbruch: Perfektes Blatt
    const uniqueTargets = [...new Set(data.map(r => r[targetColIndex]))];
    if (uniqueTargets.length === 1) {
        return { 
            name: "Ergebnis: " + uniqueTargets[0], 
            isLeaf: true,
            matchedRows: data.map(r => r[trackingIndex]) // Objekte weitergeben
        };
    }

    // Abbruch: Keine Spalten mehr übrig
    if (headers.length <= 1) {
        const counts = {};
        data.forEach(r => counts[r[targetColIndex]] = (counts[r[targetColIndex]] || 0) + 1);
        const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        return { 
            name: "Wahrscheinlich: " + mostCommon, 
            isLeaf: true,
            matchedRows: data.map(r => r[trackingIndex])
        };
    }

    const bestColIndex = findBestSplit(data, headers, targetColIndex);
    const featureName = headers[bestColIndex];

    const groups = {};
    data.forEach(row => {
        const val = row[bestColIndex];
        if (!groups[val]) groups[val] = [];
        groups[val].push(row);
    });

    const children = [];
    const neueHeaders = headers.filter((_, i) => i !== bestColIndex);

    for (let val in groups) {
        // Wir filtern die genutzte Spalte heraus, behalten aber das Tracking-Objekt am Ende automatisch bei
        const bereinigteDaten = groups[val].map(row => row.filter((_, i) => i !== bestColIndex));
        
        children.push({
            edgeLabel: val,
            node: buildSmartTree(bereinigteDaten, neueHeaders, false)
        });
    }

    return { 
        name: featureName, 
        children: children, 
        isLeaf: false,
        matchedRows: data.map(r => r[trackingIndex])
    };
}

function renderTreeHTML(node, edgeLabel = "", config = {}) {
    let html = `<li>`;
    
    // 1. Wenn eine Linienbeschriftung existiert, kommt sie ganz oben ins <li>
    if (edgeLabel) {
        html += `<span class="edge-label">${edgeLabel}</span>`;
    }
    
    // Standard-Werte für die Anpassungen setzen, falls nichts übergeben wurde
    const cfg = Object.assign({ showDatasets: true, prefix: 'D', showValues: false }, config);
    
    // Optional: Datensätze-Anzeige zusammenbauen (Customization)
    let datasetHtml = "";
    if (cfg.showDatasets && !cfg.showValues && node.matchedRows && node.matchedRows.length > 0) {
        datasetHtml = `<div class="node-datasets">`;
        let datasetText = ``;
        node.matchedRows.forEach((row, index) => {
            datasetText = ``;
            let rowStr = `${cfg.prefix}${row.id}`;
            if (!index == 1) {
                datasetText += rowStr;
            }
            else {
                datasetText += `, ${rowStr}`;
            }
            if (row.values.at(-1) == 1 || row.values.at(-1) == "Ja" || row.values.at(-1) == "JA" || row.values.at(-1) == "ja") {
                datasetHtml += `<div style="margin-bottom: 1px; display: inline-block; white-space: pre-wrap; color: #37d417; text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);">${datasetText}</div>`;
            }
            else if (row.values.at(-1) == 0 || row.values.at(-1) == "Nein" || row.values.at(-1) == "NEIN" || row.values.at(-1) == "nein") {
                datasetHtml += `<div style="margin-bottom: 1px; display: inline-block; white-space: pre-wrap; color: #e60b0b; text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);">${datasetText}</div>`;
            }
            else {
                datasetHtml += `<div style="margin-bottom: 1px; display: inline-block; white-space: pre-wrap; text-shadow: 0px 0px 6px rgba(0, 0, 0, 1);">${datasetText}</div>`;
            }
        });
        datasetHtml += `</div>`;
    }

    if (cfg.showDatasets && cfg.showValues && node.matchedRows && node.matchedRows.length > 0) {
        datasetHtml = `<div class="node-datasets">`;
        node.matchedRows.forEach(row => {
            let rowStr = `${cfg.prefix}${row.id}`;
            rowStr += `: ${row.values.join(", ")}`;
            datasetHtml += `<div style="margin-bottom: 1px;">• ${rowStr}</div>`;
        });
        datasetHtml += `</div>`;
    }

    // 2. Den eigentlichen Knoten (Frage oder Ergebnis) zeichnen
    if (node.isLeaf) {
        html += `<div class="node node-leaf">${node.name}${datasetHtml}</div>`;
    } else {
        html += `<div class="node">${node.name}${datasetHtml}</div>`;
    }
    
    // 3. NUR WENN der Knoten echte Kinder hat, öffnen wir EIN gemeinsames <ul>
    if (node.children && node.children.length > 0) {
        html += `<ul>`;
        node.children.forEach(child => {
            // WICHTIG: Wir übergeben das Label an die Rekursion, anstatt hier ein neues <ul> zu bauen
            html += renderTreeHTML(child.node, child.edgeLabel, cfg);
        });
        html += `</ul>`;
    }
    
    html += `</li>`;
    return html;
}