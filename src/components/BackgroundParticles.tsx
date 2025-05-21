import React, { useEffect, useRef } from 'react';

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle properties
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }

    // Colors for particles
    const colors = ['#2E0854', '#C71585', '#FFD700', '#191970'];

    // Create particles
    const particlesArray: Particle[] = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = Math.random() * 0.5 - 0.25;
      const speedY = Math.random() * 0.5 - 0.25;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const alpha = Math.random() * 0.6 + 0.1;
      const alphaSpeed = Math.random() * 0.01 - 0.005;

      particlesArray.push({
        x, y, size, speedX, speedY, color, alpha, alphaSpeed
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(particle => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Update alpha
        particle.alpha += particle.alphaSpeed;
        if (particle.alpha <= 0.1 || particle.alpha >= 0.7) {
          particle.alphaSpeed = -particle.alphaSpeed;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 bg-deep-purple"
      style={{ background: 'linear-gradient(to bottom, #2E0854, #191970)' }}
    />
  );
};

export default BackgroundParticles;