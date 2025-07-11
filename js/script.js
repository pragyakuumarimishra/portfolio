const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
const colors = ['#4b2e83', '#d4af37', '#f0e6f7', '#d9c9f7'];

// Set canvas size
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    initCanvas();
    initParticles();
});

// Particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

// Insect base class
class Insect {
    constructor(x, y, velocityX, size, sprite, frameCount, frameSpeed) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.size = size;
        this.sprite = sprite;
        this.frameCount = frameCount;
        this.frameSpeed = frameSpeed;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.baseY = y;
        this.amplitude = 20 + Math.random() * 15;
        this.frequency = 0.01 + Math.random() * 0.02;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.currentFrame * 0.1) * 0.3);
        const frameWidth = this.sprite.width / this.frameCount;
        ctx.drawImage(
            this.sprite,
            frameWidth * Math.floor(this.currentFrame),
            0,
            frameWidth,
            this.sprite.height,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        ctx.restore();
    }

    update() {
        this.x += this.velocityX;
        this.y = this.baseY + Math.sin(this.x * this.frequency) * this.amplitude;

        this.frameTimer++;
        if (this.frameTimer >= this.frameSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTimer = 0;
        }

        // Wrap around edges horizontally
        if (this.x > canvas.width + this.size) {
            this.x = -this.size;
            this.baseY = Math.random() * canvas.height;
        } else if (this.x < -this.size) {
            this.x = canvas.width + this.size;
            this.baseY = Math.random() * canvas.height;
        }

        this.draw();
    }
}

// Load butterfly sprite
let butterflySprite = new Image();
butterflySprite.src = 'https://i.ibb.co/7JmQZqv/butterfly-sprite.png';

// Load bee sprite
let beeSprite = new Image();
beeSprite.src = 'https://i.ibb.co/2kZ9Q7v/bee-sprite.png';

// Initialize insects array
let insectsArray = [];

function initParticles() {
    particlesArray = [];
    insectsArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000);
    const numberOfInsects = 7;

    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() - 0.5) * 1.5;
        const directionY = (Math.random() - 0.5) * 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

    for (let i = 0; i < numberOfInsects; i++) {
        const size = 40 + Math.random() * 20;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const velocityX = (Math.random() - 0.5) * 1.5;
        const sprite = i % 2 === 0 ? butterflySprite : beeSprite;
        const frameCount = 4;
        const frameSpeed = 5 + Math.floor(Math.random() * 5);
        insectsArray.push(new Insect(x, y, velocityX, size, sprite, frameCount, frameSpeed));
    }
}

// Animate particles and insects
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(particle => particle.update());
    insectsArray.forEach(insect => insect.update());
    connectParticles();
    requestAnimationFrame(animate);
}

// Connect particles with lines if close
function connectParticles() {
    const maxDistance = 120;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(75, 46, 131, ${1 - distance / maxDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Mouse interaction
const mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

function interactParticles() {
    particlesArray.forEach(particle => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;

            particle.x += forceDirectionX * force * 5;
            particle.y += forceDirectionY * force * 5;
        }
    });
}

// Main animation loop with interaction
function animateWithInteraction() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    interactParticles();
    particlesArray.forEach(particle => particle.update());
    connectParticles();
    requestAnimationFrame(animateWithInteraction);
}

// Initialize everything
initCanvas();
initParticles();
animateWithInteraction();

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
});

// Back to Top Button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just log it and show an alert
    console.log({ name, email, subject, message });
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset the form
    contactForm.reset();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});