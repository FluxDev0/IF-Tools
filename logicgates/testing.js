document.querySelector("#testing.app input#html-input").addEventListener('input', (event) => {
    document.querySelector("#testing.app div#test-area").innerHTML = event.target.value;
});

const codeInput = document.querySelector('#testing.app #jsInput');
const ausgabeBox = document.querySelector('#testing.app #consoleOutput');
const runBtn = document.querySelector('#testing.app #runBtn');

function codeAusfuehren() {
  const code = codeInput.value;
  
  // Falls das Feld leer ist, machen wir nichts
  if(!code.trim()) return;

  try {
    const ergebnis = eval(code);
    ausgabeBox.className = 'erfolg';
    ausgabeBox.textContent = ergebnis !== undefined ? `/> ${ergebnis}` : '/> Code erfolgreich ausgeführt';
  } catch (fehler) {
    ausgabeBox.textContent = fehler;
    console.log(fehler);
  }
}

runBtn.addEventListener('click', codeAusfuehren);

codeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    codeAusfuehren();
  }
});