function showToast(text, typ = 'info') {
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

showToast("Test 1");
showToast("Test 2", "error");
showToast("Test 1", "chat");