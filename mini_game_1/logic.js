let coins = JSON.parse(sessionStorage.getItem("coins"))

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
    // Falls target ein String (Selector) ist, suchen wir das Element.
    // Falls es schon ein Objekt ist, nehmen wir es direkt.
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    // Sicherheits-Check: Existiert das Element und ist es ein SVG-Pfad?
    if (!element || element.tagName.toLowerCase() !== 'path') {
        console.warn("getFieldCoordinates: Kein gültiges <path>-Element gefunden.", target);
        return [];
    }

    // Pfad-Daten standardisieren (benötigt das path-data-polyfill)
    const pfadDaten = element.getPathData({ normalize: true });
    const koordinaten = [];

    // Durch alle Segmente loopen und X/Y-Werte extrahieren
    pfadDaten.forEach(segment => {
        if (segment.values && segment.values.length >= 2) {
            for (let i = 0; i < segment.values.length; i += 2) {
                koordinaten.push({
                    x: segment.values[i],
                    y: segment.values[i + 1]
                });
            }
        }
    });

    return koordinaten;
}