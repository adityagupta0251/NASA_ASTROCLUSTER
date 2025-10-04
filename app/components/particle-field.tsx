"use client";

import { useEffect, useRef } from "react";

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    // particles
    const count = Math.min(80, Math.floor((width * height) / 18000));
    const stars = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      // space gradient overlay
      const g = ctx.createLinearGradient(0, 0, 0, height);
      // using tokens: primary (cyan) to accent (purple) over void background
      g.addColorStop(
        0,
        "color-mix(in oklch, var(--color-background) 70%, var(--color-primary) 30%)"
      );
      g.addColorStop(
        1,
        "color-mix(in oklch, var(--color-background) 70%, var(--color-accent) 30%)"
      );
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // stars
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -2) s.x = width + 2;
        if (s.x > width + 2) s.x = -2;
        if (s.y < -2) s.y = height + 2;
        if (s.y > height + 2) s.y = -2;
        s.twinkle += 0.02;

        const alpha = 0.5 + Math.sin(s.twinkle) * 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.92 ${0.03 + s.r * 0.02} ${260 + s.r * 30} / ${
          0.25 + 0.55 * alpha
        })`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,black,transparent)] pointer-events-none"
      aria-hidden="true"
    />
  );
}
