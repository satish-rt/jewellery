import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) => {
  const el = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case "up":
        y = 40;
        break;
      case "down":
        y = -40;
        break;
      case "left":
        x = 40;
        break;
      case "right":
        x = -40;
        break;
      default:
        y = 40;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [direction, delay]);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return (
    <div
      ref={el}
      className={className}
      style={prefersReducedMotion ? {} : { opacity: 0 }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
