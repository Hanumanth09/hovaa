// Tree Canvas
const treeCanvas = document.getElementById('treeCanvas');
const treeCtx = treeCanvas.getContext('2d');

// Responsive canvas sizing
function resizeCanvas() {
    const container = document.querySelector('.tree-container');
    const maxWidth = Math.min(1000, window.innerWidth - 40);
    const scale = maxWidth / 1000;
    treeCanvas.style.width = maxWidth + 'px';
    treeCanvas.style.height = (800 * scale) + 'px';
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);
resizeCanvas();

// Store all branches and hearts
let allBranches = [];
let allHearts = [];
let currentBranchIndex = 0;
let currentHeartIndex = 0;

class Branch {
    constructor(startX, startY, endX, endY, width) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.width = width;
    }
    
    draw() {
        treeCtx.strokeStyle = '#5d4037';
        treeCtx.lineWidth = this.width;
        treeCtx.lineCap = 'round';
        treeCtx.beginPath();
        treeCtx.moveTo(this.startX, this.startY);
        treeCtx.lineTo(this.endX, this.endY);
        treeCtx.stroke();
    }
}

class Heart {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    
    draw() {
        treeCtx.save();
        treeCtx.translate(this.x, this.y);
        treeCtx.scale(this.size, this.size);
        treeCtx.fillStyle = this.color;
        treeCtx.shadowBlur = 10;
        treeCtx.shadowColor = this.color;
        treeCtx.beginPath();
        treeCtx.moveTo(0, 0);
        treeCtx.bezierCurveTo(-3, -3, -6, -1, -6, 2);
        treeCtx.bezierCurveTo(-6, 4, -3, 6, 0, 9);
        treeCtx.bezierCurveTo(3, 6, 6, 4, 6, 2);
        treeCtx.bezierCurveTo(6, -1, 3, -3, 0, 0);
        treeCtx.fill();
        treeCtx.restore();
    }
}

function generateTree(x, y, length, angle, width, depth) {
    if (depth === 0 || length < 5) {
        const colors = ['#ff1744', '#ff4081', '#f50057', '#ff80ab'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 0.8 + 0.6;
        allHearts.push(new Heart(x, y, size, color));
        return;
    }
    
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);
    
    allBranches.push(new Branch(x, y, endX, endY, width));
    
    const newLength = length * (0.7 + Math.random() * 0.1);
    const newWidth = width * 0.7;
    
    generateTree(endX, endY, newLength, angle - 0.3 - Math.random() * 0.3, newWidth, depth - 1);
    generateTree(endX, endY, newLength, angle + 0.3 + Math.random() * 0.3, newWidth, depth - 1);
    
    if (depth > 3 && Math.random() > 0.5) {
        generateTree(endX, endY, newLength * 0.8, angle - 0.1, newWidth, depth - 1);
    }
}

// Draw ground
treeCtx.fillStyle = '#3d2817';
treeCtx.globalAlpha = 0.5;
treeCtx.beginPath();
treeCtx.ellipse(500, 750, 400, 50, 0, 0, Math.PI * 2);
treeCtx.fill();
treeCtx.globalAlpha = 1;

// Draw main trunk
treeCtx.strokeStyle = '#5d4037';
treeCtx.lineWidth = 50;
treeCtx.lineCap = 'round';
treeCtx.beginPath();
treeCtx.moveTo(500, 750);
treeCtx.lineTo(500, 650);
treeCtx.stroke();

// Generate all branches and hearts
generateTree(500, 650, 120, -Math.PI / 2, 40, 8);

// Animate drawing branches one by one
function animateBranches() {
    if (currentBranchIndex < allBranches.length) {
        allBranches[currentBranchIndex].draw();
        currentBranchIndex++;
        setTimeout(animateBranches, 20);
    } else {
        setTimeout(animateHearts, 500);
    }
}

// Animate drawing hearts one by one
function animateHearts() {
    if (currentHeartIndex < allHearts.length) {
        allHearts[currentHeartIndex].draw();
        currentHeartIndex++;
        setTimeout(animateHearts, 30);
    }
}

// Auto-play background music
const audio = document.getElementById('loveSong');
if (audio) {
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio autoplay blocked'));
}

// Start animation
setTimeout(animateBranches, 500);

// Canvas particle system
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = ['#ff1744', '#ff4081', '#f50057', '#ff80ab'][Math.floor(Math.random() * 4)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 1 - distance / 100;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resizeCanvas();
});

// Quote navigation
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function showQuote(index) {
    quotes.forEach(quote => quote.classList.remove('active'));
    quotes[index].classList.add('active');
}

nextBtn.addEventListener('click', () => {
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
});

prevBtn.addEventListener('click', () => {
    currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
    showQuote(currentQuote);
});

setInterval(() => {
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
}, 5000);

// Floating hearts
const floatingHeartsContainer = document.getElementById('floatingHearts');
const heartSymbols = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    floatingHeartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

setInterval(createFloatingHeart, 500);

for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingHeart, i * 200);
}

// Tree canvas click effect
treeCanvas.addEventListener('click', (e) => {
    const rect = treeCanvas.getBoundingClientRect();
    
    for (let i = 0; i < 12; i++) {
        const burst = document.createElement('div');
        burst.style.position = 'fixed';
        burst.style.left = e.clientX + 'px';
        burst.style.top = e.clientY + 'px';
        burst.style.fontSize = '1.5rem';
        burst.innerHTML = '✨';
        burst.style.pointerEvents = 'none';
        burst.style.zIndex = '1000';
        document.body.appendChild(burst);
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 150;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0, posY = 0, opacity = 1;
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.02;
            burst.style.transform = `translate(${posX}px, ${posY}px)`;
            burst.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                burst.remove();
            }
        };
        animate();
    }
});
