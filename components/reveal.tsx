"use client";

import { useEffect, useState, type HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLDivElement>;

export function Reveal({ children, ...props }: RevealProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return (
    <div ref={setNode} data-visible={isVisible} {...props}>
      {children}
    </div>
  );
}
