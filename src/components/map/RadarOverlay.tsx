'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface RadarOverlayProps {
  lat: number;
  lon: number;
}

export default function RadarOverlay({ lat, lon }: RadarOverlayProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    // Canvas overlay container
    const svgElement = L.SVG ? L.svg() : null;
    
    // Create a custom Leaflet Canvas overlay or just use a standard pane
    const customPaneName = 'radar-pane';
    if (!map.getPane(customPaneName)) {
      map.createPane(customPaneName);
      const pane = map.getPane(customPaneName);
      if (pane) {
        pane.style.zIndex = '350'; // below popups, above tiles
        pane.style.pointerEvents = 'none';
      }
    }

    // Set up canvas overlay
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.75';

    const pane = map.getPane(customPaneName);
    pane?.appendChild(canvas);

    const resizeCanvas = () => {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
    };

    resizeCanvas();

    // Weather cell mock details relative to GPS location (lat, lon)
    // Offset in lat/lon to simulate hyperlocal cells
    const cells = [
      { dLat: 0.015, dLon: 0.02, radius: 45, intensity: 0.85, type: 'heavy' }, // Red heavy storm
      { dLat: -0.012, dLon: 0.03, radius: 60, intensity: 0.6, type: 'moderate' }, // Yellow rain
      { dLat: 0.025, dLon: -0.025, radius: 80, intensity: 0.3, type: 'light' }, // Green light rain
      { dLat: -0.02, dLon: -0.01, radius: 35, intensity: 0.9, type: 'heavy' }, // Intense cell
    ];

    const drawRadar = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear previous frames
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerPoint = map.latLngToContainerPoint([lat, lon]);
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;

      // 1. Draw Radar Sweep Ray
      angleRef.current = (angleRef.current + 0.015) % (Math.PI * 2);
      const sweepAngle = angleRef.current;

      const gradient = ctx.createRadialGradient(
        centerPoint.x,
        centerPoint.y,
        0,
        centerPoint.x,
        centerPoint.y,
        maxRadius
      );
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.15)'); // Cyan
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerPoint.x, centerPoint.y);
      ctx.arc(
        centerPoint.x,
        centerPoint.y,
        maxRadius,
        sweepAngle - 0.4,
        sweepAngle,
        false
      );
      ctx.closePath();
      ctx.fill();

      // Sweeper leading line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerPoint.x, centerPoint.y);
      ctx.lineTo(
        centerPoint.x + Math.cos(sweepAngle) * maxRadius,
        centerPoint.y + Math.sin(sweepAngle) * maxRadius
      );
      ctx.stroke();

      // 2. Draw Concentric Radar Rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      [0.2, 0.4, 0.6, 0.8].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, maxRadius * scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Draw Simulated Weather Radar Cells
      cells.forEach((cell) => {
        const cellPoint = map.latLngToContainerPoint([lat + cell.dLat, lon + cell.dLon]);
        
        // Convert geographical radius to screen pixels
        // 0.01 lat-degrees is roughly 1.1km
        const refPoint = map.latLngToContainerPoint([lat + cell.dLat + 0.01, lon + cell.dLon]);
        const pixelRadius = Math.abs(cellPoint.y - refPoint.y) * (cell.radius / 10);

        const radialGrad = ctx.createRadialGradient(
          cellPoint.x,
          cellPoint.y,
          0,
          cellPoint.x,
          cellPoint.y,
          pixelRadius
        );

        // Map intensities to premium radar colors
        if (cell.type === 'heavy') {
          radialGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)'); // Vibrant Red
          radialGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.4)');
          radialGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.2)'); // Orange border
          radialGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        } else if (cell.type === 'moderate') {
          radialGrad.addColorStop(0, 'rgba(234, 179, 8, 0.6)'); // Bright Yellow
          radialGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.3)');
          radialGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        } else {
          radialGrad.addColorStop(0, 'rgba(34, 197, 94, 0.5)'); // Neon Green
          radialGrad.addColorStop(0.6, 'rgba(34, 197, 94, 0.2)');
          radialGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        }

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(cellPoint.x, cellPoint.y, pixelRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(drawRadar);
    };

    drawRadar();

    // Event listeners to redraw when panning/zooming
    const onMove = () => {
      resizeCanvas();
    };

    map.on('move', onMove);
    map.on('resize', onMove);

    return () => {
      map.off('move', onMove);
      map.off('resize', onMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.remove();
    };
  }, [map, lat, lon]);

  return null;
}
