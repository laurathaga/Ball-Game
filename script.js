let cv, ctx;

function Ball(clr, radius) {
    this.x = 100;
    this.y = 100;
    this.vx = 5;
    this.vy = 7;
    this.color = clr;
    this.radius = radius;

    this.update = () => {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    };

    this.draw = () => {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x + this.radius >= cv.width || this.x - this.radius <= 0) this.vx = -this.vx;
        if (this.y + this.radius >= cv.height || this.y - this.radius <= 0) this.vy = -this.vy;

        this.update();
    };

    this.animate = () => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        this.draw();
        requestAnimationFrame(this.animate);
    };
}

window.onload = () => {
    cv = document.querySelector('#canvas');
    ctx = cv.getContext('2d');
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;

    window.onresize = (event) => {
        cv.width = event.innerWidth;
        cv.height = event.innerHeight;
    };

    const ball = new Ball('white', 20);
    ball.animate();
};
