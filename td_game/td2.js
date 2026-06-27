const TD_STANDARD_CONFIG = {
    tdState: {
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
    },
    tdMaps: [
        {
            color: "#27ae60",
            pathColor: "#34495e",
            path: [{x: 0, y: 100}, {x: 200, y: 100}, {x: 200, y: 400}, {x: 600, y: 400}, {x: 600, y: 200}, {x: 800, y: 200}],
            width: 40
        },
        {
            color: "#e67e22",
            pathColor: "#d35400",
            path: [{x: 100, y: 0}, {x: 100, y: 500}, {x: 400, y: 500}, {x: 400, y: 100}, {x: 700, y: 100}, {x: 700, y: 600}],
            width: 40
        },
        {
            color: "#74b9ff",
            pathColor: "#0984e3",
            path: [{x: 0, y: 300}, {x: 300, y: 300}, {x: 300, y: 100}, {x: 500, y: 100}, {x: 500, y: 500}, {x: 800, y: 500}],
            width: 40
        }
    ],
    enemyTypes: {
        normal: { hpMult: 1.0,  speed: 1.5, reward: 10,  color: "#e74c3c", radius: 11 },
        fast:   { hpMult: 0.6,  speed: 2.8, reward: 12,  color: "#f1c40f", radius: 8  },
        tank:   { hpMult: 3.0,  speed: 0.8, reward: 25,  color: "#8e44ad", radius: 15 },
        boss:   { hpMult: 10.0, speed: 0.5, reward: 100, color: "#2c3e50", radius: 20 }
    },
    towerTypes: {
        basic:  { cost: 100, range: 120, damage: 15, cooldown: 30, color: "#3498db" },
        sniper: { cost: 200, range: 250, damage: 45, cooldown: 60, color: "#e67e22" },
        bomb:   { cost: 250, range: 100, damage: 40, cooldown: 50, color: "#e74c3c" },
        ice:    { cost: 150, range: 110, damage: 5,  cooldown: 25, color: "#2ecc71" }
    }
}

class TowerDefenseGame {
    constructor(tdState = null, towers = null) {
        this.tdCanvas = document.getElementById('tdCanvas');
        this.tdCtx = this.tdCanvas.getContext('2d');

        // 1. Spielfeld & Karten Konfigurationen
        this.tdMaps = [
            {
                color: "#27ae60",
                pathColor: "#34495e",
                path: [{x: 0, y: 100}, {x: 200, y: 100}, {x: 200, y: 400}, {x: 600, y: 400}, {x: 600, y: 200}, {x: 800, y: 200}],
                width: 40
            },
            {
                color: "#e67e22",
                pathColor: "#d35400",
                path: [{x: 100, y: 0}, {x: 100, y: 500}, {x: 400, y: 500}, {x: 400, y: 100}, {x: 700, y: 100}, {x: 700, y: 600}],
                width: 40
            },
            {
                color: "#74b9ff",
                pathColor: "#0984e3",
                path: [{x: 0, y: 300}, {x: 300, y: 300}, {x: 300, y: 100}, {x: 500, y: 100}, {x: 500, y: 500}, {x: 800, y: 500}],
                width: 40
            }
        ];
        this.currentMapIndex = 0;

        // 2. Turm & Gegner Basis-Konfigurationen
        this.towerTypes = {
            basic:  { cost: 100, range: 120, damage: 15, cooldown: 30, color: '#3498db' },
            sniper: { cost: 200, range: 250, damage: 45, cooldown: 60, color: '#e67e22' },
            bomb:   { cost: 250, range: 100, damage: 40, cooldown: 50, color: '#e74c3c' },
            ice:    { cost: 150, range: 110, damage: 5,  cooldown: 25, color: '#2ecc71' }
        };

        this.enemyTypes = {
            normal:    { hpMult: 1.0,  speed: 1.5, reward: 10,  color: '#e74c3c', radius: 11 },
            fast:      { hpMult: 0.6,  speed: 2.8, reward: 12,  color: '#f1c40f', radius: 8  },
            tank:      { hpMult: 3.0,  speed: 0.8, reward: 25,  color: '#8e44ad', radius: 15 },
            boss:      { hpMult: 10.0, speed: 0.5, reward: 100, color: '#2c3e50', radius: 20 }
        };

        // 3. Game State
        if (tdState == null) { 
            this.tdState = {
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
        }
        else {
            this.tdState = tdState;
        }

        this.enemies = [];
        if (towers == null) {
            this.towers = [];
        }
        else {
            this.towers = towers;
        }
        this.projectiles = [];
        this.enemiesToSpawn = 0;
        this.spawnTimer = 0;

        this.tdCanvas.addEventListener('click', (e) => {
            const rect = this.tdCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let clickedTower = this.towers.find(t => Math.hypot(t.x - x, t.y - y) < 20);
            if (clickedTower) {
                this.tdState.selectedPlacedTower = clickedTower;
                this.tdState.selectedTower = null;
                updateTowerDetailsUI();
                return;
            }

            if (this.tdState.selectedTower) {
                let type = this.tdState.selectedTower;
                let baseCost = this.towerTypes[type].cost;
                let finalCost = Math.max(10, baseCost - (this.tdState.skills.cost * 5));

                if (this.tdState.gold >= finalCost) {
                    this.towers.push(new Tower(x, y, type, this));
                    this.tdState.gold -= finalCost;
                    this.tdState.selectedTower = null;
                    updateTdUI();
                }
            } else {
                this.tdState.selectedPlacedTower = null;
                document.getElementById('td-tower-details').style.display = 'none';
            }
        });
    }

    // 4. UI Updates
    updateTdUI() {
        document.getElementById('td-gold').innerText = this.tdState.gold;
        document.getElementById('td-lives').innerText = this.tdState.lives;
        document.getElementById('td-wave').innerText = this.tdState.wave;
        document.getElementById('td-essence').innerText = this.tdState.essence;
    }

    // 8. Wellen-Management & Spawning
    startWave() {
        if (this.enemiesToSpawn > 0 || this.enemies.length > 0) return;
        this.tdState.wave++;
        this.enemiesToSpawn = 5 + (this.tdState.wave * 2);
        updateTdUI();
    }

    selectTower(type) {
        this.tdState.selectedTower = type;
        this.tdState.selectedPlacedTower = null;
        document.getElementById('td-tower-details').style.display = 'none';
    }

    // 10. Zeichen-Funktion für Pfade
    drawPath() {
        let mapData = this.tdMaps[this.currentMapIndex];
        this.tdCtx.fillStyle = mapData.color;
        this.tdCtx.fillRect(0, 0, this.tdCanvas.width, this.tdCanvas.height);

        this.tdCtx.strokeStyle = mapData.pathColor;
        this.tdCtx.lineWidth = mapData.width;
        this.tdCtx.lineCap = 'round';
        this.tdCtx.lineJoin = 'round';
        this.tdCtx.beginPath();
        this.tdCtx.moveTo(mapData.path[0].x, mapData.path[0].y);
        for (let i = 1; i < mapData.path.length; i++) {
            this.tdCtx.lineTo(mapData.path[i].x, mapData.path[i].y);
        }
        this.tdCtx.stroke();
    }

    // 12. Map Wechsel
    selectMap(index) {
        if (this.enemiesToSpawn > 0 || this.enemies.length > 0) {
            if (typeof showToast === "function") showToast("Nicht während einer Welle wechseln!", "error");
            return;
        }
        this.currentMapIndex = index;
        this.towers = [];
        this.projectiles = [];
        this.tdState.selectedPlacedTower = null;
        document.getElementById('td-tower-details').style.display = 'none';
        for (let i = 0; i < this.tdMaps.length; i++) {
            document.getElementById(`map-btn-${i}`).dataset.btn = (i === index) ? "green" : "gray";
        }
    }

    // 13. Skill Tree Logik
    toggleSkillTree() {
        const st = document.getElementById('td-skill-tree');
        st.style.display = st.style.display === 'none' ? 'block' : 'none';
        updateSkillUI();
    }

    updateSkillUI() {
        document.getElementById('st-essence').innerText = this.tdState.essence;
        document.getElementById('lvl-dmg').innerText = this.tdState.skills.damage;
        document.getElementById('lvl-cost').innerText = this.tdState.skills.cost;
        document.getElementById('lvl-hp').innerText = this.tdState.skills.hp;
        
        let basicCost = Math.max(10, this.towerTypes.basic.cost - (this.tdState.skills.cost * 5));
        let sniperCost = Math.max(10, this.towerTypes.sniper.cost - (this.tdState.skills.cost * 5));
        let bombCost = Math.max(10, this.towerTypes.bomb.cost - (this.tdState.skills.cost * 5));
        let iceCost = Math.max(10, this.towerTypes.ice.cost - (this.tdState.skills.cost * 5));
        
        document.getElementById('btn-buy-basic').innerText = `Basis-Turm (${basicCost}G)`;
        document.getElementById('btn-buy-sniper').innerText = `Sniper-Turm (${sniperCost}G)`;
        document.getElementById('btn-buy-bomb').innerText = `Splatter-Turm (${bombCost}G)`;
        document.getElementById('btn-buy-ice').innerText = `Frost-Turm (${iceCost}G)`;
    }

    upgradeSkill(type) {
        const costs = { damage: 3, cost: 5, hp: 4 };
        let cost = costs[type];

        if (this.tdState.essence >= cost) {
            this.tdState.essence -= cost;
            this.tdState.skills[type]++;
            if (type === 'hp') this.tdState.lives += 5;
            updateTdUI();
            updateSkillUI();
        } else {
            if (typeof showToast === "function") showToast("Nicht genug Essenz!", "error");
        }
    }

    // 14. In-Game Upgrades & Verkauf
    updateTowerDetailsUI() {
        let t = this.tdState.selectedPlacedTower;
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

    upgradeTowerStat(stat) {
        let t = this.tdState.selectedPlacedTower;
        if (!t) {
            console.log("this.tdState.selectedPlacedTower not found or is null")
            return;
        }
        let cost = 30;

        if (this.tdState.gold >= cost) {
            this.tdState.gold -= cost;
            if (stat === 'damage') t.lvlDmg++;
            if (stat === 'speed') t.lvlSpeed++;
            if (stat === 'range') t.lvlRange++;
            updateTdUI();
            updateTowerDetailsUI();
        } else {
            if (typeof showToast === "function") {
                showToast("Nicht genug Gold!", "error");
            }
        }
    }

    changeTargetMode(mode) {
        let t = this.tdState.selectedPlacedTower;
        if (t) t.targetMode = mode;
    }

    sellTower() {
        let t = this.tdState.selectedPlacedTower;
        if (!t) return;
        this.tdState.gold += t.sellValue;
        this.towers = this.towers.filter(tower => tower !== t);
        this.tdState.selectedPlacedTower = null;
        document.getElementById('td-tower-details').style.display = 'none';
        updateTdUI();
    }

    // 11. Main Game Loop
    gameLoop() {
        this.tdCtx.clearRect(0, 0, this.tdCanvas.width, this.tdCanvas.height);
        drawPath();

        // Spawning-Taktung
        if (this.enemiesToSpawn > 0) {
            this.spawnTimer--;
            if (this.spawnTimer <= 0) {
                let type = "normal";
                if (this.tdState.wave % 5 === 0 && this.enemiesToSpawn === 1) {
                    type = "boss";
                } else if (this.tdState.wave > 5 && Math.random() < 0.25) {
                    type = "tank";
                } else if (this.tdState.wave > 2 && Math.random() < 0.35) {
                    type = "fast";
                }
                
                this.enemies.push(new Enemy(type, this.tdState.wave, this));
                this.enemiesToSpawn--;
                this.spawnTimer = type === "fast" ? 25 : 45;
            }
        }

        this.towers.forEach(t => { t.update(); t.draw(); });
        this.projectiles = this.projectiles.filter(p => p.update());
        this.projectiles.forEach(p => p.draw());

        this.enemies = this.enemies.filter(e => {
            let isAlive = e.update();
            if (isAlive && e.hp <= 0) {
                this.tdState.gold += e.reward;
                if (this.tdState.wave > 2 && Math.random() < 0.12) this.tdState.essence++;
                updateTdUI();
                if (this.tdState.selectedPlacedTower) updateTowerDetailsUI();
                return false;
            }
            if (isAlive) e.draw();
            return isAlive && e.hp > 0;
        });

        // Reichweiten-Vorschau beim Platzieren rendern
        if (this.tdState.selectedTower) {
            // Pseudo-Mouse-Tracking könnte hier optional ergänzt werden
            this.tdCtx.fillStyle = this.towerTypes[this.tdState.selectedTower];
            this.tdCtx.fillRect(this.x - 15, this.y - 15, 30, 30);
            
            // Markierung für selektierten Turm auf dem Feld
            if (this.tdState.selectedPlacedTower === this) {
                this.tdCtx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
                this.tdCtx.lineWidth = 2;
                this.tdCtx.beginPath();
                this.tdCtx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
                this.tdCtx.stroke();
                this.tdCtx.strokeStyle = '#3498db';
                this.tdCtx.strokeRect(this.x - 18, this.y - 18, 36, 36);
            }
        }

        if (this.tdState.lives <= 0) {
            this.tdCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.tdCtx.fillRect(0, 0, this.tdCanvas.width, this.tdCanvas.height);
            this.tdCtx.fillStyle = '#e74c3c';
            this.tdCtx.font = '48px Arial';
            this.tdCtx.textAlign = 'center';
            this.tdCtx.fillText('GAME OVER', this.tdCanvas.width / 2, this.tdCanvas.height / 2);
            return;
        }

        requestAnimationFrame(gameLoop);
    }

    spawnEnemy(type) {
        this.enemies.push(new Enemy(type, this.tdState.wave, this));
    }
}

class TowerDefenseGameUI {
    constructor() {

    }

    updateUI() {
        document.getElementById('td-gold').innerText = this.tdState.gold;
        document.getElementById('td-lives').innerText = this.tdState.lives;
        document.getElementById('td-wave').innerText = this.tdState.wave;
        document.getElementById('td-essence').innerText = this.tdState.essence;
    }

    updateSkillUI() {
        document.getElementById('st-essence').innerText = this.tdState.essence;
        document.getElementById('lvl-dmg').innerText = this.tdState.skills.damage;
        document.getElementById('lvl-cost').innerText = this.tdState.skills.cost;
        document.getElementById('lvl-hp').innerText = this.tdState.skills.hp;
        
        let basicCost = Math.max(10, this.towerTypes.basic.cost - (this.tdState.skills.cost * 5));
        let sniperCost = Math.max(10, this.towerTypes.sniper.cost - (this.tdState.skills.cost * 5));
        let bombCost = Math.max(10, this.towerTypes.bomb.cost - (this.tdState.skills.cost * 5));
        let iceCost = Math.max(10, this.towerTypes.ice.cost - (this.tdState.skills.cost * 5));
        
        document.getElementById('btn-buy-basic').innerText = `Basis-Turm (${basicCost}G)`;
        document.getElementById('btn-buy-sniper').innerText = `Sniper-Turm (${sniperCost}G)`;
        document.getElementById('btn-buy-bomb').innerText = `Splatter-Turm (${bombCost}G)`;
        document.getElementById('btn-buy-ice').innerText = `Frost-Turm (${iceCost}G)`;
    }
}

class Enemy {
    constructor(type, wave, gameObj) {
        this.gameObj = gameObj;

        let config = this.gameObj.enemyTypes[type];
        let currentPath = this.gameObj.tdMaps[this.gameObj.currentMapIndex].path;
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

        let currentPath = this.gameObj.tdMaps[this.gameObj.currentMapIndex].path;
        let target = currentPath[this.pathIndex];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
            if (this.pathIndex >= currentPath.length) {
                this.gameObj.tdState.lives--;
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
        this.gameObj.tdCtx.fillStyle = this.color;
        this.gameObj.tdCtx.beginPath();
        this.gameObj.tdCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.gameObj.tdCtx.fill();

        // Verlangsamungs-Effekt zeichnen
        if (this.slowTimer > 0) {
            this.gameObj.tdCtx.strokeStyle = '#74b9ff';
            this.gameObj.tdCtx.lineWidth = 3;
            this.gameObj.tdCtx.beginPath();
            this.gameObj.tdCtx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
            this.gameObj.tdCtx.stroke();
        }

        // Lebensbalken
        this.gameObj.tdCtx.fillStyle = 'rgba(0,0,0,0.5)';
        this.gameObj.tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30, 4);
        this.gameObj.tdCtx.fillStyle = '#2ecc71';
        this.gameObj.tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30 * (this.hp / this.maxHp), 4);
    }
}

// 6. Turm Klasse
class Tower {
    constructor(x, y, type, gameObj) {
        this.gameObj = gameObj;

        this.x = x;
        this.y = y;
        this.type = type;
        this.baseRange = this.gameObj.towerTypes[type].range;
        this.baseDamage = this.gameObj.towerTypes[type].damage + (this.gameObj.tdState.skills.damage * 5);
        this.baseCooldown = this.gameObj.towerTypes[type].cooldown;
        this.lvlDmg = 0;
        this.lvlSpeed = 0;
        this.lvlRange = 0;
        this.currentCooldown = 0;
        this.color = this.gameObj.towerTypes[type].color;
        this.targetMode = "first";
    }

    get damage() { return this.baseDamage + (this.lvlDmg * 8); }
    get range() { return this.baseRange + (this.lvlRange * 15); }
    get cooldown() { return Math.max(8, this.baseCooldown - (this.lvlSpeed * 5)); }
    get sellValue() { 
        let baseCost = this.gameObj.towerTypes[this.type].cost;
        let finalCost = Math.max(10, baseCost - (this.gameObj.tdState.skills.cost * 5));
        let upgradesCost = (this.lvlDmg + this.lvlSpeed + this.lvlRange) * 30;
        return Math.round((finalCost + upgradesCost) * 0.7);
    }

    update() {
        if (this.currentCooldown > 0) this.currentCooldown--;
        if (this.currentCooldown <= 0 && this.gameObj.enemies.length > 0) {
            let inRangeEnemies = this.gameObj.enemies.filter(e => Math.hypot(e.x - this.x, e.y - this.y) <= this.range);
            if (inRangeEnemies.length > 0) {
                let target = null;
                
                // KI-Zielerfassungsmodi
                if (this.targetMode === "first" || this.targetMode === "last") {
                    let currentPath = this.gameObj.tdMaps[this.gameObj.currentMapIndex].path;
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
                    this.gameObj.projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type, this.gameObj));
                    this.currentCooldown = this.cooldown;
                }
            }
        }
    }

    draw() {
        this.gameObj.tdCtx.fillStyle = this.color;
        this.gameObj.tdCtx.fillRect(this.x - 15, this.y - 15, 30, 30);
        
        // Markierung für selektierten Turm auf dem Feld
        if (this.gameObj.tdState.selectedPlacedTower === this) {
            this.gameObj.tdCtx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
            this.gameObj.tdCtx.lineWidth = 2;
            this.gameObj.tdCtx.beginPath();
            this.gameObj.tdCtx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            this.gameObj.tdCtx.stroke();
            this.gameObj.tdCtx.strokeStyle = '#3498db';
            this.gameObj.tdCtx.strokeRect(this.x - 18, this.y - 18, 36, 36);
        }
    }
}

// 7. Projektil Klasse (Inklusive Flächen- und Frosteffekt)
class Projectile {
    constructor(x, y, target, damage, towerType, gameObj) {
        this.gameObj = gameObj;

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
                this.gameObj.enemies.forEach(e => {
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
        this.gameObj.tdCtx.fillStyle = this.towerType === "ice" ? "#74b9ff" : (this.towerType === "bomb" ? "#e74c3c" : "#f1c40f");
        this.gameObj.tdCtx.beginPath();
        this.gameObj.tdCtx.arc(this.x, this.y, this.towerType === "bomb" ? 6 : 4, 0, Math.PI * 2);
        this.gameObj.tdCtx.fill();
    }
}



const TDGAME = new TowerDefenseGame;
TDGAME.updateTdUI()
TDGAME.gameLoop()



function drawPath() {
    TDGAME.drawPath()
}

// 11. Main Game Loop
function gameLoop() {
    TDGAME.gameLoop()
}

// 12. Map Wechsel
function selectMap(index) {
    TDGAME.selectMap(index);
}

// 13. Skill Tree Logik
function toggleSkillTree() {
    TDGAME.toggleSkillTree()
}

function updateSkillUI() {
    TDGAME.updateSkillUI()
}

function upgradeSkill(type) {
    TDGAME.upgradeSkill(type)
}

// 14. In-Game Upgrades & Verkauf
function updateTowerDetailsUI() {
    TDGAME.updateTowerDetailsUI()
}

function upgradeTowerStat(stat) {
    TDGAME.upgradeTowerStat(stat)
}

function changeTargetMode(mode) {
    TDGAME.changeTargetMode(mode)
}

function sellTower() {
    TDGAME.sellTower()
}

function startWave() {
    TDGAME.startWave()
}

function selectTower(type) {
    TDGAME.selectTower(type)
}

function updateTdUI() {
    TDGAME.updateTdUI()
}