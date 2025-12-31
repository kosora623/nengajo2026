let tapCount = 0;
let isPartyMode = false;
const TRIGGER_COUNT = 7;

let tapEffects = [];
let partyItems = [];
let horseshoeImg, rakugakiImg;

function preload() {
    try {
        horseshoeImg = loadImage('images/horseshoe.png');
        rakugakiImg = loadImage('images/rakugaki_horse.png');
    } catch (e) { console.warn("Image Load Failed"); }
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    canvas.elt.getContext('2d', { willReadFrequently: true });
    
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    
    for (let i = 0; i < 50; i++) {
        partyItems.push(new PartyItem());
    }
}

function draw() {
    clear();

    if (!isPartyMode) {
        for (let i = tapEffects.length - 1; i >= 0; i--) {
            tapEffects[i].update();
            tapEffects[i].display();
            if (tapEffects[i].isDead()) tapEffects.splice(i, 1);
        }
    } else {
        for (let item of partyItems) {
            item.update();
            item.display();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (isPartyMode) return;

    let card = document.getElementById('postcard-element').getBoundingClientRect();

    if (mouseX > card.left && mouseX < card.right && 
        mouseY > card.top && mouseY < card.bottom) {
        
        tapCount++;
        tapEffects.push(new TapEffect(mouseX, mouseY));

        if (tapCount === TRIGGER_COUNT) {
            startTransition();
        }
    }
}

function startTransition() {
    const bigHorse = document.querySelector('.big-horse');
    bigHorse.classList.add('is-running');

    setTimeout(() => {
        isPartyMode = true;
        document.body.classList.add('party-mode');
        bigHorse.classList.remove('is-running');
        bigHorse.style.opacity = 0;
    }, 3500);
}

class TapEffect {
    constructor(x, y) {
        this.x = x; this.y = y; this.alpha = 255; this.scale = 0.3; this.rot = random(TWO_PI);
    }
    update() { this.alpha -= 5; this.scale += 0.06; this.rot += 0.04; }
    display() {
        push(); translate(this.x, this.y); rotate(this.rot);
        drawingContext.globalAlpha = this.alpha / 255;
        if (horseshoeImg) image(horseshoeImg, 0, 0, 150 * this.scale, 150 * this.scale);
        else { fill(230, 180, 34); textSize(80 * this.scale); text("🐎", 0,0); }
        drawingContext.globalAlpha = 1.0;
        pop();
    }
    isDead() { return this.alpha <= 0; }
}

class PartyItem {
    constructor() { this.reset(); this.y = random(height); }
    reset() {
        this.x = random(width); this.y = -100;
        this.s = random(30, 80);
        this.vx = random(-8, 8);
        this.vy = random(4, 10);
        this.rotSpd = random(-0.15, 0.15);
        this.rot = random(TWO_PI);
        this.type = random(['emoji', 'kanji']); 
        this.color = color(random(255), random(255), random(255));
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.rot += this.rotSpd;
        if (this.y > height + 150 || this.x < -150 || this.x > width + 150) this.reset();
    }
    display() {
        push(); translate(this.x, this.y); rotate(this.rot);
        noStroke();
        if (this.type === 'kanji') {
            fill(this.color); textSize(this.s);
            text("午", 0, 0);
        } else {
            textSize(this.s); text("🐴", 0, 0);
        }
        pop();
    }
}