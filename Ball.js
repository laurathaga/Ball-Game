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
