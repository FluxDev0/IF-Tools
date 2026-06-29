let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function showToast(text, typ = 'info') {
    if (sessionStorage.getItem("toasts") == "false" && typ == "chat") return;
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', 'out', typ);
    toast.innerText = text;
    setTimeout(() => {
        toast.classList.remove('out');
    }, 1);
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("out");
        
        setTimeout(() => {
            toast.remove();
        }, 500);
        
    }, 4000);
}