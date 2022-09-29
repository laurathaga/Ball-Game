/** @type {HTMLCanvasElement} */
const cv = document.querySelector('#canvas');
const ctx = cv.getContext('2d');
const PADDLE_WIDTH = 120;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 30;
const B_COLS = 24;
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 30;
const B_ROWS = 10;
const GAP = 3;
const brickGrid = new Array(B_COLS  * B_ROWS);

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
    mouse.y = evnt.pageY;
};

const getEachBrickIndex = (col, row) => col + B_COLS * row;

const fillGrid = (array) => {
    for(let i = 0; i < array.length; i++) {
        array[i] = true
    }
};

const drawBrick = () => {
    for(let rows = 0; rows < B_ROWS; rows++) {
        for(let col = 0; col < B_COLS; col++) {
            const eachBrickIndex = getEachBrickIndex(col, rows);
            if(brickGrid[eachBrickIndex]) {
                ctx.fillStyle = 'orangered';
                ctx.fillRect(BRICK_WIDTH * col, BRICK_HEIGHT * rows, BRICK_WIDTH - GAP, BRICK_HEIGHT - GAP);
            }
        }
    }
}

cv.addEventListener('mousemove', updateMousePosition);
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = 3;
        this.dy = 3;
        this.disFromPaddleCenter;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    resetBallPositions() {
        window.alert('You lost');
        this.x = 100;
        this.y = 100;
    }

    update(paddle) {
        this.y += this.dy;
        this.x += this.dx;
        const ballInsideCol = Math.floor(this.x / BRICK_WIDTH);
        const ballInsideRow = Math.floor(this.y / BRICK_HEIGHT);
        const ballInsideBrick = getEachBrickIndex(ballInsideCol, ballInsideRow);
        

        if (this.x + this.radius >= cv.width || this.x - this.radius <= 0) this.dx *= -1;

        if (this.y - this.radius <= 0) this.dy *= -1;
        
        if (this.y + this.radius >= cv.height) this.resetBallPositions();

        if ((ballInsideCol >= 0 && ballInsideCol < B_COLS) && (ballInsideRow >= 0 && ballInsideRow < B_ROWS)) {
            const prevBallPosX = this.x - this.dx;
            const prevBallPosY = this.y - this.dy;
            const prevBrickCol = Math.floor(prevBallPosX / BRICK_WIDTH);
            const prevBrickRow = Math.floor(prevBallPosY / BRICK_HEIGHT);

            if (brickGrid[ballInsideBrick]) {
                brickGrid[ballInsideBrick] = false;

                if (prevBallPosX != prevBrickCol) {
                    const adjBrickCol = getEachBrickIndex(prevBrickCol, ballInsideRow);
                    if(!brickGrid[adjBrickCol]) this.dx *= -1;
                }
                if (prevBallPosY != prevBrickRow) {
                    const adjBrickRow = getEachBrickIndex(ballInsideRow, prevBrickRow);
                    if (!brickGrid[adjBrickRow]) this.dy *= -1;
                }
            }
        }

        if (this.x >= paddle.posX &&
            this.x <= mouse.x + PADDLE_WIDTH / 2 && 
            this.y >= paddle.posY) {
            this.dy *= -1;
            const centreOfPaddleX = paddle.posX + PADDLE_WIDTH / 2;
            this.disFromPaddleCenter = this.x - centreOfPaddleX;
            this.dx = this.disFromPaddleCenter * 0.25;
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
        this.posX = cv.width / 2;
    }

    draw() {
        this.posX = mouse.x - (this.width / 2);
        ctx.fillStyle = this.color;
        ctx.fillRect((this.posX ?? cv.width / 2),this.posY, this.width, this.height);
    }

    update() {
        this.draw();
    }
}

window.onload = () => {
    const ball = new Ball(50, 50, 10, 'white');
    const paddle = new Paddle(PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
    fillGrid(brickGrid);

    (function animate() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        ball.update(paddle);
        paddle.update();
        drawBrick();
        requestAnimationFrame(animate);
    });
};
