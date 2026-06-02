const SERVER_URL = "https://if-tools-backend.onrender.com";

async function loginAdmin() {
    const passwordInput = document.getElementById('password-input').value;
    
    const response = await fetch(`${SERVER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Ausweis im Browser merken!
        localStorage.setItem('adminToken', data.token);
        alert("Erfolgreich als Admin angemeldet!");
        login();
    } else {
        alert("Falsches Passwort!");
    }
}

function login() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-layout').style.display = 'flex';
}

const SOCKET_URL = SERVER_URL.replace(/^http/, 'ws');

let socket;

function verbindeWebSocket() {
    socket = new WebSocket(SOCKET_URL);

    // Sobald die Leitung erfolgreich steht
    socket.onopen = () => {
        console.log("Erfolgreich mit dem Echtzeit-Server verbunden!");
    };

    // HIER EMPFANGEN WIR DIE NACHRICHTEN VOM SERVER!
    socket.onmessage = (event) => {
        const daten = JSON.parse(event.data);

        if (daten.type === 'BROADCAST_MESSAGE') {
            // Eine Nachricht vom Admin ist angekommen!
            // Du kannst sie als alert anzeigen, oder hübsch ins HTML schreiben
            alert(daten.text);
            
            // Beispiel: Text in ein bestehendes HTML-Element schreiben
            const infoBox = document.getElementById('admin-announcement');
            if (infoBox) infoBox.innerText = daten.text;
        }
    };

    // Falls Render den Server schlafen legt, versuchen wir nach 5 Sekunden automatisch neu zu verbinden
    socket.onclose = () => {
        console.log("Verbindung verloren. Versuche neu zu verbinden...");
        setTimeout(verbindeWebSocket, 5000);
    };
}

// Beim Laden der Seite ausführen
window.addEventListener('DOMContentLoaded', verbindeWebSocket);