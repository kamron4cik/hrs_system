import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' });
    };

    const onEnter = () => {
      gsap.to(ring, { width: 48, height: 48, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 0, duration: 0.2 });
    };
    const onLeave = () => {
      gsap.to(ring, { width: 0, height: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove);

    const els = document.querySelectorAll('a, button, [role="button"], .hrs-card, input, select, textarea, label');
    els.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -4, left: -4,
          width: 8, height: 8,
          borderRadius: '50%',
          backgroundColor: '#C5A059',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%,-50%)',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -24, left: -24,
          width: 0, height: 0,
          borderRadius: '50%',
          border: '1px solid rgba(197,160,89,0.55)',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%,-50%)',
        }}
      />
    </>
  );
}
