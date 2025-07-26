// Get canvas and context
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Responsive canvas for mobile (optional)
function resizeCanvas() {
    // Maintain aspect ratio
    const aspect = 800 / 500;
    let width = Math.min(window.innerWidth * 0.96, 800);
    let height = width / aspect;
    if (height > window.innerHeight * 0.7) {
        height = window.innerHeight * 0.7;
        width = height * aspect;
    }
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game settings
const paddleWidth = 12, paddleHeight = 80;
const ballSize = 16;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Paddle positions
let leftPaddleY = (canvasHeight - paddleHeight) / 2;
let rightPaddleY = (canvasHeight - paddleHeight) / 2;

// Ball position and velocity
let ballX = canvasWidth / 2 - ballSize / 2;
let ballY = canvasHeight / 2 - ballSize / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

// Score (optional, not displayed)
let leftScore = 0, rightScore = 0;

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.height / rect.height;
    const mouseY = (evt.clientY - rect.top) * scale;
    leftPaddleY = mouseY - paddleHeight / 2;
    // Clamp within bounds
    leftPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftPaddleY));
});

// Touch movement for player paddle (MOBILE SUPPORT)
canvas.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.height / rect.height;
    const touchY = (evt.touches[0].clientY - rect.top) * scale;
    leftPaddleY = touchY - paddleHeight / 2;
    leftPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, leftPaddleY));
}, { passive: false });

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + ballSize >= canvasHeight) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(canvasHeight - ballSize, ballY));
    }

    // Left paddle collision
    if (
        ballX <= paddleWidth &&
        ballY + ballSize >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add spin based on hit position
        let impact = (ballY + ballSize / 2 - (leftPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY = 5 * impact;
        ballX = paddleWidth;
    }

    // Right paddle collision
    if (
        ballX + ballSize >= canvasWidth - paddleWidth &&
        ballY + ballSize >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let impact = (ballY + ballSize / 2 - (rightPaddleY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY = 5 * impact;
        ballX = canvasWidth - paddleWidth - ballSize;
    }

    // Left or right wall (reset ball)
    if (ballX < 0) {
        rightScore++;
        resetBall(-1);
    }
    if (ballX + ballSize > canvasWidth) {
        leftScore++;
        resetBall(1);
    }

    // Basic AI for right paddle
    let paddleCenter = rightPaddleY + paddleHeight / 2;
    if (paddleCenter < ballY + ballSize / 2 - 10) {
        rightPaddleY += 5;
    } else if (paddleCenter > ballY + ballSize / 2 + 10) {
        rightPaddleY -= 5;
    }
    // Clamp AI paddle
    rightPaddleY = Math.max(0, Math.min(canvasHeight - paddleHeight, rightPaddleY));
}

// Reset ball in center, serve toward scoring player
function resetBall(direction) {
    ballX = canvasWidth / 2 - ballSize / 2;
    ballY = canvasHeight / 2 - ballSize / 2;
    ballSpeedX = 6 * direction;
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw net
    ctx.fillStyle = "#fff";
    for (let i = 10; i < canvasHeight; i += 30) {
        ctx.fillRect(canvasWidth / 2 - 1, i, 2, 15);
    }

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Draw scores (can be displayed if desired)
    /*
    ctx.font = "32px Arial";
    ctx.fillText(leftScore, canvasWidth / 2 - 50, 40);
    ctx.fillText(rightScore, canvasWidth / 2 + 30, 40);
    */
}

// Start game
gameLoop();
