const TD_STANDARD_CONFIG = {
    tdState: {
        gold: 150,
        lives: 5,
        wave: 0,
        essence: 0,
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
            name: "Wiese",
            color: "#27ae60",
            pathColor: "#48617a",
            path: [{x: 0, y: 100}, {x: 200, y: 100}, {x: 200, y: 400}, {x: 600, y: 400}, {x: 600, y: 200}, {x: 800, y: 200}],
            width: 40
        },
        {
            name: "Wüste",
            color: "#e67e22",
            pathColor: "#d35400",
            path: [{x: 100, y: 0}, {x: 100, y: 500}, {x: 400, y: 500}, {x: 400, y: 100}, {x: 700, y: 100}, {x: 700, y: 600}],
            width: 40
        },
        {
            name: "Antarktis",
            color: "#74b9ff",
            pathColor: "#0984e3",
            path: [{x: 0, y: 300}, {x: 300, y: 300}, {x: 300, y: 100}, {x: 500, y: 100}, {x: 500, y: 500}, {x: 800, y: 500}],
            width: 40
        }
    ],
    enemyTypes: {
        normal1: { hp: 30,   speed: 1.5, reward: 10,  color: "#e74c3c", radius: 11 },
        normal2: { hp: 50,   speed: 1.8, reward: 10,  color: "#e96e1d", radius: 11 },
        fast1:   { hp: 18,   speed: 3,   reward: 10,  color: "#f1c40f", radius: 8  },
        fast2:   { hp: 25,   speed: 4,   reward: 10,  color: "#70dd18", radius: 8  },
        fast3:   { hp: 20,   speed: 6,   reward: 8,   color: "#0ebe75", radius: 8  },
        tank1:   { hp: 90,   speed: 0.8, reward: 20,  color: "#b450df", radius: 14 },
        tank2:   { hp: 200,  speed: 1,   reward: 20,  color: "#7625d1", radius: 14 },
        boss1:   { hp: 300,  speed: 1,   reward: 80,  color: "#0628e7", radius: 16 },
        boss2:   { hp: 1500, speed: 0.3, reward: 100, color: "#247ad0", radius: 20 }
    },
    towerTypes: {
        basic:       { name: "Basis-Turm",      cost: 100, range: 120, cooldown: 1.5, color: "#3498db", projectile: "normal" },
        sniper:      { name: "Sniper",          cost: 200, range: 220, cooldown: 0.5, color: "#e67e22", projectile: "sniper" },
        bomb:        { name: "Bombenwerfer",    cost: 250, range: 100, cooldown: 0.8, color: "#e74c3c", projectile: "bomb" },
        ice:         { name: "Eiswerfer",       cost: 150, range: 110, cooldown: 1.2, color: "#2ecc71", projectile: "ice" },
        fire:        { name: "Feuerwerfer",     cost: 150, range: 110, cooldown: 30,  color: "#bf280e", projectile: "fire" },
        machine_gun: { name: "Machinengewehr",  cost: 500, range: 200, cooldown: 60,  color: "#59251c", projectile: "sniper" }
    },
    projectileTypes: {
        normal: { color: "#f1c40f", damage: 15, speed: 8,  radius: 4, attributes: {} },
        sniper: { color: "#81807d", damage: 25, speed: 12, radius: 4, attributes: {} },
        bomb:   { color: "#e74c3c", damage: 15, speed: 6,  radius: 6, attributes: { explosion: { radius: 100, damage: 15 } } },
        ice:    { color: "#71b8ff", damage: 20, speed: 8,  radius: 4, attributes: { effects: [{ type: "slowness", duration: 90, factor: 0.5 }] } },
        fire:   { color: "#ee370a", damage: 1,  speed: 10, radius: 7, attributes: {} }
    },
    waves: {
        1: {
            ticks: 160,
            1: ["normal1"],
            40: ["normal1"],
            80: ["normal1"],
            120: ["normal1"],
            160: ["normal1"]
        },
        2: {
            ticks: 180,
            1: ["normal1"],
            30: ["normal1"],
            60: ["normal1"],
            90: ["normal1"],
            100: ["fast1"],
            120: ["normal1"],
            150: ["normal1"],
            180: ["normal1"],
        },
        3: {
            ticks: 210,
            1: ["normal1"],
            30: ["normal1"],
            60: ["normal1"],
            90: ["fast1"],
            120: ["fast1"],
            150: ["fast1", "normal1"],
            180: ["normal1"],
            210: ["normal1"]
        },
        4: {
            ticks: 230,
            1: ["tank1"],
            30: ["fast1"],
            60: ["normal1"],
            90: ["fast1"],
            120: ["normal1"],
            150: ["fast1"],
            200: ["tank1"],
            230: ["tank1"]
        },
        5: {
            ticks: 210,
            1: ["tank1"],
            30: ["normal1"],
            60: ["tank1"],
            110: ["boss1", "tank1"],
            120: ["normal1"],
            150: ["tank1"],
            210: ["tank1", "normal1"]
        },
        6: {
            ticks: 180,
            1: ["tank1"],
            30: ["normal1"],
            60: ["normal2"],
            90: ["normal1", "normal2"],
            120: ["normal2"],
            150: ["tank1"],
            180: ["normal1", "normal2"]
        },
        7: {
            ticks: 180,
            1: ["normal2"],
            40: ["fast1"],
            60: ["fast1", "fast2"],
            90: ["fast3", "fast2", "tank2"],
            120: ["normal2"],
            150: ["fast2"],
            180: ["fast3", "fast2"]
        },
        8: {
            ticks: 180,
            1: ["tank1", "normal2"],
            30: ["tank2"],
            60: ["normal2"],
            90: ["normal1", "tank2"],
            150: ["tank1"],
            180: ["tank2"],
            190: ["tank2"]
        },
        9: {
            ticks: 180,
            1: ["tank1"],
            30: ["normal1"],
            60: ["normal2"],
            90: ["normal1", "normal2"],
            120: ["normal2"],
            150: ["tank1"],
            180: ["normal1", "normal2"]
        },
        10: {
            ticks: 250,
            1: ["tank2", "normal2"],
            30: ["normal2"],
            60: ["normal2"],
            90: ["normal2"],
            120: ["normal2"],
            150: ["tank1", "tank2"],
            160: ["fast2", "fast3"],
            160: ["fast1", "fast3"],
            180: ["fast2", "boss1"],
            220: ["tank2", "boss1"],
            250: ["fast3", "normal1"]
        },
    }
}

class TowerDefenseGame {
    constructor(tdState = null, towers = null) {
        this.tdCanvas = document.getElementById('tdCanvas');
        this.tdCtx = this.tdCanvas.getContext('2d');
        this.config = TD_STANDARD_CONFIG
        this.tdMaps = this.config.tdMaps;
        this.currentMapIndex = 0;
        this.towerTypes = this.config.towerTypes;
        this.enemyTypes = this.config.enemyTypes;
        this.projectileTypes = this.config.projectileTypes;
        this.projectiles = [];
        this.enemiesToSpawn = 0;
        this.spawnTimer = 0;

        this.currentWave = null;
        this.waveType = null;

        this.mouse = { x: 0, y: 0 }

        // 3. Game State
        if (tdState == null) { 
            this.tdState = structuredClone(this.config.tdState);
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

        this.tdCanvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });

        this.tdCanvas.addEventListener('mousemove', (e) => {
            const rect = this.tdCanvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.ui = new TowerDefenseGameUI(this);
    }

    gameLoop() {
        this.tdCtx.clearRect(0, 0, this.tdCanvas.width, this.tdCanvas.height);
        drawPath();

        this.updateWave();

        this.towers.forEach(t => { t.update(); t.draw(); });
        this.projectiles = this.projectiles.filter(p => p.update());
        this.projectiles.forEach(p => p.draw());

        this.enemies = this.enemies.filter(e => {
            let isAlive = e.update();
            if (isAlive && e.hp <= 0) {
                this.tdState.gold += e.reward;
                if (this.tdState.wave > 2 && Math.random() < 0.12) {
                    this.tdState.essence++;
                    this.updateSkillUI()
                }
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
            this.tdCtx.fillStyle = this.towerTypes[this.tdState.selectedTower].color;
            this.tdCtx.fillRect(this.mouse.x - 15, this.mouse.y - 15, 30, 30);

            this.tdCtx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
            this.tdCtx.lineWidth = 2;
            this.tdCtx.beginPath();
            this.tdCtx.arc(this.mouse.x, this.mouse.y, this.towerTypes[this.tdState.selectedTower].range, 0, Math.PI * 2);
            this.tdCtx.stroke();
            this.tdCtx.strokeStyle = '#3498db';
            this.tdCtx.strokeRect(this.mouse.x - 18, this.mouse.y - 18, 36, 36);
            
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

    handleCanvasClick(e) {
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
            else {
                showToast("Nicht genug Gold", "error");
                this.tdState.selectedTower = null;
            }
        } else {
            this.tdState.selectedPlacedTower = null;
            this.updateTowerDetailsUI();
        }
    }

    restart() {
        this.towers = [];
        this.projectiles = [];
        this.enemiesToSpawn = 0;
        this.spawnTimer = 0;
        this.tdState = structuredClone(this.config.tdState);
        this.updateTdUI();
        this.updateTowerDetailsUI();
    }

    startWave() {
        if (this.waveType !== null) return;
        this.tdState.wave++;
        this.activeWave = true;
        if (this.config.waves[this.tdState.wave]) {
            this.waveType = "preset";
            this.currentWave = this.config.waves[this.tdState.wave];
            this.spawnTimer = 0;
        }
        else {
            this.waveType = "generated";
            this.enemiesToSpawn = 5 + (this.tdState.wave * 2);
        }
        updateTdUI();
    }

    updateWave() {
        if (this.waveType == null) return;

        if (this.waveType == "generated") {
            if (this.enemiesToSpawn > 0) {
                this.spawnTimer--;
                if (this.spawnTimer <= 0) {
                    let type = "normal1";
                    if (this.tdState.wave % 5 === 0 && this.enemiesToSpawn === 1) {
                        type = "boss1";
                    } else if (this.tdState.wave > 5 && Math.random() < 0.25) {
                        type = "tank1";
                    } else if (this.tdState.wave > 2 && Math.random() < 0.35) {
                        type = "fast1";
                    }
                    
                    this.enemies.push(new Enemy(type, this));
                    this.enemiesToSpawn--;
                    this.spawnTimer = type === "fast" ? 25 : 45;
                }
            }

            if (this.enemies.length == 0 && this.enemiesToSpawn <= 0) {
                this.waveType = null;
            }
        }

        if (this.waveType == "preset") {
            this.spawnTimer++;
            if (this.currentWave[this.spawnTimer]) {
                this.currentWave[this.spawnTimer].forEach((type) => {
                    this.enemies.push(new Enemy(type, this));
                });
            }

            if (this.currentWave.ticks <= this.spawnTimer && this.enemies.length == 0) {
                this.waveType = null;
                if (this.currentWave.reward) {
                    this.tdState.gold += this.currentWave.reward;
                    this.ui.updateUI();
                }
            }
        }
    }

    selectTower(type) {
        this.tdState.selectedTower = type;
        this.updateTowerDetailsUI();
    }

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

    selectMap(index) {
        if (this.enemiesToSpawn > 0 || this.enemies.length > 0) {
            if (typeof showToast === "function") showToast("Nicht während einer Welle wechseln!", "error");
            return;
        }
        this.currentMapIndex = index;
        this.updateTowerDetailsUI();
        for (let i = 0; i < this.tdMaps.length; i++) {
            document.getElementById(`map-btn-${i}`).dataset.btn = (i === index) ? "green" : "gray";
        }
        this.restart();
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

        this.towers.forEach((t) => {
            t.recalculateBaseDmg()
        })

        this.updateTowerDetailsUI()
    }

    updateTowerDetailsUI() {
        this.ui.updateTowerDetailsUI()
    }

    upgradeTowerStat(stat) {
        let t = this.tdState.selectedPlacedTower;
        if (!t) {
            console.log("this.tdState.selectedPlacedTower not found or is null")
            return;
        }
        let cost = 50;

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
        this.updateTowerDetailsUI();
        updateTdUI();
    }

    spawnEnemy(type) {
        this.enemies.push(new Enemy(type, this.tdState.wave, this));
    }

    getBaseDamage(towerType) {
        return this.projectileTypes[this.towerTypes[towerType].projectile].damage + (this.tdState.skills.damage * 5);
    }

    updateSkillUI() {
        this.ui.updateSkillUI();
    }

    updateTdUI() {
        this.ui.updateUI();
    }
}

class TowerDefenseGameUI {
    constructor(gameObj) {
        this.gameObj = gameObj;
        this.tdState = gameObj.tdState;

        this.tdCanvas = document.getElementById('tdCanvas');
        this.tdCtx = this.tdCanvas.getContext('2d');
    }

    updateUI() {
        this.tdState = this.gameObj.tdState;

        document.getElementById('td-gold').innerText = this.tdState.gold;
        document.getElementById('td-lives').innerText = this.tdState.lives;
        document.getElementById('td-wave').innerText = this.tdState.wave;
        document.getElementById('td-essence').innerText = this.tdState.essence;
    }

    updateSkillUI() {
        this.tdState = this.gameObj.tdState;

        document.getElementById('st-essence').innerText = this.tdState.essence;
        document.getElementById('lvl-dmg').innerText = this.tdState.skills.damage;
        document.getElementById('lvl-cost').innerText = this.tdState.skills.cost;
        document.getElementById('lvl-hp').innerText = this.tdState.skills.hp;

        Object.entries(this.gameObj.towerTypes).forEach(([key, value]) => {
            let cost = Math.max(0, value.cost - (this.tdState.skills.cost * 5));
            document.querySelector(`.controls #btn-buy-${key}`).innerText = `${value.name} (${cost}G)`;
        })
    }

    updateTowerDetailsUI() {
        this.tdState = this.gameObj.tdState;

        let t = this.tdState.selectedPlacedTower;
        if (!t) {
            document.getElementById('tw-type').innerText = "";
            document.getElementById('tw-dmg').innerText = 0;
            document.getElementById('tw-lvl-dmg').innerText = 0;
            document.getElementById('tw-speed').innerText = 0;
            document.getElementById('tw-lvl-speed').innerText = 0;
            document.getElementById('tw-range').innerText = 0;
            document.getElementById('tw-lvl-range').innerText = 0;
            document.getElementById('tw-target-mode').value = 0;
            document.getElementById('tw-sell-value').innerText = 0;
            return;
        }
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

    createBuyButtons() {
        const controlsElement = document.querySelector(`div#tower-defense.app .controls`);
        let buttonsHtml = "";

        Object.entries(this.gameObj.towerTypes).forEach(([key, value]) => {
            buttonsHtml += `<button class="btn-4" id="btn-buy-${key}" onclick="selectTower('${key}')">${value.name} (${value.cost}G)</button>`;
        })

        controlsElement.innerHTML += buttonsHtml;
    }

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
}

class Enemy {
    constructor(type, gameObj) {
        this.gameObj = gameObj;

        let config = this.gameObj.enemyTypes[type];
        let currentPath = this.gameObj.tdMaps[this.gameObj.currentMapIndex].path;
        this.type = type;
        this.x = currentPath[0].x;
        this.y = currentPath[0].y;
        this.hp = config.hp;
        this.maxHp = this.hp;
        this.baseSpeed = config.speed;
        this.speed = this.baseSpeed;
        this.reward = config.reward;
        this.color = config.color;
        this.radius = config.radius;
        this.pathIndex = 1;
        this.slowTimer = 0;
        this.slowFactor = 0;

        this.effects = [];
    }

    update() {
        this.effects = this.effects.filter((effect) => this.handleEffect(effect));

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

    handleEffect(effect) {
        effect.duration--;

        if (effect.duration <= 0) {
            this.speed = this.baseSpeed;
            return false;
        }

        if (effect.type == "slowness") {
            if (this.baseSpeed * effect.factor < this.speed) this.speed = this.baseSpeed * effect.factor;
        }

        return true;
    }

    draw() {
        this.gameObj.tdCtx.fillStyle = this.color;
        this.gameObj.tdCtx.beginPath();
        this.gameObj.tdCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.gameObj.tdCtx.fill();

        if (this.effects.some((effect) => effect.type == 'slowness')) {
            this.drawOutline('#74b9ff');
        }

        // Lebensbalken
        this.gameObj.tdCtx.fillStyle = 'rgba(0,0,0,0.5)';
        this.gameObj.tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30, 4);
        this.gameObj.tdCtx.fillStyle = '#2ecc71';
        this.gameObj.tdCtx.fillRect(this.x - 15, this.y - (this.radius + 8), 30 * (this.hp / this.maxHp), 4);
    }

    drawOutline(color) {
        this.gameObj.tdCtx.strokeStyle = color;
        this.gameObj.tdCtx.lineWidth = 3;
        this.gameObj.tdCtx.beginPath();
        this.gameObj.tdCtx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        this.gameObj.tdCtx.stroke();
    }
}

// 6. Turm Klasse
class Tower {
    constructor(x, y, type, gameObj) {
        this.gameObj = gameObj;

        this.x = x;
        this.y = y;
        this.type = type; 
        this.projectile = structuredClone(this.gameObj.projectileTypes[this.gameObj.towerTypes[type].projectile]);
        this.baseRange = this.gameObj.towerTypes[type].range;
        this.baseDamage = this.gameObj.getBaseDamage(type);
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
    get cooldown() { return Math.max(0, 60 / (this.baseCooldown + this.lvlSpeed)); }
    get sellValue() { 
        let baseCost = this.gameObj.towerTypes[this.type].cost;
        let finalCost = Math.max(10, baseCost - (this.gameObj.tdState.skills.cost * 5));
        let upgradesCost = (this.lvlDmg + this.lvlSpeed + this.lvlRange) * 50;
        return Math.round((finalCost + upgradesCost) * 0.8);
    }

    recalculateBaseDmg() {
        this.baseDamage = this.gameObj.getBaseDamage(this.type);
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
                    this.gameObj.projectiles.push(new Projectile(this.x, this.y, target, this.projectile, this.damage, this.gameObj));
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
    constructor(x, y, target, type, damage, gameObj) {
        this.gameObj = gameObj;

        this.x = x;
        this.y = y;
        this.target = target;
        this.targetX = this.target.x;
        this.targetY = this.target.y;
        this.type = type;
        this.damage = damage;
    }

    update() {
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist < this.type.speed) {
            this.hitTarget();
            return false;
        } else {
            this.x += (dx / dist) * this.type.speed;
            this.y += (dy / dist) * this.type.speed;
            return true;
        }
    }

    hitTarget() {
        if (this.type.attributes.explosion) {
            this.gameObj.enemies.forEach(e => {
                if (Math.hypot(e.x - this.x, e.y - this.y) <= this.type.attributes.explosion.radius) {
                    e.hp -= this.type.attributes.explosion.damage;
                }
            });
        }

        if (this.type.attributes.slowness) {
            this.target.slowTimer = this.type.attributes.slowness.duration;
            this.target.slowFactor = this.type.attributes.slowness.factor;
        }

        if (this.type.attributes.effects) {
            const clonedEffects = this.type.attributes.effects.map(effect => ({ ...effect }));
            this.target.effects = [...clonedEffects, ...this.target.effects];
        }

        this.target.hp -= this.damage;
    }

    draw() {
        this.gameObj.tdCtx.fillStyle = this.type.color;
        this.gameObj.tdCtx.beginPath();
        this.gameObj.tdCtx.arc(this.x, this.y, this.type.radius, 0, Math.PI * 2);
        this.gameObj.tdCtx.fill();
    }
}



const TDGAME = new TowerDefenseGame;
TDGAME.updateTdUI()
TDGAME.gameLoop()
TDGAME.ui.createBuyButtons();



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

window.addEventListener('keydown', (event) => {
    if (event.key === 'ä') {
        openTDtestMenu();
    }
});

function openTDtestMenu() {
    document.querySelector("#tower-defense #td-test-menu").classList.toggle("hidden")
}

function tdSetGold(gold) {
    TDGAME.tdState.gold = gold;
    TDGAME.updateTdUI();
}

function tdSetWave(wave) {
    console.log()
    TDGAME.tdState.wave = wave;
    TDGAME.updateTdUI();
}