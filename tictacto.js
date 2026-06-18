const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

// Alle Gewinnmöglichkeiten (Indexe im 3x3 Array)
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Waagerecht
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Senkrecht
    [0, 4, 8], [2, 4, 6]             // Diagonal
];

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

// Klick auf ein Feld verarbeiten
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        // Ignorieren, wenn das Feld besetzt oder das Spiel vorbei ist
        if (board[index] !== "" || !isGameActive) return;

        // Zug im Code und auf der UI eintragen
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase()); // Klasse 'x' oder 'o' hinzufügen

        checkResult();
    });
});

function clickCell(symbol = "X", cellindex = 0) {
    cells.forEach(cell => {
        if (cell.getAttribute('data-index') == cellindex) {
            if (board[cellindex] !== "" || !isGameActive) return;

            board[cellindex] = symbol;
            cell.innerText = symbol;
            cell.classList.add(symbol.toLowerCase());

            checkResult();
        };
    });
}

// Ergebnis prüfen
function checkResult() {
    let roundWon = false;

    // Alle Gewinn-Muster durchlaufen
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerHTML = `🎉 Spieler <span style="color: ${currentPlayer === 'X' ? '#3498db' : '#e74c3c'}">${currentPlayer}</span> hat gewonnen!`;
        isGameActive = false;
        return;
    }

    // Prüfen auf Unentschieden (Keine leeren Felder mehr)
    if (!board.includes("")) {
        statusText.innerText = "🤝 Unentschieden!";
        isGameActive = false;
        return;
    }

    // Spieler wechseln
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Spieler ${currentPlayer} ist am Zug`;
}

// Reset-Funktion
resetBtn.addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusText.innerText = "Spieler X ist am Zug";
    
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });
});