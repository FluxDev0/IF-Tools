extrafuncs = {
  "tree_generator": function() {table = document.getElementById('data-table');}
};

let activeApp = "";

function showApp(app) {
    activeApp = app;
    sessionStorage.setItem("activeApp", app);
    for (const child of document.querySelector("#main-content").children) {
        child.style.display = "none";
        if (child.id == app) {
            child.style.display = "flex";
        }
    }

    for (const child of document.querySelector("#apps").children) {
        child.dataset.btn = "gray";
        if (child.dataset.app == app) {
            child.dataset.btn = "green";
        }
    }
}

if (sessionStorage.getItem("activeApp")) {
    showApp(sessionStorage.getItem("activeApp"));
}
else {
    showApp("tree-generator");
}