// ==========================================
// GAME 1: MEMORY
// ==========================================
const emojis = ['🤖', '👾', '🚀', '🎮', '🎲', '☠️', '🕹️', '💾'];
let memoryDeck = [];
let flippedCards = [];
let matchedPairs = 0;

function startMemory() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    
    // Array verdoppeln und mischen
    memoryDeck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    memoryDeck.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card', 'hidden');
        card.innerText = emoji;
        card.dataset.index = index;
        card.onclick = () => flipMemoryCard(card, emoji);
        board.appendChild(card);
    });
}

function flipMemoryCard(card, emoji) {
    if (flippedCards.length >= 2 || !card.classList.contains('hidden')) return;
    
    card.classList.remove('hidden');
    flippedCards.push({ card, emoji });
    
    if (flippedCards.length === 2) {
        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.emoji === card2.emoji) {
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === emojis.length) {
            showToast('Gewonnen! Alle Paare gefunden.', 'info');
        }
    } else {
        card1.card.classList.add('hidden');
        card2.card.classList.add('hidden');
    }
    flippedCards = [];
}

startMemory()

// ==========================================
// GAME 2: REAKTIONSTEST
// ==========================================
let reactionState = 'start'; // start, waiting, ready
let reactionStartTime = 0;
let reactionTimeout;

function handleReactionClick() {
    const box = document.getElementById('reaction-box');
    const result = document.getElementById('reaction-result');

    if (reactionState === 'start') {
        // Spiel starten
        box.style.backgroundColor = 'var(--danger-color)';
        box.innerText = 'Warte auf Grün...';
        result.innerText = '';
        reactionState = 'waiting';
        
        const randomDelay = Math.floor(Math.random() * 3000) + 1500; // 1.5 bis 4.5 Sekunden
        
        reactionTimeout = setTimeout(() => {
            box.style.backgroundColor = 'var(--success-color)';
            box.innerText = 'KLICK JETZT!';
            reactionStartTime = Date.now();
            reactionState = 'ready';
        }, randomDelay);
        
    } else if (reactionState === 'waiting') {
        // Zu früh geklickt
        clearTimeout(reactionTimeout);
        box.style.backgroundColor = 'var(--neuro-bg-secondary)';
        box.innerText = 'Zu früh geklickt! Klicke zum Neustart.';
        reactionState = 'start';
        
    } else if (reactionState === 'ready') {
        // Richtig geklickt
        const reactionTime = Date.now() - reactionStartTime;
        box.style.backgroundColor = 'var(--primary-color)';
        box.innerText = 'Klicke hier, um nochmal zu spielen!';
        result.innerText = `Deine Zeit: ${reactionTime} ms ⚡`;
        reactionState = 'start';
    }
}


// ==========================================
// GAME 3: SOLO PONG
// ==========================================
const pongCanvas = document.getElementById('pongCanvas');
const pongCtx = pongCanvas.getContext('2d');
let pongLoop;
let pongScore = 0;

let pongGame = {
    ballX: 200, ballY: 200,
    ballSpeedX: 4, ballSpeedY: -4,
    paddleX: 150, paddleWidth: 100, paddleHeight: 15
};

// Mausbewegung auf dem Canvas tracken
pongCanvas.addEventListener('mousemove', (e) => {
    const rect = pongCanvas.getBoundingClientRect();
    const root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    pongGame.paddleX = mouseX - pongGame.paddleWidth / 2;
});

function startPong() {
    cancelAnimationFrame(pongLoop);
    pongGame.ballX = 200; pongGame.ballY = 200;
    pongGame.ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    pongGame.ballSpeedY = -4;
    pongScore = 0;
    document.getElementById('pong-score').innerText = `Punkte: ${pongScore}`;
    updatePong();
}

function updatePong() {
    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
    
    // Ball bewegen
    pongGame.ballX += pongGame.ballSpeedX;
    pongGame.ballY += pongGame.ballSpeedY;
    
    // Wandkollision (Links/Rechts/Oben)
    if (pongGame.ballX < 0 || pongGame.ballX > pongCanvas.width) pongGame.ballSpeedX *= -1;
    if (pongGame.ballY < 0) pongGame.ballSpeedY *= -1;
    
    // Paddle Kollision
    if (pongGame.ballY > pongCanvas.height - pongGame.paddleHeight - 10) {
        if (pongGame.ballX > pongGame.paddleX && pongGame.ballX < pongGame.paddleX + pongGame.paddleWidth) {
            pongGame.ballSpeedY *= -1;
            // Ball wird minimal schneller
            pongGame.ballSpeedY *= 1.05; 
            pongScore++;
            document.getElementById('pong-score').innerText = `Punkte: ${pongScore}`;
        }
    }
    
    // Game Over Check (Boden berührt)
    if (pongGame.ballY > pongCanvas.height) {
        pongCtx.fillStyle = 'white';
        pongCtx.font = '30px Arial';
        pongCtx.fillText('Game Over!', 120, 200);
        return; // Loop stoppen
    }
    
    // Zeichnen
    pongCtx.fillStyle = '#3498db'; // Ball Farbe
    pongCtx.beginPath();
    pongCtx.arc(pongGame.ballX, pongGame.ballY, 8, 0, Math.PI*2, true);
    pongCtx.fill();
    
    pongCtx.fillStyle = '#e94560'; // Paddle Farbe
    pongCtx.fillRect(pongGame.paddleX, pongCanvas.height - pongGame.paddleHeight - 5, pongGame.paddleWidth, pongGame.paddleHeight);
    
    pongLoop = requestAnimationFrame(updatePong);
}

// ==========================================
// GAME 4: BIT CLICKER
// ==========================================
let bits = 0;
let bitsPerClick = 1;
let upgradeCost = 10;

function clickBit() {
    bits += bitsPerClick;
    updateClickerUI();
}

function buyUpgrade() {
    if (bits >= upgradeCost) {
        bits -= upgradeCost;
        bitsPerClick++;
        upgradeCost = Math.floor(upgradeCost * 1.5); // Preis steigt um 50%
        updateClickerUI();
        
        if (typeof showToast === "function") {
            showToast("Upgrade gekauft!", "info");
        }
    } else {
        if (typeof showToast === "function") {
            showToast("Nicht genug Bits!", "error");
        }
    }
}

function updateClickerUI() {
    document.getElementById('bit-score').innerText = `${bits} Bits`;
    document.getElementById('upgrade-cost').innerText = `Kosten: ${upgradeCost} Bits`;
}


// ==========================================
// GAME 5: SCHERE STEIN PAPIER
// ==========================================
const rpsOptions = ['Stein', 'Papier', 'Schere'];

function playRPS(playerChoice) {
    const computerChoice = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
    const resultElement = document.getElementById('rps-result');
    
    // Emojis für den Computer
    const emojiMap = { 'Stein': '✊', 'Papier': '✋', 'Schere': '✌️' };
    document.getElementById('rps-computer').innerText = `${emojiMap[computerChoice]} ${computerChoice}`;
    
    if (playerChoice === computerChoice) {
        resultElement.innerText = "Unentschieden! 🤝";
        resultElement.style.color = "gray";
    } else if (
        (playerChoice === 'Stein' && computerChoice === 'Schere') ||
        (playerChoice === 'Papier' && computerChoice === 'Stein') ||
        (playerChoice === 'Schere' && computerChoice === 'Papier')
    ) {
        resultElement.innerText = "Du gewinnst! 🎉";
        resultElement.style.color = "var(--success-color)";
    } else {
        resultElement.innerText = "Computer gewinnt! 💻";
        resultElement.style.color = "var(--danger-color)";
    }
}


// ==========================================
// GAME 6: HEX-GUESSER
// ==========================================
let correctHex = "";

function generateRandomHex() {
    // Generiert einen zufälligen 6-stelligen Hex-Code
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

function startHexGuesser() {
    const colorBox = document.getElementById('hex-color-box');
    const optionsContainer = document.getElementById('hex-options');
    const resultText = document.getElementById('hex-result');
    
    resultText.innerText = "";
    optionsContainer.innerHTML = "";
    
    // Eine richtige und zwei falsche Farben generieren
    correctHex = generateRandomHex();
    let options = [correctHex, generateRandomHex(), generateRandomHex()];
    
    // Array mischen
    options = options.sort(() => Math.random() - 0.5);
    
    // Farbe anzeigen
    colorBox.style.backgroundColor = correctHex;
    
    // Buttons erstellen
    options.forEach(hexVal => {
        const btn = document.createElement('button');
        btn.classList.add('btn-1');
        btn.dataset.btn = "gray";
        btn.innerText = hexVal;
        btn.onclick = () => checkHexGuess(hexVal);
        optionsContainer.appendChild(btn);
    });
}

function checkHexGuess(guess) {
    const resultText = document.getElementById('hex-result');
    if (guess === correctHex) {
        resultText.innerText = "Richtig! 🎯";
        resultText.style.color = "var(--success-color)";
        setTimeout(startHexGuesser, 1500); // Nächste Runde nach kurzer Pause
    } else {
        resultText.innerText = "Falsch, versuch's nochmal! ❌";
        resultText.style.color = "var(--danger-color)";
    }
}

startHexGuesser()