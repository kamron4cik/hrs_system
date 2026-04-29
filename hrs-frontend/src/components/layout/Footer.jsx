import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let stars = [];
    let animId;
    const NUM_STARS = 300;

    const resize = () => {
      width  = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width  = width;
      canvas.height = height;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: NUM_STARS }, () => ({
        x:      Math.random() * width,
        y:      Math.random() * height,
        radius: Math.random() * 1.2,
        alpha:  Math.random(),
        speed:  Math.random() * 0.04 + 0.01,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Moon glow
      const grd = ctx.createRadialGradient(width / 2, height * 0.35, 0, width / 2, height * 0.35, Math.min(width, height) * 0.35);
      grd.addColorStop(0, 'rgba(197,160,89,0.04)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,244,240,${s.alpha})`;
        ctx.fill();

        s.y -= s.speed;
        if (s.y < 0) s.y = height;
        s.alpha += (Math.random() - 0.5) * 0.04;
        s.alpha = Math.max(0.05, Math.min(0.9, s.alpha));
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <footer id="contact" className="relative w-full bg-void overflow-hidden">
      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top separator */}
      <div className="relative z-10 border-t border-white/5" />

      {/* CTA band */}
      <div className="relative z-10 py-24 text-center px-6">
        <p className="section-label mb-6">Begin Your Journey</p>
        <h2 className="font-display text-alabaster text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight">
          Arrive at the<br />
          <span className="italic text-gold">Extraordinary</span>
        </h2>
        <p className="font-body text-alabaster/40 text-sm max-w-md mx-auto mb-12 leading-relaxed">
          Subscribe for exclusive hotel deals, private openings, and curated stays
          handpicked from across the globe.
        </p>

        {/* Email subscribe */}
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto">
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent border-b-2 border-alabaster/20 py-4 px-0 text-alabaster font-body text-sm tracking-wider focus:outline-none focus:border-gold transition-colors duration-500 placeholder:text-alabaster/25"
            />
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-500"
              style={{ width: email ? '100%' : '0%', boxShadow: email ? '0 0 18px rgba(197,160,89,0.4)' : 'none' }}
            />
          </div>
          <button className="btn-gold flex-shrink-0">Subscribe</button>
        </div>
      </div>

      {/* Footer links */}
      <div className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-[90vw] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-display text-lg text-alabaster">
            HRS<span className="italic text-gold">.uz</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { label: 'Hotels',  to: '/hotels' },
              { label: 'Terms',   to: '/terms' },
              { label: 'Account', to: '/account' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="font-body text-[10px] text-alabaster/20">
            © {new Date().getFullYear()} Hotel Reservation System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
