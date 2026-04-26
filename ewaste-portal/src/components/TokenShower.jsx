import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const TokenShower = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerShower: () => {
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          if (canvasRef.current) {
            particlesRef.current.push(createParticle(canvasRef.current));
          }
        }, i * 20);
      }
      if (!rafIdRef.current) {
        animLoop();
      }
    }
  }));

  const createParticle = (canvas) => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      size: Math.random() * 8 + 4,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1.5,
      alpha: 1,
      char: '✦',
      color: Math.random() > 0.4 ? '#10B981' : '#6EE7B7',
      rot: Math.random() * Math.PI * 2,
      rotv: (Math.random() - 0.5) * 0.15,
    };
  };

  const animLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.rotv;
      p.alpha -= 0.012;
      
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.font = `${p.size * 2}px serif`;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillText(p.char, -p.size / 2, p.size / 2);
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      rafIdRef.current = requestAnimationFrame(animLoop);
    } else {
      rafIdRef.current = null;
    }
  };

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} id="tokenShower" aria-hidden="true" />;
});

export default TokenShower;
