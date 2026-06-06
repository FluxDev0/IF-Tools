class Cable {
    /**
     * Verbindet zwei HTML-Elemente mit einem Kabel.
     * @param {string} id1 - Die ID des ersten Elements
     * @param {string} id2 - Die ID des zweiten Elements
     * @param {string} farbe - (Optional) Eigene Farbe für dieses Kabel
     */
    constructor(id1, id2) {
        this.el1 = document.getElementById(id1);
        this.el2 = document.getElementById(id2);
        this.svg = document.getElementById('cable-layer');

        if (!this.el1 || !this.el2 || !this.svg) {
            console.error(`Kabel-Fehler: Konnte ${id1} oder ${id2} nicht finden!`);
            return;
        }

        // Das SVG-Pfad-Element (Das eigentliche Kabel) erstellen
        this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.path.classList.add("cable");
        const color = window.getComputedStyle(this.el1).getPropertyValue('--logic-main-color').trim();
        this.path.style.setProperty("--logic-main-color", color);
        
        this.svg.appendChild(this.path);

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.update();
                }
            }
        });

        if (this.in1) {
            if (this.in1.classList.contains("input")) observer.observe(this.in1, { attributes: true });
        }

        if (this.in2) {
            if (this.in2.classList.contains("input")) observer.observe(this.in2, { attributes: true });
        }

        window.addEventListener('resize', () => this.update());

        window.addEventListener('scroll', () => this.update(), true);

        this.path.addEventListener('contextmenu', (e) => {
            // 1. Verhindert, dass sich das normale Browser-Menü öffnet
            e.preventDefault(); 
            
            // 2. Ruft die entfernen-Methode auf, die wir schon gebaut haben
            this.remove();
            
            console.log(`Kabel zwischen ${id1} und ${id2} wurde gelöscht.`);
        });

        this.update();
    }

    update() {
        if (!this.el1 || !this.el2) return;

        const color = window.getComputedStyle(this.el1).getPropertyValue('--logic-main-color').trim();
        this.path.style.setProperty("--logic-main-color", color);

        if (this.el1.classList.contains("output")) {
            if (this.el1.classList.contains("on")) {
                this.el2.classList.add("on");
            }
            if (!this.el1.classList.contains("on")) {
                this.el2.classList.remove("on");
            }
        }

        if (this.el2.classList.contains("output")) {
            if (this.el2.classList.contains("on")) {
                this.el1.classList.add("on");
            }
            if (!this.el2.classList.contains("on")) {
                this.el1.classList.remove("on");
            }
        }

        // Positionen der beiden Elemente auf dem Bildschirm holen
        const rect1 = this.el1.getBoundingClientRect();
        const rect2 = this.el2.getBoundingClientRect();

        // Startpunkt (Mitte von Element 1)
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;

        // Endpunkt (Mitte von Element 2)
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        // Die "Schwerkraft" für das Kabel (wie weit es nach unten durchhängt)
        const abstandX = Math.abs(x1 - x2);
        const durchhang = Math.min(abstandX * 0.2, 100); // Hängt maximal 100px durch

        // Eine Bezier-Kurve (C) erzeugt den organischen Kabel-Look
        const d = `M ${x1} ${y1} C ${x1} ${y1 + durchhang}, ${x2} ${y2 + durchhang}, ${x2} ${y2}`;
        
        // Den Pfad anwenden
        this.path.setAttribute("d", d);
    }

    remove() {
        if (this.path && this.path.parentNode) {
            this.path.parentNode.removeChild(this.path);
        }
    }

    getElement1() {
        return this.el1;
    }

    getElement2() {
        return this.el2;
    }
}