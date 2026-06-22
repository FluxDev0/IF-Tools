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