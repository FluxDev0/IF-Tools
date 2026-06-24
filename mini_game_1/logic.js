let coins = JSON.parse(sessionStorage.getItem("coins"))

const svgpaths = document.querySelectorAll('#maps #map1 path');

if (sessionStorage.getItem("coins") == null) {
    addCoins(100)
}

const coins_display = document.querySelector("#mini-game1 #coin-display")

coins_display.innerText = "Coins: " + coins;

function addCoins(_coins) {
    coins += _coins
    sessionStorage.setItem("coins", JSON.stringify(JSON.parse(sessionStorage.getItem("coins")) + _coins))
    coins_display.innerText = "Coins: " + coins;
}

function buy(cost) {
    if (cost > coins) {
        showToast("Not enough coins!", "error");
        return;
    }
    coins -= cost;
}

function getFieldCoordinates(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    // Sicherheits-Check: Existiert das Element und ist es ein SVG-Pfad?
    if (!element || element.tagName.toLowerCase() !== 'path') {
        console.warn("getFieldCoordinates: Kein gültiges <path>-Element gefunden.", target);
        return [];
    }

    const pfadDaten = element.getPathData({ normalize: true });
    const koordinaten = [];

    // Der "Stift"-Tracker für die aktuelle Position
    let currentX = 0;
    let currentY = 0;

    pfadDaten.forEach(segment => {
        const cmd = segment.type;
        const vals = segment.values || [];
        const isRelative = cmd === cmd.toLowerCase();
        const upperCmd = cmd.toUpperCase();

        // Standard-Linien und Startpunkte (M, m, L, l, T, t)
        if (upperCmd === 'M' || upperCmd === 'L' || upperCmd === 'T') {
            for (let i = 0; i < vals.length; i += 2) {
                if (isRelative) {
                    currentX += vals[i];
                    currentY += vals[i + 1];
                } else {
                    currentX = vals[i];
                    currentY = vals[i + 1];
                }
                koordinaten.push({ x: currentX, y: currentY });
            }
        } 
        // Horizontale Linien (H, h)
        else if (upperCmd === 'H') {
            for (let i = 0; i < vals.length; i++) {
                if (isRelative) currentX += vals[i];
                else currentX = vals[i];
                koordinaten.push({ x: currentX, y: currentY });
            }
        } 
        // Vertikale Linien (V, v)
        else if (upperCmd === 'V') {
            for (let i = 0; i < vals.length; i++) {
                if (isRelative) currentY += vals[i];
                else currentY = vals[i];
                koordinaten.push({ x: currentX, y: currentY });
            }
        } 
        // Kurven (C, c) - Hier ist jeweils das letzte Paar der Endpunkt
        else if (upperCmd === 'C') {
            for (let i = 0; i < vals.length; i += 6) {
                if (isRelative) {
                    currentX += vals[i + 4];
                    currentY += vals[i + 5];
                } else {
                    currentX = vals[i + 4];
                    currentY = vals[i + 5];
                }
                koordinaten.push({ x: currentX, y: currentY });
            }
        }
        // Falls deine Karte S, Q oder A Kurven nutzt, kann das analog erweitert werden.
    });

    return koordinaten;
}

function areConnectedAreas(area1, area2) {
    const coords1 = getFieldCoordinates(area1);
    const coords2 = getFieldCoordinates(area2);

    let same = 0;

    coords1.forEach((pos1) => {
        coords2.forEach((pos2) => {
            if (
                Math.round(pos1["x"] * 100) == Math.round(pos2["x"] * 100) &&
                Math.round(pos1["y"] * 100) == Math.round(pos2["y"] * 100)
                ) {
                same++;
            };
        });
    });

    return same > 1;
}

document.addEventListener('click', (event) => {
    if (activeApp == "mini-game1") {
        const clickedElement = event.target.closest('#mini-game1 #maps svg path');

        if (clickedElement) {
            console.log("clicked on area: ", clickedElement.id)
        }
    }
});