apps = {
    "tree_generator": `
        <h1>Entscheidungsbaum-Generator</h1>
            
        <div class="card">
            <h3>1. Datensatz eingeben</h3>
            <p class="card-desc">
                Die letzte Spalte wird als "Ergebnis" gewertet. Klicke in die Zellen, um Text zu ändern.
            </p>
            <div class="controls">
                <button class="btn-1" data-btn="green" onclick="addColumn()">+ Spalte</button>
                <button class="btn-1" data-btn="red" onclick="removeColumn()">- Spalte löschen</button>
                <button class="btn-1" data-btn="green" onclick="addRow()">+ Zeile</button>
                <button class="btn-1" data-btn="red" onclick="removeRow()">- Zeile löschen</button>
                <button class="btn-1" data-btn="blue" onclick="generateTree()">🌳 Baum generieren</button>
            </div>

            <div class="import-section">
                <h3>Daten importieren</h3>
                <label for="csv-file" class="custom-file-upload">
                    📁 CSV-Datei auswählen
                </label>
                <input type="file" id="csv-file" accept=".csv" onchange="importCSV(event)">
                <p id="file-name-display" style="font-style: italic; color: gray;"></p>
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
                        <td contenteditable="true">Warm</td>
                        <td contenteditable="true">Ja</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Regen</td>
                        <td contenteditable="true">Warm</td>
                        <td contenteditable="true">Nein</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Warm</td>
                        <td contenteditable="true">Ja</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Sonnig</td>
                        <td contenteditable="true">Heiß</td>
                        <td contenteditable="true">Nein</td>
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
    `,
    "buttons": `
        <button class="btn-1" data-btn="blue">Klick mich!!</button>
        <button class="btn-1" data-btn="red">Klick mich!!</button>
        <button class="btn-1" data-btn="green">Klick mich!!</button>
        <button class="btn-1" data-btn="gray">Klick mich!!</button>
    `,
    "settings": `
        <div class="settings-box">
            <h3>Erweiterte Einstellungen</h3>
            
            <div>
                <label for="tree-border-size-input">Baum Linien Breite (in px):</label>
                <input type="number" id="tree-border-size-input" value="2" min="0" max="100">
            </div>
            
            <div>
                <label for="border-checkbox">Runde Ecken aktivieren:</label>
                <input type="checkbox" id="border-checkbox" checked>
            </div>
        </div>
    `,
    "chat": `
    <div class="chat-container">
        <div id="chat-window" class="chat-window">
            </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Nachricht schreiben..." autocomplete="off">
            <button class="btn-1" id="">Senden</button>
        </div>
    </div>
    `,
    "admin_menu": `
        <input type="text" id="text-input" placeholder="Nachricht eingeben" onkeypress="handleEnter(event)">
        <div data-btn="blue" class="btn-1" onclick="sendeBroadcast(document.querySelector('#text-input').value);">Broadcast senden</div>
        <div data-btn="blue" class="btn-1" onclick="sendeAlert(document.querySelector('#text-input').value);">Alert senden</div>
    `,
}

extrafuncs = {
  "tree_generator": function() {table = document.getElementById('data-table');}
};