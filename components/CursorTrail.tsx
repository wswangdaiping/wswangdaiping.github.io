
import React, { useEffect, useRef } from 'react';

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const points: { x: number; y: number; age: number; color: string }[] = [];
    const colors = ['#e11d48', '#15803d', '#fbbf24', '#f8fafc']; // 红, 绿, 金, 白
    let colorIndex = 0;

    const handleMouseMove = (e: MouseEvent) => {
      points.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        color: colors[colorIndex]
      });
      colorIndex = (colorIndex + 1) % colors.length;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (points.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          const opacity = 1 - p2.age / 40;
          
          if (opacity > 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p2.color;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = opacity * 8; // 彩带宽度随寿命减小
            ctx.shadowBlur = 10;
            ctx.shadowColor = p2.color;
            ctx.stroke();
          }
        }
      }

      // 更新寿命并清理
      for (let i = 0; i < points.length; i++) {
        points[i].age += 1;
      }
      
      while (points.length > 0 && points[0].age > 40) {
        points.shift();
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;
