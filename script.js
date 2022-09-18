/** @type {HTMLCanvasElement} */
const cv = document.querySelector('#canvas');
const ctx = cv.getContext('2d');
cv.height = window.innerHeight;
cv.width = window.innerWidth;

window.addEventListener('resize', () => {
    cv.height = window.innerHeight;
    cv.width = window.innerWidth;
});

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = 5;
        this.dy = 5;
        this.accX = 0.02;
        this.accY = 0.02;
        this.isFinished = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }  

    update(barConfig) {
        this.accX += this.dx;
        this.accY += this.accY;
        this.y += this.dy;
        this.x += this.dx;

        if (this.x + this.radius >= cv.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
            this.accX = -this.accX;
            this.isFinished = false;
        } 
        if (this.y + this.radius >= cv.height || this.y - this.radius <= 0) {
            this.isFinished = true;
            this.dy = -this.dy;
            this.accY = -this.accY;
        }
        if (this.y + this.radius >= barConfig.y && 
            (this.x + this.radius >= barConfig.posX && this.x + this.radius <= barConfig.posX + barConfig.width)) {
            this.dy = -this.dy
        }

        this.draw();
    }
};

class Bar {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 10;
        this.posX = this.x - (this.width * 0.5);
        this.dx = 3;
        this.dy = 1;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.rect(this.posX, this.y, this.width, this.height);
        ctx.fill();
    }

    update() {
        this.draw();
    }
}

const ball = new Ball(100, 100, 10, 'purple');
const bar = new Bar(cv.width / 2, cv.height - 20, 150);

window.addEventListener('keydown', evnt => {
    switch(evnt.code) {
        case 'ArrowLeft': bar.posX -= 30; break;
        case 'ArrowRight': bar.posX += 30; break;
        default: return;
    }
});

(function animate() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ball.update(bar);
    bar.update();
    requestAnimationFrame(animate);
});