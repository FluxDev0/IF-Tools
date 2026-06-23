const not = (A) => !A;

const and = (A, B) => A && B;
const nand = (A, B) => !(A && B);

const or = (A, B) => A || B;
const nor = (A, B) => !(A || B);

const xor = (A, B) => ((A || B) && !(A && B));
const xnor = (A, B) => (!(A || B) || (A && B));


function createGateHTML(id, type, position = ["50%", "50%"]) {
    if (type == "NOT") {
        const notGate = `
            <div class="draggable-box gate-box" id="gate-${id}" style="top: ${position[1]}; left: ${position[0]};">
                <div class="gate-inputs">
                    <div class="pin input" id="${id}-in1" title="Eingang 1"></div>
                </div>
                
                <div class="gate-symbol">${type}</div>
                
                <div class="gate-outputs">
                    <div class="pin output" id="${id}-out" title="Ausgang"></div>
                </div>
            </div>
        `
        return notGate;
    }
    if (type == "TEST") {
        const test = `<div 
                    class="draggable-box gate-box switch" 
                    id="gate-${id}" 
                    style="top: ${position[1]}; left: ${position[0]};"
                >
                    <div class="switch"></div>
                    
                    <div class="gate-outputs">
                        <div class="pin output" id="${id}-out" title="Ausgang"></div>
                    </div>
                </div>`
        return test;
    }
    const gate = `
        <div class="draggable-box gate-box" id="gate-${id}" style="top: ${position[1]}; left: ${position[0]};">
            <div class="gate-inputs">
                <div class="pin input" id="${id}-in1" title="Eingang 1"></div>
                <div class="pin input" id="${id}-in2" title="Eingang 2"></div>
            </div>
            
            <div class="gate-symbol">${type}</div>
            
            <div class="gate-outputs">
                <div class="pin output" id="${id}-out" title="Ausgang"></div>
            </div>
        </div>
    `
    return gate;
}

class Draggable {
    /**
     * Macht ein Element per Drag & Drop verschiebbar.
     * @param {string} boxId - Die ID des gesamten Fensters
     */
    constructor(boxId) {
        this.box = document.getElementById(boxId);

        if (!this.box) return;

        // Startpositionen merken
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.boxStartX = 0;
        this.boxStartY = 0;

        // Event-Listener an die Anfasser-Leiste hängen
        this.box.addEventListener('mousedown', (e) => this.startDrag(e));
        
        // Die Bewegung und das Loslassen müssen ans Dokument gehängt werden, 
        // damit es auch klappt, wenn man die Maus sehr schnell bewegt!
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    }

    startDrag(e) {
        this.isDragging = true;
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        this.boxStartX = this.box.offsetLeft;
        this.boxStartY = this.box.offsetTop;

        this.box.style.zIndex = 100;
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault(); // Verhindert ungewolltes Markieren von Text

        const verschiebungX = e.clientX - this.startX;
        const verschiebungY = e.clientY - this.startY;

        // Neue Position der Box setzen
        this.box.style.left = `${this.boxStartX + verschiebungX}px`;
        this.box.style.top = `${this.boxStartY + verschiebungY}px`;

        window.dispatchEvent(new Event('resize'));
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.box.style.zIndex = 10;
        }
    }
}

class LogicGate {
    /**
     * @param {string} input_id1
     * @param {string} input_id2
     * @param {string} output_id
     */
    constructor(input_id1, input_id2, output_id) {
        this.in1 = document.querySelector(`#logicgates.app #${input_id1}`);
        this.in2 = document.querySelector(`#logicgates.app #${input_id2}`);
        this.out = document.querySelector(`#logicgates.app #${output_id}`);

        this.in1On = () => this.in1 ? this.in1.classList.contains("on") : false;
        this.in2On = () => this.in2 ? this.in2.classList.contains("on") : false;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.update();
                }
            }
        });

        this.update();

        if (this.in1) observer.observe(this.in1, { attributes: true });
        if (this.in2) observer.observe(this.in2, { attributes: true });
    }

    update() {
        
    }
}

class BitOutput extends LogicGate {
    /**
     * @param {string} input_id
     * @param {string} element_id
     */
    constructor(input_id, element_id) {
        super(input_id)
        this.element = document.getElementById(element_id);

        this.update();
    }

    update() {
        if (this.in1On()) {
            this.element.classList.add("on");
        }
        else {
            this.element.classList.remove("on");
        }
    }
}

class Test extends LogicGate {
    /**
     * @param {string} element_id
     * @param {string} output_id
     */
    constructor(element_id, output_id) {
        super("undefined", "undefined", output_id)
        this.element = document.getElementById(element_id);
        this.output = document.getElementById(output_id);

        this.update();

        this.element.addEventListener("click", (event) => {
            this.update();
            if (this.element.classList.contains('on')) {
                this.element.classList.remove('on');
                this.output.classList.remove('on');
            }
            else {
                this.element.classList.add('on');
                this.output.classList.add('on');
            }
        })
    }

    update() {
        if (this.in1On()) {
            this.element.classList.add("on");
        }
    }
}

class AndGate extends LogicGate {
    update() {
        if (this.in1On() && this.in2On()) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class NandGate extends LogicGate {
    update() {
        if (!(this.in1On() && this.in2On())) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class OrGate extends LogicGate {
    update() {
        if (this.in1On() || this.in2On()) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class NorGate extends LogicGate {
    update() {
        if (!(this.in1On() || this.in2On())) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class XorGate extends LogicGate {
    update() {
        if (xor(this.in1On(), this.in2On())) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class XnorGate extends LogicGate {
    update() {
        if (xnor(this.in1On(), this.in2On())) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

class NotGate extends LogicGate {
    update() {
        if (!this.in1On()) {
            this.out.classList.add("on");
        }
        else {
            this.out.classList.remove("on");
        }
    }
}

const gateContainer = document.querySelector("#logicgates.app")

function addToLogicGates(html) {
    gateContainer.insertAdjacentHTML('beforeend', html);
}

let gates = 0

function createGate(type, position = [(mouseX - 50) + 'px', (mouseY - 35) + 'px']) {
    const id = `g${gates}`;
    gates++;
    const html = createGateHTML(id, type, position);
    addToLogicGates(html);
    new Draggable(`gate-${id}`);
    if (type == "AND") {
        new AndGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    if (type == "OR") {
        new OrGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "NAND") {
        new NandGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "NOR") {
        new NorGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "XOR") {
        new XorGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "XNOR") {
        new XnorGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "NOT") {
        new NotGate(`${id}-in1`, `${id}-in2`, `${id}-out`);
    }
    else if (type == "TEST") {
        new Test(`gate-${id}`, `${id}-out`);
    }
}

new Draggable(`gate-test`);

let startPinId = null;

// Wir lauschen auf Klicks auf der GANZEN Seite
document.addEventListener('click', (event) => {
    if (activeApp == "logicgates") {
        customMenu.classList.add('hidden');
    }

    // Prüfen, ob das angeklickte Element überhaupt ein Pin ist
    const geklickterPin = event.target.closest('.pin');
    
    // Wenn kein Pin angeklickt wurde, machen wir nichts
    if (!geklickterPin) return;

    const aktuellePinId = geklickterPin.id;

    // FALL 1: Es wurde noch kein Start-Pin ausgewählt
    if (startPinId === null) {
        startPinId = aktuellePinId;
        geklickterPin.classList.add('selected'); // Visuelles Feedback geben
        console.log(`Kabel-Startpunkt gesetzt: ${startPinId}`);
    } 
    
    // FALL 2: Es gibt schon einen Start-Pin und wir haben JETZT den Ziel-Pin angeklickt
    else {
        // Verhindern, dass man einen Pin mit sich selbst verbindet
        if (startPinId === aktuellePinId) {
            geklickterPin.classList.remove('selected');
            startPinId = null;
            console.log("Verbindung abgebrochen (Gleicher Pin angeklickt)");
            return;
        }

        // Alten Start-Pin holen, um das Gelb wieder zu entfernen
        const startPinElement = document.getElementById(startPinId);
        if (startPinElement) {
            startPinElement.classList.remove('selected');
        }

        // 🔥 DIE MAGIC: Kabel erstellen!
        // Wir rufen deine modulare Cable-Klasse auf und übergeben Start und Ziel
        new Cable(startPinId, aktuellePinId, '#2ed573');
        
        console.log(`Kabel erfolgreich gespannt von ${startPinId} nach ${aktuellePinId}`);

        // Speicher zurücksetzen für das nächste Kabel
        startPinId = null;
    }
});

const customMenu = document.getElementById('custom-menu');

document.addEventListener('contextmenu', function(event) {
    if (activeApp == "logicgates") {
        event.preventDefault();

        const el = document.elementFromPoint(mouseX, mouseY);

        if (el.closest('.gate-box') !== null) {
            el.closest('.gate-box').remove();
        }
        else {
            customMenu.style.left = event.pageX + 'px';
            customMenu.style.top = event.pageY + 'px';
            
            customMenu.classList.remove('hidden');
        }
    }
});