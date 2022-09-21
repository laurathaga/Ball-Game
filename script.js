/** @type {HTMLCanvasElement} */
const cv = document.querySelector('#canvas');
const ctx = cv.getContext('2d');
const PADDLE_WIDTH = 150;
const PADDLE_THICKNESS = 10;

const mouse = {
    x: null,
    y: null,
};

cv.height = window.innerHeight;
cv.width = window.innerWidth;

window.addEventListener('resize', () => {
    cv.height = window.innerHeight;
    cv.width = window.innerWidth;
});

const updateMousePosition = (evnt) => {
    mouse.x = evnt.pageX;
};

cv.addEventListener('mousemove', updateMousePosition);
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = 1;
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

    resetPositions() {
        this.x = 100;
        this.y = 100;
    }

    update(paddle) {
        this.y += this.dy;
        this.x += this.dx;

        if (this.x + this.radius >= cv.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }

        if (this.y - this.radius <= 0) {
            this.dy = -this.dy;
        }
        
        if (this.y + this.radius >= cv.height) this.resetBallPositions();

        if ((this.x + this.radius >= mouse.x - paddle.posX && this.x + this.radius <= mouse.x + paddle.posX) 
            && this.y + this.radius >= paddle.posY) {
            this.dy = -this.dy
        }

        this.draw();
    }
};

class Paddle {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.posY = cv.height - this.height - 8;
        this.posX = this.width / 2;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            (mouse.x ?? cv.width / 2) - this.posX,
            this.posY,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
    }
}

const ball = new Ball(100, 100, 10, 'purple');
const paddle = new Paddle(PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

(function animate() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ball.update(paddle);
    paddle.update();
    requestAnimationFrame(animate);
});