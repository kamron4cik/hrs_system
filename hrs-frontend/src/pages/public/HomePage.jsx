import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SearchBar from '../../components/shared/SearchBar';

gsap.registerPlugin(ScrollTrigger);

const heroImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80',
];

const destinations = [
  { city: 'New York',  img: 'https://images.unsplash.com/photo-1496442226666-8d4e0e6bc78c?w=800&q=80' },
  { city: 'Paris',     img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80' },
  { city: 'Tokyo',     img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
  { city: 'Dubai',     img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { city: 'Santorini', img: 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80' },
];

const stats = [
  { value: '10K+', label: 'Properties' },
  { value: '190',  label: 'Countries' },
  { value: '4.9',  label: 'Avg Rating' },
  { value: '24/7', label: 'Concierge' },
];

const HomePage = () => {
  const gridRef     = useRef(null);
  const isAnimRef   = useRef(false);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef      = useRef(null);
  const searchRef   = useRef(null);
  const statsRef    = useRef(null);
  const destRef     = useRef(null);

  /* ── Hero 3-D grid + tilt ── */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = [...grid.querySelectorAll('.grid__item')];
    const win   = { w: window.innerWidth, h: window.innerHeight };

    isAnimRef.current = true;
    gsap.fromTo(
      items.map(i => i.querySelector('.grid__item-inner')),
      { x: () => (Math.random() * 2 - 1) * win.w * 0.18, y: () => (Math.random() * 2 - 1) * win.h * 0.18, scale: 0.7, rotationX: () => (Math.random() * 2 - 1) * 25 },
      { x: 0, y: 0, scale: 1, rotationX: 0, duration: 1.6, ease: 'expo.out', delay: 0.15, stagger: 0.05, onComplete: () => { isAnimRef.current = false; } }
    );

    // Text animations
    gsap.fromTo(titleRef.current,    { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.7 });
    gsap.fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'expo.out', delay: 1.3 });
    gsap.fromTo(ctaRef.current,      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'expo.out', delay: 1.7 });

    const onMove = (e) => {
      if (isAnimRef.current) return;
      const rx = ((e.clientX / win.w) - 0.5) * 12;
      const ry = ((e.clientY / win.h) - 0.5) * 12;
      gsap.to(grid, { rotateY: rx, rotateX: -ry, duration: 1.2, ease: 'power2.out' });
    };
    const onResize = () => { win.w = window.innerWidth; win.h = window.innerHeight; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', onResize); };
  }, []);

  /* ── Scroll-triggered sections ── */
  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: searchRef.current, start: 'top 85%' },
      });
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
      });
    }
    if (destRef.current) {
      gsap.fromTo(destRef.current.children, { y: 50, opacity: 0, scale: 0.96 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: destRef.current, start: 'top 80%' },
      });
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="bg-void text-alabaster">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* 3-D grid background */}
        <div className="deco-wrap">
          <div ref={gridRef} className="hero-grid">
            {heroImages.map((src, i) => (
              <div key={i} className="grid__item">
                <div className="grid__item-inner">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {/* dark tint */}
                  <div className="absolute inset-0 bg-void/40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-void via-void/50 to-transparent" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-void/60 to-transparent" />

        {/* Hero copy */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <p className="section-label mb-8 opacity-80">Hotel Reservation System</p>
          <h1
            ref={titleRef}
            className="font-display text-alabaster leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
          >
            Find Your<br /><span className="italic text-gold">Perfect Stay</span>
          </h1>
          <p
            ref={subtitleRef}
            className="font-body text-alabaster/50 text-sm md:text-base uppercase tracking-[0.25em] mt-6"
          >
            Luxury Hotels · Boutique Suites · Hidden Gems
          </p>
        </div>

        {/* Scroll hint */}
        <div ref={ctaRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-alabaster/30">Scroll to search</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>

        <style>{`
          .deco-wrap {
            position: absolute; inset: 0;
            pointer-events: none;
            z-index: 1;
            display: grid;
            place-items: center;
          }
          .hero-grid {
            pointer-events: auto;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4vh;
            max-width: 90vw;
            max-height: 75vh;
            aspect-ratio: 2/1;
            perspective: 1000px;
            transform-style: preserve-3d;
          }
          .grid__item {
            position: relative;
            aspect-ratio: 1;
            overflow: hidden;
            border-radius: 10px;
          }
          .grid__item-inner {
            width: 100%; height: 100%;
            transform-style: preserve-3d;
            will-change: transform;
          }
        `}</style>
      </section>

      {/* ════════════════════════ SEARCH BAR ════════════════════════ */}
      <section className="relative z-20 -mt-8 pb-24 px-4">
        <div ref={searchRef} className="max-w-5xl mx-auto">
          <SearchBar horizontal={true} />
        </div>
      </section>

      {/* ═══════════════════════════ STATS ══════════════════════════ */}
      <section className="py-16 border-t border-b border-white/5">
        <div ref={statsRef} className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="font-display text-gold text-4xl md:text-5xl mb-2">{s.value}</p>
              <p className="section-label opacity-50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ DESTINATIONS ═══════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="section-label mb-4">Explore the World</p>
            <h2 className="font-display text-alabaster text-4xl md:text-5xl">
              Trending <span className="italic text-gold">Destinations</span>
            </h2>
          </div>

          <div ref={destRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((d, i) => (
              <Link
                key={d.city}
                to={`/hotels?city=${d.city}`}
                className={`relative overflow-hidden hrs-card group ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                style={{ height: i < 2 ? '320px' : '240px' }}
              >
                <img
                  src={d.img}
                  alt={d.city}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  style={{ transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="section-label mb-1.5">Explore</p>
                  <h3 className="font-display text-alabaster text-2xl md:text-3xl">{d.city}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════ OFFERS ═══════════════════════════ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-4">Curated Deals</p>
            <h2 className="font-display text-alabaster text-4xl md:text-5xl">
              Exclusive <span className="italic text-gold">Offers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offer 1 */}
            <div
              className="hrs-card p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden group"
              style={{ backgroundImage: "linear-gradient(135deg, #1a1a1a 60%, rgba(197,160,89,0.08))" }}
            >
              <div className="flex-1">
                <p className="section-label mb-3">Monthly Stays</p>
                <h3 className="font-display text-alabaster text-2xl mb-3">Escape for a while</h3>
                <p className="font-body text-alabaster/40 text-sm mb-6 leading-relaxed">
                  Enjoy the freedom of an extended stay. Unlock exclusive monthly rates.
                </p>
                <Link to="/hotels" className="btn-gold !px-6 !py-2.5 !text-[10px]">
                  Discover Monthly Stays
                </Link>
              </div>
              <div
                className="hidden md:block w-32 h-32 rounded-2xl flex-shrink-0 overflow-hidden border border-gold/10 group-hover:border-gold/30 transition-colors duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </div>
            {/* Offer 2 */}
            <div
              className="hrs-card p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden group"
              style={{ backgroundImage: "linear-gradient(135deg, #1a1a1a 60%, rgba(197,160,89,0.08))" }}
            >
              <div className="flex-1">
                <p className="section-label mb-3">Late Escape Deals</p>
                <h3 className="font-display text-alabaster text-2xl mb-3">Save 15% instantly</h3>
                <p className="font-body text-alabaster/40 text-sm mb-6 leading-relaxed">
                  Last-minute luxury at curated destinations worldwide. Book and save.
                </p>
                <Link to="/hotels" className="btn-ghost !px-6 !py-2.5 !text-[10px]">
                  Find Late Escape Deals
                </Link>
              </div>
              <div
                className="hidden md:block w-32 h-32 rounded-2xl flex-shrink-0 overflow-hidden border border-gold/10 group-hover:border-gold/30 transition-colors duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
