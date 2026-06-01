let peer = null;
let connections = []; // Array, um ALLE verbundenen Spieler zu speichern
let isHost = false;

window.addEventListener('load', () => {
    peer = new Peer();

    peer.on('open', (id) => {
        document.getElementById('my-id-display').innerText = id;
    });

    // WENN WIR DER HOST SIND: Jemand verbindet sich mit uns
    peer.on('connection', (conn) => {
        isHost = true;
        connections.push(conn); // Neuen Spieler in der Liste speichern
        
        setupConnectionHandlers(conn);
        
        // Allen sagen, dass jemand Neues da ist
        broadcast({ type: "SYSTEM", message: `Ein neuer Spieler ist beigetreten!` });
        updatePlayerCount();
    });
});

// WENN WIR EIN CLIENT SIND: Wir verbinden uns zum Host
function connectToHost(hostId) {
    if (!hostId) return alert("Bitte gib eine gültige ID ein!");

    document.getElementById('game-status').innerText = "Verbinde zum Raum...";
    
    let conn = peer.connect(hostId);
    connections.push(conn); // Den Host in unserer Liste speichern
    
    setupConnectionHandlers(conn);
}

// Verbindung einrichten
function setupConnectionHandlers(conn) {
    conn.on('open', () => {
        document.getElementById('game-status').innerText = "Verbunden!";
        document.getElementById('game-area').style.display = "block";
        updatePlayerCount();
    });

    // Wenn Daten (Nachrichten/Spielzüge) ankommen
    conn.on('data', (data) => {
        if (isHost) {
            // Wenn wir der Host sind, leiten wir die Nachricht an ALLE anderen weiter
            // Damit jeder im Raum sieht, was passiert
            broadcast(data, conn.peer); 
            displayMessage(data.sender + ": " + data.message);
        } else {
            // Wenn wir ein normaler Spieler sind, zeigen wir es einfach an
            if (data.type === "SYSTEM") {
                displayMessage(`System: ${data.message}`);
            } else {
                displayMessage(data.sender + ": " + data.message);
            }
        }
    });

    conn.on('close', () => {
        // Spieler aus der Liste löschen, wenn er geht
        connections = connections.filter(c => c.peer !== conn.peer);
        updatePlayerCount();
        displayMessage("Ein Bro ist abgehauen.");
    });
}

// Nachricht an ALLE senden (wichtig für den Host)
// 'excludePeer' sorgt dafür, dass der Absender seine eigene Nachricht nicht nochmal geschickt bekommt
function broadcast(data, excludePeer = null) {
    connections.forEach(conn => {
        if (conn.open && conn.peer !== excludePeer) {
            conn.send(data);
        }
    });
}

// Eigene Nachricht absenden
function sendGameMove() {
    const msg = document.getElementById('game-msg-input').value;
    if (!msg) return;

    const myName = isHost ? "Host (Du)" : "Spieler " + peer.id.substring(0, 4);
    const dataPackage = { type: "CHAT", sender: myName, message: msg };

    if (isHost) {
        // Als Host direkt an alle senden und bei uns anzeigen
        broadcast(dataPackage);
        displayMessage("Du: " + msg);
    } else {
        // Als Client senden wir es nur an den Host, der es dann verteilt
        if (connections[0] && connections[0].open) {
            connections[0].send(dataPackage);
            displayMessage("Du: " + msg);
        } else {
            alert("Nicht verbunden!");
        }
    }
    document.getElementById('game-msg-input').value = "";
}

function sendData(data, dataType) {
    if (!data) return;

    const myName = isHost ? "Host" : "Spieler " + peer.id.substring(0, 4);
    const dataPackage = { type: dataType, sender: myName, message: data };

    if (isHost) {
        // Als Host direkt an alle senden und bei uns anzeigen
        broadcast(dataPackage);
    } else {
        // Als Client senden wir es nur an den Host, der es dann verteilt
        if (connections[0] && connections[0].open) {
            connections[0].send(dataPackage);
        } else {
            alert("Nicht verbunden!");
        }
    }
}

function displayMessage(text) {
    const chat = document.getElementById('game-chat');
    chat.innerHTML += `<p>${text}</p>`;
    chat.scrollTop = chat.scrollHeight; // Automatisch nach unten scrollen
}

function updatePlayerCount() {
    const count = isHost ? connections.length + 1 : "Verbunden";
    document.getElementById('game-status').innerText = isHost ? `Lobby aktiv (${count} Spieler im Raum)` : "Verbunden als Spieler";
}