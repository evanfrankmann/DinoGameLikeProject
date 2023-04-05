const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let startTime;
let elapsedTime = 0;

const dino = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 0.5,
    jumpForce: 15,
    grounded: true
};

function drawDino() {
    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x, dino.y - dino.height, dino.width, dino.height);
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && dino.grounded) {
        dino.velocityY = -dino.jumpForce;
        dino.grounded = false;
    }
});

const obstacles = [];

function generateObstacle() {
    const minSpeed = 3;
    const maxSpeed = 9;
    const randomSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

    const obstacle = {
        x: canvas.width,
        y: canvas.height - 50,
        width: 50,
        height: 50,
        speed: randomSpeed
    };
    obstacles.push(obstacle);

    // Schedule the next obstacle
    const minInterval = 500; // 0.5 seconds
    const maxInterval = 2000; // 2 seconds
    const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
    setTimeout(generateObstacle, randomInterval);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
    });
}

function update() {
    // Update dino position and jump physics
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;

    if (dino.y >= canvas.height - dino.height) {
        dino.y = canvas.height - dino.height;
        dino.velocityY = 0;
        dino.grounded = true;
    }

    // Move obstacles and remove off-screen obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

function drawTimer() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Time: ' + elapsedTime.toFixed(2) + 's', 10, 30);
}

function drawGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 24);
}

function drawRestartMessage() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Click to restart', canvas.width / 2 - 80, canvas.height / 2 + 24);
}

function gameOver() {
    drawGameOver();
    drawRestartMessage();

    canvas.addEventListener('click', restartGame);
}

function restartGame() {
    canvas.removeEventListener('click', restartGame);

    // Reset game state
    dino.x = 50;
    dino.y = canvas.height - 50;
    dino.velocityY = 0;
    dino.grounded = true;
    obstacles.length = 0;
    startTime = null;
    elapsedTime = 0;

    // Restart game loop and obstacle generation
    generateObstacle();
    gameLoop();
}

function gameLoop() {
    startTime = startTime || performance.now();
    elapsedTime = (performance.now() - startTime) / 1000; // Convert to seconds

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    drawDino();
    drawObstacles();
    drawTimer();

    if (checkCollision()) {
        gameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Generate obstacles
generateObstacle();

// Start the game loop
gameLoop();
