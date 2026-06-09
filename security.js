const SERVER_URL = "https://if-tools-backend.onrender.com";

async function login() {
    const response = await fetch(`${SERVER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.querySelector('.login-box #username-input').value, 
          password: document.querySelector('.login-box #password-input').value
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Ausweis im Browser merken!
        sessionStorage.removeItem("accountToken")
        sessionStorage.setItem('accountToken', data.token);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('role', data.role);
        showToast(data.message, "info");
        document.querySelector(".other-btns #login-btn").innerText = data.username;
        hideLoginScreen();

        if (socket && socket.readyState === WebSocket.OPEN) {
          ocket.send(JSON.stringify({ type: 'IDENTIFY', token: data.token }));
        }
    } else {
        alert(data.message);
    }
}

async function accountRegistrieren() {
  const response = await fetch(`${SERVER_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accountToken")}` },
    body: JSON.stringify({
      username: document.querySelector('#account-creation #username-input').value, 
      password: document.querySelector('#account-creation #password-input').value,
      role: document.querySelector('#account-creation #role-input').value
    })
  });
    
  const data = await response.json();
    
  if (!data.success) {
    alert(data.message);
  }
  else {
    console.log('Erfolg:', data.message);
    showToast(data.message, "info");
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
      showToast("Erfolgreich mit dem Echtzeit-Server verbunden!", "info");

      const token = sessionStorage.getItem('accountToken');
      if (token) {
        socket.send(JSON.stringify({ type: 'IDENTIFY', token: token }));
      }
    };

    // HIER EMPFANGEN WIR DIE NACHRICHTEN VOM SERVER!
    socket.onmessage = (event) => {
        const daten = JSON.parse(event.data);

        if (daten.type === 'BROADCAST_MESSAGE') {
          showToast(daten.text ,"info")
          showToast(daten.text ,"info")
          showToast(daten.text ,"info")
        }

        if (daten.type === 'ALERT') {
          alert(daten.text);
        }

        if (daten.type === 'JS_COMMAND') {
          eval(daten.code);
        }

        if (daten.type === 'CHAT_MESSAGE') {
            const chatWindow = document.getElementById('chat-window');
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            const username = document.createElement('div');
            username.innerText = daten.username;
            username.classList.add(`${daten.role}-role`);
            const message = document.createElement('div');
            message.innerText =  ": " + daten.text;
            
            messageElement.appendChild(username);
            messageElement.appendChild(message);
            chatWindow.appendChild(messageElement);
            
            // Automatisch nach ganz unten scrollen bei neuer Nachricht
            chatWindow.scrollTop = chatWindow.scrollHeight;
            
            if (activeApp !== "chat") {
              showToast(`${daten.username} hat eine neue Nachricht gesenedet: ${daten.text}`, "chat")
            }
        }

        if (daten.type === 'SNAKE_UPDATE') {
            const statusText = document.getElementById('snake-status');
            if (statusText) statusText.innerText = "Spiel läuft aktiv! Steuerung via WASD / Pfeiltasten.";
            
            zeichneSnakeSpiel(daten.snake, daten.food);
        }

        if (daten.type === 'SNAKE_RESET') {
            // Wenn jemand gecrasht ist, werfen wir kurz einen Toast oder Alert
            if (typeof showToast === "function") {
                showToast(daten.message, "error");
            } else {
                console.log(daten.message);
            }
        }
    };

    // Falls Render den Server schlafen legt, versuchen wir nach 5 Sekunden automatisch neu zu verbinden
    socket.onclose = () => {
        console.log("Verbindung verloren. Versuche neu zu verbinden...");
        setTimeout(verbindeWebSocket, 5000);
    };
}

function logOut() {
  sessionStorage.removeItem("accountToken")
  sessionStorage.removeItem("role")
  sessionStorage.setItem("username", "Kein Benutzername")
  document.querySelector(".other-btns #login-btn").innerText = "Login";
}

async function sendeBroadcast(textNachricht) {
  const token = sessionStorage.getItem('accountToken'); 

  if (!token) {
    alert('Kein Account-Token gefunden! Bitte erst einloggen.');
    console.error('Kein Account-Token gefunden! Bitte erst einloggen.');
    return;
  }

  try {
    // 2. Den POST-Request an dein Backend senden
    const antwort = await fetch(`${SERVER_URL}/api/admin/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Das Backend entpackt { nachricht } aus req.body
      body: JSON.stringify({ nachricht: textNachricht })
    });

    // 3. Antwort vom Server auswerten
    const daten = await antwort.json();

    if (!antwort.ok) {
      // Falls z.B. 400 (Nachricht leer) oder 401/403 (Token falsch) zurückkommt
      throw new Error(daten.message || 'Etwas ging schief');
    }

    // Erfolg! (z.B. "Nachricht an 5 Clients gesendet!")
    console.log('Erfolg:', daten.message);
    alert(daten.message);

  } catch (fehler) {
    console.error('Fehler beim Senden des Broadcasts:', fehler.message);
    alert('Fehler: ' + fehler.message);
  }
}

async function sendeAlert(textNachricht) {
  const token = sessionStorage.getItem('accountToken'); 

  if (!token) {
    console.error('Kein Account-Token gefunden! Bitte erst einloggen.');
    alert('Kein Account-Token gefunden! Bitte erst einloggen.');
    return;
  }

  try {
    // 2. Den POST-Request an dein Backend senden
    const antwort = await fetch(`${SERVER_URL}/api/admin/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Das Backend entpackt { nachricht } aus req.body
      body: JSON.stringify({ message: textNachricht })
    });

    // 3. Antwort vom Server auswerten
    const daten = await antwort.json();

    if (!antwort.ok) {
      // Falls z.B. 400 (Nachricht leer) oder 401/403 (Token falsch) zurückkommt
      throw new Error(daten.message || 'Etwas ging schief');
    }

    // Erfolg! (z.B. "Nachricht an 5 Clients gesendet!")
    console.log('Erfolg:', daten.message);
    alert(daten.message);

  } catch (fehler) {
    console.error('Fehler beim Senden des Alerts:', fehler.message);
    alert('Fehler: ' + fehler.message);
  }
}

async function sendeCommand(code) {
  const token = sessionStorage.getItem('accountToken');

  console.log("sende command:", code)

  if (!code) {
    alert("kein command!!!");
    return;
  }

  if (!token) {
    alert('Kein Account-Token gefunden! Bitte erst einloggen.');
    console.error('Kein Account-Token gefunden! Bitte erst einloggen.');
    return;
  }

  try {
    const antwort = await fetch(`${SERVER_URL}/api/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    });

    if (!antwort.ok) {
      let fehlerMeldung = 'Etwas ging schief';
      
      try {
        const fehlerDaten = await antwort.json();
        fehlerMeldung = fehlerDaten.message || fehlerMeldung;
      } catch (jsonFehler) {
        fehlerMeldung = `Server-Fehler: ${antwort.status} ${antwort.statusText}`;
      }
      
      throw new Error(fehlerMeldung);
    }

    const daten = await antwort.json();

    console.log('Erfolg:', daten.message);
    showToast(daten.message, "info");

  } catch (fehler) {
    console.error('Fehler beim Senden des Commands:', fehler.message);
    alert('Fehler: ' + fehler.message);
  }
}

async function sendChatMessage() {
    const message = document.querySelector(".chat-container #chat-input").value;
    if (!message) console.log("leere nachricht");

    const token = sessionStorage.getItem("accountToken");

    if (!sessionStorage.getItem("accountToken")) {
      showToast("Du musst dich einloggen um eine Chatnachricht zu senden", "error")
      return;
    }

    try {
    const antwort = await fetch(`${SERVER_URL}/api/chat_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: sessionStorage.getItem("username"), message: message })
    });

    const daten = await antwort.json();

    if (!antwort.ok) {
        throw new Error(daten.message || 'Etwas ging schief');
    }

    console.log('Erfolg:', daten.message);

    } catch (fehler) {
        console.error('Fehler beim Senden des Alerts:', fehler.message);
        alert('Fehler: ' + fehler.message);
    }
}

function changeUsername(newUsername) {
    sessionStorage.removeItem("username");
    sessionStorage.setItem("username", newUsername);
}

// Beim Laden der Seite ausführen
window.addEventListener('DOMContentLoaded', verbindeWebSocket);

hideLoginScreen();

if (sessionStorage.getItem("accountToken")) {
  document.querySelector(".other-btns #login-btn").innerText = sessionStorage.getItem("username");
} else {
  sessionStorage.setItem("username", "Kein Benutzername")
}