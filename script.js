/** @type {HTMLCanvasElement} */
const cv = document.querySelector('#canvas');
const ctx = cv.getContext('2d');
const PADDLE_WIDTH = 150;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 20;

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
        this.dx = 5;
        this.dy = 5;
        this.accX = 0.02;
        this.accY = 0.02;
        this.throwBall = {
            left: null,
            right: null,
        };
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    resetBallPositions() {
        window.alert('You lost bitch');
        this.x = 100;
        this.y = 100;
    }

    update(paddle) {
        this.y += this.dy;
        this.x += this.dx;

        if (this.x + this.radius >= cv.width || this.x - this.radius <= 0) this.dx = -this.dx;

        if (this.y - this.radius <= 0) this.dy = -this.dy;
        
        if (this.y + this.radius >= cv.height) this.resetBallPositions();

        if ((this.x + this.radius >= mouse.x - paddle.posX && this.x + this.radius <= mouse.x + paddle.posX) 
            && (this.y + this.radius >= paddle.posY)) {
            this.dy = -this.dy;
        }

        if (this.x + this.radius < mouse.x - paddle.posX) { // then the ball is coming from the left side of the paddle
            this.throwBall.left = -1;
            this.throwBall.right = 1;
        } else if (this.x + this.radius > mouse.x + paddle.posX) { // then the ball is coming from the right side of the paddle
            this.throwBall.right = -1;
            this.throwBall.left = 1;
        }

        if ((this.x + this.radius > mouse.x - paddle.posX && this.x + this.radius < mouse.x)
            && this.y + this.radius >= paddle.posY){
            this.dx *= this.throwBall.left;
        }
        if ((this.x + this.radius > mouse.x && this.x + this.radius < mouse.x + paddle.posX)
            && this.y + this.radius >= paddle.posY){
            this.dx *= this.throwBall.right;
        }
        
        this.draw();
    }
};

class Paddle {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.posY = cv.height - PADDLE_DIST_FROM_EDGE;
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