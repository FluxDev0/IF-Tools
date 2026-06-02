const SERVER_URL = "https://if-tools-backend.onrender.com";

async function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';

    try {
        // Daten an deinen eigenen Server senden
        const response = await fetch(`${SERVER_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput })
        });

        const data = await response.json();

        if (data.success) {
            // Server sagt ja -> Login erfolgreich!
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-layout').style.display = 'flex';
        } else {
            // Server sagt nein
            errorMsg.innerText = data.error;
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.innerText = "Server antwortet nicht. (Falls er schläft, warte 30 Sek.)";
        errorMsg.style.display = 'block';
    }
}