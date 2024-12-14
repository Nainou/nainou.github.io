const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width = 1280;
const h = canvas.height = 720;
const offsetX = w / 2;
const offsetY = h / 2;

class Dot {
    constructor(x, y, depth = 0) {
        this.size = 10;
        this.depth = depth;
        this.position = { x, y };
        this.drawposition = { x: x + offsetX, y: y + offsetY };
        this.fov = 200;
        this.visible = true;
    }

    draw() {
        this.drawposition = {
            x: this.position.x * (1 / (this.depth / this.fov + 1)) + offsetX,
            y: this.position.y * (1 / (this.depth / this.fov + 1)) + offsetY
        };
        ctx.beginPath();
        ctx.arc(this.drawposition.x, this.drawposition.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    move(state, speed) {
        if (state === 1) {
            this.rotateX(speed);
        }
        if (state === 2) {
            this.rotateY(speed);
        }
        if (state === 3) {
            this.rotateZ(speed);
        }
    }

    rotateX(speed) {
        const newpositionX = Math.cos(speed) * this.position.x - Math.sin(speed) * this.depth;
        const newpositionY = this.position.y;
        const newdepth = Math.sin(speed) * this.position.x + Math.cos(speed) * this.depth;
        this.position.x = newpositionX;
        this.position.y = newpositionY;
        this.depth = newdepth;
        this.visible = this.depth < 0 ? true : false;
    }

    rotateY(speed) {
        const newpositionX = this.position.x;
        const newpositionY = Math.cos(speed) * this.position.y - Math.sin(speed) * this.depth;
        const newdepth = Math.sin(speed) * this.position.y + Math.cos(speed) * this.depth;
        this.position.x = newpositionX;
        this.position.y = newpositionY;
        this.depth = newdepth;
        this.visible = this.depth < 0 ? true : false;
    }

    rotateZ(speed) {
        const newpositionX = Math.cos(speed) * this.position.x - Math.sin(speed) * this.position.y;
        const newpositionY = Math.sin(speed) * this.position.x + Math.cos(speed) * this.position.y;
        this.position.x = newpositionX;
        this.position.y = newpositionY;
    }

    changeFov(fov) {
        this.fov += fov;
    }
}

class Cube {
    constructor(x, y, size) {
        this.square1 = new Square(x, y, size, -50);
        this.square2 = new Square(x, y, size, 50);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.square1.dot1.drawposition.x, this.square1.dot1.drawposition.y);
        ctx.lineTo(this.square2.dot1.drawposition.x, this.square2.dot1.drawposition.y);
        ctx.moveTo(this.square1.dot2.drawposition.x, this.square1.dot2.drawposition.y);
        ctx.lineTo(this.square2.dot2.drawposition.x, this.square2.dot2.drawposition.y);
        ctx.moveTo(this.square1.dot3.drawposition.x, this.square1.dot3.drawposition.y);
        ctx.lineTo(this.square2.dot3.drawposition.x, this.square2.dot3.drawposition.y);
        ctx.moveTo(this.square1.dot4.drawposition.x, this.square1.dot4.drawposition.y);
        ctx.lineTo(this.square2.dot4.drawposition.x, this.square2.dot4.drawposition.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.stroke();
        this.square1.draw();
        this.square2.draw();
    }

    move(state, speed) {
        this.square1.move(state, speed);
        this.square2.move(state, speed);
    }

    changeFov(fov) {
        this.square1.changeFov(fov);
        this.square2.changeFov(fov);
    }
}

class Square {
    constructor(x, y, size, depth = 0) {
        this.dot1 = new Dot(x, y, depth);
        this.dot2 = new Dot(x + size, y, depth);
        this.dot3 = new Dot(x + size, y + size, depth);
        this.dot4 = new Dot(x, y + size, depth);
    }

    draw() {
        this.dot1.draw();
        this.dot2.draw();
        this.dot3.draw();
        this.dot4.draw();
        ctx.beginPath();
        ctx.moveTo(this.dot1.drawposition.x, this.dot1.drawposition.y);
        ctx.lineTo(this.dot2.drawposition.x, this.dot2.drawposition.y);
        ctx.lineTo(this.dot3.drawposition.x, this.dot3.drawposition.y);
        ctx.lineTo(this.dot4.drawposition.x, this.dot4.drawposition.y);
        ctx.closePath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    move(state, speed) {
        this.dot1.move(state, speed);
        this.dot2.move(state, speed);
        this.dot3.move(state, speed);
        this.dot4.move(state, speed);
    }

    changeFov(fov) {
        this.dot1.changeFov(fov);
        this.dot2.changeFov(fov);
        this.dot3.changeFov(fov);
        this.dot4.changeFov(fov);
    }
}

const cube1 = new Cube(-50, -50, 100);
const rotationspeed = 0.03;

function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
}

function drawFrame() {
    clearCanvas();

    cube1.draw();

    requestAnimationFrame(drawFrame);
}

drawFrame();

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        cube1.move(2, -rotationspeed);
    } else if (event.key === 's') {
        cube1.move(2, rotationspeed);
    } else if (event.key === 'd') {
        cube1.move(1, rotationspeed);
    } else if (event.key === 'a') {
        cube1.move(1, -rotationspeed);
    } else if (event.key === 'q') {
        cube1.move(3, rotationspeed);
    } else if (event.key === 'e') {
        cube1.move(3, -rotationspeed);
    } else if (event.key === 'ArrowUp') {
        cube1.changeFov(3);
    } else if (event.key === 'ArrowDown') {
        cube1.changeFov(-3);
    }
});

document.addEventListener('mousemove', (event) => {
  if (event.buttons === 1) {
    cube1.move(1, event.movementX * 0.01);
    cube1.move(2, event.movementY * 0.01);
  } else if (event.buttons === 2) {
    cube1.move(3, event.movementX * 0.01);
    cube1.move(3, event.movementY * 0.01);
  }
});

document.addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    cube1.changeFov(-4);
  } else if (event.deltaY < 0) {
    cube1.changeFov(4);
  }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
