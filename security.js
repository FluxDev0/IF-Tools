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
        sessionStorage.setItem('adminToken', data.token);
        alert("Erfolgreich als Admin angemeldet!");
        hideLoginScreen();
    } else {
        alert("Falsches Passwort!");
    }
}

function hideLoginScreen() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-layout').style.display = 'flex';
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-layout').style.display = 'none';
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
            const infoBox = document.getElementById('admin-announcement');
            if (infoBox) infoBox.innerText = daten.text;
        }

        if (daten.type === 'ALERT') {
            alert(daten.text);
        }
    };

    // Falls Render den Server schlafen legt, versuchen wir nach 5 Sekunden automatisch neu zu verbinden
    socket.onclose = () => {
        console.log("Verbindung verloren. Versuche neu zu verbinden...");
        setTimeout(verbindeWebSocket, 5000);
    };
}

function logOut() {
    sessionStorage.removeItem("adminToken")
}

// Beim Laden der Seite ausführen
window.addEventListener('DOMContentLoaded', verbindeWebSocket);

hideLoginScreen();