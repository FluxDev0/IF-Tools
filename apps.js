apps = {
    "tree_generator": `
        <h1>Entscheidungsbaum-Generator</h1>
            
        <div class="card neuro-inset">
            <h3>1. Datensatz eingeben</h3>
            <p class="card-desc">
                Die letzte Spalte wird als "Ergebnis" gewertet. Klicke in die Zellen, um Text zu ändern.
            </p>
            <div class="controls">
                <button class="btn-add neuro-raised" onclick="addColumn()">+ Spalte</button>
                <button class="btn-delete neuro-raised" onclick="removeColumn()">- Spalte löschen</button>
                <button class="btn-add neuro-raised" onclick="addRow()">+ Zeile</button>
                <button class="btn-delete neuro-raised" onclick="removeRow()">- Zeile löschen</button>
                <button class="btn-generate neuro-raised" onclick="generateTree()">🌳 Baum generieren</button>
            </div>
            
            <table id="data-table">
                <thead>
                    <tr>
                        <th contenteditable="true">Wetter</th>
                        <th contenteditable="true">Temperatur</th>
                        <th contenteditable="true" class="target-column">Spielen? (Ziel)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Heiß</td>
                        <td contenteditable="true">Nein</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Regen</td>
                        <td contenteditable="true">Kalt</td>
                        <td contenteditable="true">Nein</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Mild</td>
                        <td contenteditable="true">Ja</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="card">
            <h3>2. Dein generierter Baum</h3>
            <div class="tree-container" id="tree-container">
                <p class="placeholder-text">Klicke oben auf "Baum generieren".</p>
            </div>
        </div>
    `,
    "multiplayer": `
        <h1>Multiplayer Test</h1>
            
        <div class="card">
            <h3>1. Datensatz eingeben</h3>
            <p class="card-desc">
                Die letzte Spalte wird als "Ergebnis" gewertet. Klicke in die Zellen, um Text zu ändern.
            </p>
            <div class="controls">
                <button class="btn-add neuro-raised" onclick="addColumn()">+ Spalte</button>
                <button class="btn-delete neuro-raised" onclick="removeColumn()">- Spalte löschen</button>
                <button class="btn-add neuro-raised" onclick="addRow()">+ Zeile</button>
                <button class="btn-delete neuro-raised" onclick="removeRow()">- Zeile löschen</button>
                <button class="btn-generate neuro-raised" onclick="generateTree()">🌳 Baum generieren</button>
            </div>
            
            <table id="data-table">
                <thead>
                    <tr>
                        <th contenteditable="true">Wetter</th>
                        <th contenteditable="true">Temperatur</th>
                        <th contenteditable="true" class="target-column">Spielen? (Ziel)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Heiß</td>
                        <td contenteditable="true">Nein</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Regen</td>
                        <td contenteditable="true">Kalt</td>
                        <td contenteditable="true">Nein</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Mild</td>
                        <td contenteditable="true">Ja</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="card">
            <h3>2. Dein generierter Baum</h3>
            <div class="tree-container" id="tree-container">
                <p class="placeholder-text">Klicke oben auf "Baum generieren".</p>
            </div>
        </div>
    `
}

extrafuncs = {
  "tree_generator": function() {table = document.getElementById('data-table');}
};