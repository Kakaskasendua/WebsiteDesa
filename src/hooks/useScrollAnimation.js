'use client';

import { useEffect, useRef } from 'react';

export default function useScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current || document;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    const observeNewElements = () => {
      const elements = container.querySelectorAll('.fade-up:not(.visible), .fade-left:not(.visible), .fade-right:not(.visible)');
      elements.forEach((el) => observer.observe(el));
    };

    observeNewElements();

    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return ref;
}
