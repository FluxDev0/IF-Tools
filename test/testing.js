document.querySelector("#testing.app input#html-input").addEventListener('input', (event) => {
    document.querySelector("#testing.app div#test-area").innerHTML = event.target.value;
});

const codeInput = document.getElementById('jsInput');
const ausgabeBox = document.getElementById('ausgabe');
const runBtn = document.getElementById('runBtn');

function codeAusfuehren() {
  const code = codeInput.value;
  
  // Falls das Feld leer ist, machen wir nichts
  if(!code.trim()) return;

  try {
    // HIER passiert die Magie: eval() führt den String als JS-Code aus
    const ergebnis = eval(code);
    // Ergebnis anzeigen
        ausgabeBox.className = 'erfolg';
        ausgabeBox.textContent = ergebnis !== undefined ? `> ${ergebnis}` : '> Code erfolgreich ausgeführt';
  } catch (fehler) {
    console.log(fehler);
  }
}

runBtn.addEventListener('click', codeAusfuehren);

codeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        codeAusfuehren();
    }
});