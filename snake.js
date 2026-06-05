// --- FRONTEND MULTIPLAYER SNAKE LOGIK ---
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
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
    if (!ctx) return;

    // 1. Spielfeld leeren
    ctx.fillStyle = "#1e272e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Essen zeichnen (Neon-Rot)
    ctx.fillStyle = "#ff4757";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff4757";
    ctx.fillRect(foodData.x * CELL_SIZE, foodData.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);

    // 3. Schlange zeichnen (Neon-Grün)
    ctx.shadowColor = "#2ed573";
    snakeData.forEach((segment, index) => {
        // Der Kopf kriegt eine etwas hellere Farbe
        ctx.fillStyle = index === 0 ? "#57606f" : "#2ed573";
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 2, CELL_SIZE - 2);
    });
    
    // Shadow-Effekt zurücksetzen für Performance
    ctx.shadowBlur = 0;
}