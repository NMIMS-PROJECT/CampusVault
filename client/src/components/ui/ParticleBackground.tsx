"use client";

import { useEffect, useRef } from 'react';

// Particle class moved outside component to fix ESLint inline class warning
class Particle {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    size: number;
    color: string;
    ctx: CanvasRenderingContext2D | null = null;

    constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string, ctx: CanvasRenderingContext2D | null) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.ctx = ctx;
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update(canvas: HTMLCanvasElement, mouse: { x: number | null; y: number | null; radius: number }) {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision detection
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= forceDirectionX * force * 5;
                this.y -= forceDirectionY * force * 5;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        const particles: Particle[] = [];
        const mouse = { x: null as number | null, y: null as number | null, radius: 200 };

        const init = () => {
            if (!canvas) return;
            particles.length = 0;
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = (Math.random() * 2) + 1;
                const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = 'rgba(100, 150, 255, 0.8)'; // Dark blue
                particles.push(new Particle(x, y, directionX, directionY, size, color, ctx));
            }
        };

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init(); 
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const connect = () => {
            if (!canvas || !ctx) return;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        const opacityValue = 1 - (distance / 20000);
                        
                        const dx_mouse_a = mouse.x !== null ? particles[a].x - mouse.x : 0;
                        const dy_mouse_a = mouse.y !== null ? particles[a].y - mouse.y : 0;
                        const distance_mouse_a = Math.sqrt(dx_mouse_a * dx_mouse_a + dy_mouse_a * dy_mouse_a);

                        if (mouse.x !== null && distance_mouse_a < mouse.radius) {
                             ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                        } else {
                             ctx.strokeStyle = `rgba(100, 150, 255, ${opacityValue})`;
                        }
                        
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(canvas, mouse);
            }
            connect();
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">    
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-50"></canvas>
        </div>
    );
};

export default ParticleBackground;