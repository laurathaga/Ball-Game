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
