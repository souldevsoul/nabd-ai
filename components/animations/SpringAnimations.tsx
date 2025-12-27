"use client";

import { useSpring, useTrail, config, useSprings } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, ReactNode } from "react";
import { AnimatedDiv, AnimatedSpan } from "./AnimatedWrapper";

// Elegant fade with gold shimmer
export function GoldShimmer({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [spring, api] = useSpring(() => ({
    from: { x: -100 },
    config: { duration: 4000 },
  }));

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await api.start({ x: 200 });
        await new Promise((r) => setTimeout(r, 3000));
        api.set({ x: -100 });
      }
    };
    animate();
  }, [api]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <AnimatedDiv
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
          transform: spring.x.to((x) => `translateX(${x}%)`),
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// Luxury reveal - elegant slide up
export function LuxuryReveal({ children, delay = 0, className = "" }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const spring = useSpring({
    from: { opacity: 0, y: 80, filter: "blur(4px)" },
    to: inView
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 80, filter: "blur(4px)" },
    delay,
    config: { tension: 80, friction: 20 },
  });

  return (
    <div ref={ref} className={className}>
      <AnimatedDiv style={spring}>
        {children}
      </AnimatedDiv>
    </div>
  );
}

// Prestige counter - numbers that count up elegantly
export function PrestigeCounter({ value, prefix = "", suffix = "" }: {
  value: number | string;
  prefix?: string;
  suffix?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;

  const spring = useSpring({
    from: { number: 0 },
    to: inView ? { number: numValue } : { number: 0 },
    config: { duration: 2500, easing: (t: number) => 1 - Math.pow(1 - t, 3) },
  });

  return (
    <AnimatedSpan ref={ref}>
      {spring.number.to((n) => {
        if (typeof value === "string" && value.includes(".")) {
          return `${prefix}${n.toFixed(1)}${suffix}`;
        }
        return `${prefix}${Math.floor(n)}${suffix}`;
      })}
    </AnimatedSpan>
  );
}

// Elegant line draw animation
export function LineReveal({ width = "100%", className = "" }: { width?: string; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  const spring = useSpring({
    from: { width: "0%" },
    to: inView ? { width } : { width: "0%" },
    config: { duration: 1200, easing: (t: number) => t * t },
  });

  return (
    <AnimatedDiv
      ref={ref}
      className={`h-px bg-gradient-to-r from-primary via-primary to-transparent ${className}`}
      style={{ width: spring.width }}
    />
  );
}

// Staggered service cards with trail effect
export function TrailCards({ items, renderItem }: {
  items: unknown[];
  renderItem: (item: unknown, index: number) => ReactNode;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const trail = useTrail(items.length, {
    from: { opacity: 0, x: -40 },
    to: inView
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: -40 },
    config: { tension: 100, friction: 20 },
  });

  return (
    <div ref={ref}>
      {trail.map((style, index) => (
        <AnimatedDiv key={index} style={style}>
          {renderItem(items[index], index)}
        </AnimatedDiv>
      ))}
    </div>
  );
}

// Floating decorative element
export function FloatingElement({ children, amplitude = 10, duration = 4000 }: {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
}) {
  const spring = useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: amplitude, config: { duration: duration / 2 } });
        await next({ y: -amplitude, config: { duration: duration / 2 } });
      }
    },
  });

  return (
    <AnimatedDiv style={{ transform: spring.y.to((y) => `translateY(${y}px)`) }}>
      {children}
    </AnimatedDiv>
  );
}

// Spotlight hover effect
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [{ x, y, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    opacity: 0,
    config: config.gentle,
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    api.start({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 0.15,
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => api.start({ opacity: 0 })}
    >
      <AnimatedDiv
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
          transform: x.to((xVal) => `translate(${xVal - 150}px, ${y.get() - 150}px)`),
          opacity,
          pointerEvents: "none",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
