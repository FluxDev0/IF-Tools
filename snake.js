// --- FRONTEND MULTIPLAYER SNAKE LOGIK ---
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas ? canvas.getContext('2d') : null;
const snakeStatus = document.getElementById('snake-status');
const CELL_SIZE = 20;

// Tastatur-Eingaben abfangen und direkt an den Server funken!
window.addEventListener('keydown', (e) => {

    if (activeApp !== "multiplayer-snake" || !socket || socket.readyState !== 1) return;

    let dir = null;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dir = "UP";
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dir = "DOWN";
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dir = "LEFT";
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dir = "RIGHT";

    if (dir) {
        socket.send(JSON.stringify({ type: 'SNAKE_INPUT', dir: dir }));
    }
});

function zeichneSnakeSpiel(snakeData, foodData) {
    if (!snakeCtx) return;

    // 1. Spielfeld leeren
    snakeCtx.fillStyle = "#1e272e";
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // 2. Essen zeichnen (Neon-Rot)
    snakeCtx.fillStyle = "#ff4757";
    snakeCtx.shadowBlur = 10;
    snakeCtx.shadowColor = "#ff4757";
    snakeCtx.fillRect(foodData.x * CELL_SIZE, foodData.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);

    // 3. Schlange zeichnen (Neon-Grün)
    snakeCtx.shadowColor = "#2ed573";
    snakeData.forEach((segment, index) => {
        // Der Kopf kriegt eine etwas hellere Farbe
        snakeCtx.fillStyle = index === 0 ? "#3eff25" : "#19b95c";
        snakeCtx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });
    
    // Shadow-Effekt zurücksetzen für Performance
    snakeCtx.shadowBlur = 0;
}