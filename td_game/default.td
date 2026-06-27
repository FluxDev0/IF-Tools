{
    "tdState": {
        "gold": 200,
        "lives": 20,
        "wave": 0,
        "essence": 0,
        "isRunning": false,
        "selectedTower": null,
        "selectedPlacedTower": null, 
        "skills": {
            "damage": 0,
            "cost": 0,
            "hp": 0
        }
    },
    "tdMaps": [
        {
            "color": "#27ae60",
            "pathColor": "#34495e",
            "path": [{"x": 0, "y": 100}, {"x": 200, "y": 100}, {"x": 200, "y": 400}, {"x": 600, "y": 400}, {"x": 600, "y": 200}, {"x": 800, "y": 200}],
            "width": 40
        },
        {
            "color": "#e67e22",
            "pathColor": "#d35400",
            "path": [{"x": 100, "y": 0}, {"x": 100, "y": 500}, {"x": 400, "y": 500}, {"x": 400, "y": 100}, {"x": 700, "y": 100}, {"x": 700, "y": 600}],
            "width": 40
        },
        {
            "color": "#74b9ff",
            "pathColor": "#0984e3",
            "path": [{"x": 0, "y": 300}, {"x": 300, "y": 300}, {"x": 300, "y": 100}, {"x": 500, "y": 100}, {"x": 500, "y": 500}, {"x": 800, "y": 500}],
            "width": 40
        }
    ],
    "enemyTypes": {
        "normal": { "hpMult": 1.0,  "speed": 1.5, "reward": 10,  "color": "#e74c3c", "radius": 11 },
        "fast":   { "hpMult": 0.6,  "speed": 2.8, "reward": 12,  "color": "#f1c40f", "radius": 8  },
        "tank":   { "hpMult": 3.0,  "speed": 0.8, "reward": 25,  "color": "#8e44ad", "radius": 15 },
        "boss":   { "hpMult": 10.0, "speed": 0.5, "reward": 100, "color": "#2c3e50", "radius": 20 }
    },
    "towerTypes": {
        "basic":  { "cost": 100, "range": 120, "damage": 15, "cooldown": 30, "color": "#3498db" },
        "sniper": { "cost": 200, "range": 250, "damage": 45, "cooldown": 60, "color": "#e67e22" },
        "bomb":   { "cost": 250, "range": 100, "damage": 40, "cooldown": 50, "color": "#e74c3c" },
        "ice":    { "cost": 150, "range": 110, "damage": 5,  "cooldown": 25, "color": "#2ecc71" }
    }
}