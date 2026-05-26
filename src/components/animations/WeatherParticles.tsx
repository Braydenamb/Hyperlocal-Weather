'use client';

import { useEffect, useRef, useCallback } from 'react';

type WeatherCondition = 'rain' | 'snow' | 'cloud' | 'clear' | 'storm';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface WeatherParticlesProps {
  condition: WeatherCondition;
  intensity?: number;
  className?: string;
}

export default function WeatherParticles({
  condition,
  intensity = 1,
  className = '',
}: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      switch (condition) {
        case 'rain':
          return {
            x: Math.random() * width,
            y: -10,
            vx: -1 + Math.random() * -1,
            vy: 8 + Math.random() * 8,
            size: 1.5 + Math.random() * 1,
            opacity: 0.3 + Math.random() * 0.4,
            life: 0,
            maxLife: 60 + Math.random() * 40,
          };
        case 'snow':
          return {
            x: Math.random() * width,
            y: -10,
            vx: Math.sin(Math.random() * Math.PI * 2) * 0.5,
            vy: 1 + Math.random() * 2,
            size: 2 + Math.random() * 3,
            opacity: 0.5 + Math.random() * 0.4,
            life: 0,
            maxLife: 200 + Math.random() * 100,
          };
        case 'cloud':
          return {
            x: -50,
            y: Math.random() * height * 0.4,
            vx: 0.2 + Math.random() * 0.3,
            vy: Math.sin(Math.random() * Math.PI) * 0.1,
            size: 30 + Math.random() * 50,
            opacity: 0.03 + Math.random() * 0.06,
            life: 0,
            maxLife: 600 + Math.random() * 300,
          };
        case 'storm':
          return {
            x: Math.random() * width,
            y: -10,
            vx: -3 + Math.random() * -2,
            vy: 14 + Math.random() * 10,
            size: 1 + Math.random() * 1.5,
            opacity: 0.4 + Math.random() * 0.4,
            life: 0,
            maxLife: 40 + Math.random() * 20,
          };
        default:
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.sin(Math.random() * Math.PI * 2) * 0.2,
            vy: -0.1 - Math.random() * 0.2,
            size: 1 + Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.15,
            life: 0,
            maxLife: 300 + Math.random() * 200,
          };
      }
    },
    [condition]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const maxParticles = Math.floor(
      (condition === 'cloud' ? 8 : condition === 'clear' ? 20 : 60) * intensity
    );

    const getColor = () => {
      switch (condition) {
        case 'rain':
        case 'storm':
          return '150, 200, 255';
        case 'snow':
          return '220, 230, 255';
        case 'cloud':
          return '180, 190, 210';
        default:
          return '255, 220, 150';
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle(w, h));
      }

      const color = getColor();

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (condition === 'snow') {
          p.vx = Math.sin(p.life * 0.02) * 0.5;
        }

        const lifeRatio = p.life / p.maxLife;
        const fade = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) / 0.2 : Math.min(lifeRatio * 5, 1);
        const alpha = p.opacity * fade;

        if (condition === 'rain' || condition === 'storm') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.5, p.y + p.vy * 0.5);
          ctx.strokeStyle = `rgba(${color}, ${alpha})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (condition === 'cloud') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fill();
        }

        return p.life < p.maxLife && p.x > -100 && p.x < w + 100 && p.y < h + 50;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [condition, intensity, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
