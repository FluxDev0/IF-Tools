const tdCanvas = document.getElementById('tdCanvas');
const tdCtx = tdCanvas.getContext('2d');

// 1. Spielfeld & Karten Konfigurationen
const tdMaps = [
    {
        color: "#27ae60",
        pathColor: "#34495e",
        path: [{x: 0, y: 100}, {x: 200, y: 100}, {x: 200, y: 400}, {x: 600, y: 400}, {x: 600, y: 200}, {x: 800, y: 200}]
    },
    {
        color: "#e67e22",
        pathColor: "#d35400",
        path: [{x: 100, y: 0}, {x: 100, y: 500}, {x: 400, y: 500}, {x: 400, y: 100}, {x: 700, y: 100}, {x: 700, y: 600}]
    },
    {
        color: "#74b9ff",
        pathColor: "#0984e3",
        path: [{x: 0, y: 300}, {x: 300, y: 300}, {x: 300, y: 100}, {x: 500, y: 100}, {x: 500, y: 500}, {x: 800, y: 500}]
    }
];
let currentMapIndex = 0;

// 2. Turm & Gegner Basis-Konfigurationen
const towerTypes = {
    basic:  { cost: 100, range: 120, damage: 15, cooldown: 30, color: '#3498db' },
    sniper: { cost: 200, range: 250, damage: 45, cooldown: 60, color: '#e67e22' },
    bomb:   { cost: 250, range: 100, damage: 40, cooldown: 50, color: '#e74c3c' },
    ice:    { cost: 150, range: 110, damage: 5,  cooldown: 25, color: '#2ecc71' }
};

const enemyTypes = {
    normal:    { hpMult: 1.0,  speed: 1.5, reward: 10,  color: '#e74c3c', radius: 11 },
    fast:      { hpMult: 0.6,  speed: 2.8, reward: 12,  color: '#f1c40f', radius: 8  },
    tank:      { hpMult: 3.0,  speed: 0.8, reward: 25,  color: '#8e44ad', radius: 15 },
    boss:      { hpMult: 10.0, speed: 0.5, reward: 100, color: '#2c3e50', radius: 20 }
};

// 3. Game State
let tdState = {
    gold: 200,
    lives: 20,
    wave: 0,
    essence: 0,
    isRunning: false,
    selectedTower: null,
    selectedPlacedTower: null, 
    skills: {
        damage: 0,
        cost: 0,
        hp: 0
    }
};

let enemies = [];
let towers = [];
let projectiles = [];
let enemiesToSpawn = 0;
let spawnTimer = 0;

// 4. UI Updates
function updateTdUI() {
    document.getElementById('td-gold').innerText = tdState.gold;
    document.getElementById('td-lives').innerText = tdState.lives;
    document.getElementById('td-wave').innerText = tdState.wave;
    document.getElementById('td-essence').innerText = tdState.essence;
}

// 5. Gegner Klasse
class Enemy {
    constructor(type, wave) {
        let config = enemyTypes[type];
        let currentPath = tdMaps[currentMapIndex].path;
        this.type = type;
        this.x = currentPath[0].x;
        this.y = currentPath[0].y;
        this.hp = Math.round((30 + (wave * 18)) * config.hpMult);
        this.maxHp = this.hp;
        this.baseSpeed = config.speed + (wave * 0.04);
        this.speed = this.baseSpeed;
        this.reward = config.reward;
        this.color = config.color;
        this.radius = config.radius;
        this.pathIndex = 1;
        this.slowTimer = 0;
    }

    update() {
        if (this.slowTimer > 0) {
            this.slowTimer--;
            this.speed = this.baseSpeed * 0.5; // 50% Verlangsamung
            if (this.slowTimer <= 0) this.speed = this.baseSpeed;
        }

        let currentPath = tdMaps[currentMapIndex].path;
        let target = currentPath[this.pathIndex];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
            if (this.pathIndex >= currentPath.length) {
                tdState.lives--;
                updateTdUI();
                return false;
            }
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        return true;
    }

    draw() {
        tdCtx.fillStyle = this.color;
        tdCtx.beginPath();
        tdCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        tdCtx.fill();

        // Verlangsamungs-Effekt zeichnen
        if (this.slowTimer > 0) {
            tdCtx.strokeStyle = '#74b9ff';
            tdCtx.lineWidth = 3;
            tdCtx.beginPath();
            tdCtx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
            tdCtx.stroke();
        }

        // Lebensbalken
        tdCtx.fillStyle = 'rgba(0,0,0,0.5)';
        tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30, 4);
        tdCtx.fillStyle = '#2ecc71';
        tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30 * (this.hp / this.maxHp), 4);
    }
}

// 6. Turm Klasse
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.baseRange = towerTypes[type].range;
        this.baseDamage = towerTypes[type].damage + (tdState.skills.damage * 5);
        this.baseCooldown = towerTypes[type].cooldown;
        this.lvlDmg = 0;
        this.lvlSpeed = 0;
        this.lvlRange = 0;
        this.currentCooldown = 0;
        this.color = towerTypes[type].color;
        this.targetMode = "first";
    }

    get damage() { return this.baseDamage + (this.lvlDmg * 8); }
    get range() { return this.baseRange + (this.lvlRange * 15); }
    get cooldown() { return Math.max(8, this.baseCooldown - (this.lvlSpeed * 5)); }
    get sellValue() { 
        let baseCost = towerTypes[this.type].cost;
        let finalCost = Math.max(10, baseCost - (tdState.skills.cost * 5));
        let upgradesCost = (this.lvlDmg + this.lvlSpeed + this.lvlRange) * 30;
        return Math.round((finalCost + upgradesCost) * 0.7);
    }

    update() {
        if (this.currentCooldown > 0) this.currentCooldown--;
        if (this.currentCooldown <= 0 && enemies.length > 0) {
            let inRangeEnemies = enemies.filter(e => Math.hypot(e.x - this.x, e.y - this.y) <= this.range);
            if (inRangeEnemies.length > 0) {
                let target = null;
                
                // KI-Zielerfassungsmodi
                if (this.targetMode === "first" || this.targetMode === "last") {
                    let currentPath = tdMaps[currentMapIndex].path;
                    inRangeEnemies.forEach(e => {
                        let targetNode = currentPath[e.pathIndex];
                        e._progress = (e.pathIndex * 2000) - Math.hypot(targetNode.x - e.x, targetNode.y - e.y);
                    });
                    inRangeEnemies.sort((a, b) => b._progress - a._progress);
                    target = (this.targetMode === "first") ? inRangeEnemies[0] : inRangeEnemies[inRangeEnemies.length - 1];
                } else if (this.targetMode === "strongest") {
                    inRangeEnemies.sort((a, b) => b.hp - a.hp);
                    target = inRangeEnemies[0];
                } else if (this.targetMode === "weakest") {
                    inRangeEnemies.sort((a, b) => a.hp - b.hp);
                    target = inRangeEnemies[0];
                }

                if (target) {
                    projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type));
                    this.currentCooldown = this.cooldown;
                }
            }
        }
    }

    draw() {
        tdCtx.fillStyle = this.color;
        tdCtx.fillRect(this.x - 15, this.y - 15, 30, 30);
        
        // Markierung für selektierten Turm auf dem Feld
        if (tdState.selectedPlacedTower === this) {
            tdCtx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
            tdCtx.lineWidth = 2;
            tdCtx.beginPath();
            tdCtx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            tdCtx.stroke();
            tdCtx.strokeStyle = '#3498db';
            tdCtx.strokeRect(this.x - 18, this.y - 18, 36, 36);
        }
    }
}

// 7. Projektil Klasse (Inklusive Flächen- und Frosteffekt)
class Projectile {
    constructor(x, y, target, damage, towerType) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.towerType = towerType;
        this.speed = 8;
    }

    update() {
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            // Treffer-Logik basierend auf Turmtyp
            if (this.towerType === "bomb") {
                // AoE Schadenskreis (Splatter)
                enemies.forEach(e => {
                    if (Math.hypot(e.x - this.x, e.y - this.y) <= 60) {
                        e.hp -= this.damage;
                    }
                });
            } else if (this.towerType === "ice") {
                this.target.hp -= this.damage;
                this.target.slowTimer = 90; // 1.5 Sekunden verlangsamt bei 60 FPS
            } else {
                this.target.hp -= this.damage;
            }
            return false;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
            return true;
        }
    }

    draw() {
        tdCtx.fillStyle = this.towerType === "ice" ? "#74b9ff" : (this.towerType === "bomb" ? "#e74c3c" : "#f1c40f");
        tdCtx.beginPath();
        tdCtx.arc(this.x, this.y, this.towerType === "bomb" ? 6 : 4, 0, Math.PI * 2);
        tdCtx.fill();
    }
}

// 8. Wellen-Management & Spawning
function startWave() {
    if (enemiesToSpawn > 0 || enemies.length > 0) return;
    tdState.wave++;
    enemiesToSpawn = 5 + (tdState.wave * 2);
    updateTdUI();
}

function selectTower(type) {
    tdState.selectedTower = type;
    tdState.selectedPlacedTower = null;
    document.getElementById('td-tower-details').style.display = 'none';
}

// 9. Input & Event Listener (Bauen & Anklicken kombinierte Logik)
tdCanvas.addEventListener('click', (e) => {
    const rect = tdCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedTower = towers.find(t => Math.hypot(t.x - x, t.y - y) < 20);
    if (clickedTower) {
        tdState.selectedPlacedTower = clickedTower;
        tdState.selectedTower = null;
        updateTowerDetailsUI();
        return;
    }

    if (tdState.selectedTower) {
        let type = tdState.selectedTower;
        let baseCost = towerTypes[type].cost;
        let finalCost = Math.max(10, baseCost - (tdState.skills.cost * 5));

        if (tdState.gold >= finalCost) {
            towers.push(new Tower(x, y, type));
            tdState.gold -= finalCost;
            tdState.selectedTower = null;
            updateTdUI();
        }
    } else {
        tdState.selectedPlacedTower = null;
        document.getElementById('td-tower-details').style.display = 'none';
    }
});

// 10. Zeichen-Funktion für Pfade
function drawPath() {
    let mapData = tdMaps[currentMapIndex];
    tdCtx.fillStyle = mapData.color;
    tdCtx.fillRect(0, 0, tdCanvas.width, tdCanvas.height);

    tdCtx.strokeStyle = mapData.pathColor;
    tdCtx.lineWidth = 40;
    tdCtx.lineCap = 'round';
    tdCtx.lineJoin = 'round';
    tdCtx.beginPath();
    tdCtx.moveTo(mapData.path[0].x, mapData.path[0].y);
    for (let i = 1; i < mapData.path.length; i++) {
        tdCtx.lineTo(mapData.path[i].x, mapData.path[i].y);
    }
    tdCtx.stroke();
}

// 11. Main Game Loop
function gameLoop() {
    tdCtx.clearRect(0, 0, tdCanvas.width, tdCanvas.height);
    drawPath();

    // Spawning-Taktung
    if (enemiesToSpawn > 0) {
        spawnTimer--;
        if (spawnTimer <= 0) {
            let type = "normal";
            if (tdState.wave % 5 === 0 && enemiesToSpawn === 1) {
                type = "boss";
            } else if (tdState.wave > 5 && Math.random() < 0.25) {
                type = "tank";
            } else if (tdState.wave > 2 && Math.random() < 0.35) {
                type = "fast";
            }
            
            enemies.push(new Enemy(type, tdState.wave));
            enemiesToSpawn--;
            spawnTimer = type === "fast" ? 25 : 45;
        }
    }

    towers.forEach(t => { t.update(); t.draw(); });
    projectiles = projectiles.filter(p => p.update());
    projectiles.forEach(p => p.draw());

    enemies = enemies.filter(e => {
        let isAlive = e.update();
        if (isAlive && e.hp <= 0) {
            tdState.gold += e.reward;
            if (tdState.wave > 2 && Math.random() < 0.12) tdState.essence++;
            updateTdUI();
            if (tdState.selectedPlacedTower) updateTowerDetailsUI();
            return false;
        }
        if (isAlive) e.draw();
        return isAlive && e.hp > 0;
    });

    // Reichweiten-Vorschau beim Platzieren rendern
    if (tdState.selectedTower) {
        // Pseudo-Mouse-Tracking könnte hier optional ergänzt werden
    }

    if (tdState.lives <= 0) {
        tdCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        tdCtx.fillRect(0, 0, tdCanvas.width, tdCanvas.height);
        tdCtx.fillStyle = '#e74c3c';
        tdCtx.font = '48px Arial';
        tdCtx.textAlign = 'center';
        tdCtx.fillText('GAME OVER', tdCanvas.width / 2, tdCanvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

// 12. Map Wechsel
function selectMap(index) {
    if (enemiesToSpawn > 0 || enemies.length > 0) {
        if (typeof showToast === "function") showToast("Nicht während einer Welle wechseln!", "error");
        return;
    }
    currentMapIndex = index;
    towers = [];
    projectiles = [];
    tdState.selectedPlacedTower = null;
    document.getElementById('td-tower-details').style.display = 'none';
    for (let i = 0; i < tdMaps.length; i++) {
        document.getElementById(`map-btn-${i}`).dataset.btn = (i === index) ? "green" : "gray";
    }
}

// 13. Skill Tree Logik
function toggleSkillTree() {
    const st = document.getElementById('td-skill-tree');
    st.style.display = st.style.display === 'none' ? 'block' : 'none';
    updateSkillUI();
}

function updateSkillUI() {
    document.getElementById('st-essence').innerText = tdState.essence;
    document.getElementById('lvl-dmg').innerText = tdState.skills.damage;
    document.getElementById('lvl-cost').innerText = tdState.skills.cost;
    document.getElementById('lvl-hp').innerText = tdState.skills.hp;
    
    let basicCost = Math.max(10, towerTypes.basic.cost - (tdState.skills.cost * 5));
    let sniperCost = Math.max(10, towerTypes.sniper.cost - (tdState.skills.cost * 5));
    let bombCost = Math.max(10, towerTypes.bomb.cost - (tdState.skills.cost * 5));
    let iceCost = Math.max(10, towerTypes.ice.cost - (tdState.skills.cost * 5));
    
    document.getElementById('btn-buy-basic').innerText = `Basis-Turm (${basicCost}G)`;
    document.getElementById('btn-buy-sniper').innerText = `Sniper-Turm (${sniperCost}G)`;
    document.getElementById('btn-buy-bomb').innerText = `Splatter-Turm (${bombCost}G)`;
    document.getElementById('btn-buy-ice').innerText = `Frost-Turm (${iceCost}G)`;
}

function upgradeSkill(type) {
    const costs = { damage: 3, cost: 5, hp: 4 };
    let cost = costs[type];

    if (tdState.essence >= cost) {
        tdState.essence -= cost;
        tdState.skills[type]++;
        if (type === 'hp') tdState.lives += 5;
        updateTdUI();
        updateSkillUI();
    } else {
        if (typeof showToast === "function") showToast("Nicht genug Essenz!", "error");
    }
}

// 14. In-Game Upgrades & Verkauf
function updateTowerDetailsUI() {
    let t = tdState.selectedPlacedTower;
    if (!t) {
        document.getElementById('td-tower-details').style.display = 'none';
        return;
    }
    document.getElementById('td-tower-details').style.display = 'block';
    document.getElementById('tw-type').innerText = t.type.toUpperCase();
    document.getElementById('tw-dmg').innerText = t.damage;
    document.getElementById('tw-lvl-dmg').innerText = t.lvlDmg;
    document.getElementById('tw-speed').innerText = (60 / t.cooldown).toFixed(1);
    document.getElementById('tw-lvl-speed').innerText = t.lvlSpeed;
    document.getElementById('tw-range').innerText = t.range;
    document.getElementById('tw-lvl-range').innerText = t.lvlRange;
    document.getElementById('tw-target-mode').value = t.targetMode;
    document.getElementById('tw-sell-value').innerText = t.sellValue;
}

function upgradeTowerStat(stat) {
    let t = tdState.selectedPlacedTower;
    if (!t) return;
    let cost = 30;

    if (tdState.gold >= cost) {
        tdState.gold -= cost;
        if (stat === 'damage') t.lvlDmg++;
        if (stat === 'speed') t.lvlSpeed++;
        if (stat === 'range') t.lvlRange++;
        updateTdUI();
        updateTowerDetailsUI();
    } else {
        if (typeof showToast === "function") showToast("Nicht genug Gold!", "error");
    }
}

function changeTargetMode(mode) {
    let t = tdState.selectedPlacedTower;
    if (t) t.targetMode = mode;
}

function sellTower() {
    let t = tdState.selectedPlacedTower;
    if (!t) return;
    tdState.gold += t.sellValue;
    towers = towers.filter(tower => tower !== t);
    tdState.selectedPlacedTower = null;
    document.getElementById('td-tower-details').style.display = 'none';
    updateTdUI();
}

// Spiel-Start-Initialisierung
updateTdUI();
gameLoop();