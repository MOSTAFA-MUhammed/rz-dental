"use client";

import { useEffect, useState } from "react";

export function useReveal<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
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

  return { isVisible, setNode };
}
