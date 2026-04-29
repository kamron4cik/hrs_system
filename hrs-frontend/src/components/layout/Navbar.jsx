import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index';

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'uz', label: "O'z", flag: '🇺🇿' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];
const CURRENCIES = ['USD', 'UZS', 'RUB'];

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { currency, changeCurrency } = useCurrency();
  const { t }        = useTranslation();
  const navigate     = useNavigate();

  const [scrolled,  setScrolled]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [currOpen,  setCurrOpen]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[92vw] mx-auto flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="font-display text-xl tracking-wider text-alabaster">
          HRS<span className="italic text-gold">.uz</span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/hotels" className="font-body text-[11px] uppercase tracking-[0.15em] text-alabaster/60 hover:text-gold transition-colors duration-300">
            {t('nav.findHotels')}
          </Link>
          {user && (
            <Link to="/account/bookings" className="font-body text-[11px] uppercase tracking-[0.15em] text-alabaster/60 hover:text-gold transition-colors duration-300">
              {t('nav.myBookings')}
            </Link>
          )}
          {user && isAdmin && (
            <Link to="/admin" className="font-body text-[11px] uppercase tracking-[0.15em] text-gold/80 hover:text-gold transition-colors duration-300">
              {t('nav.adminPanel')}
            </Link>
          )}
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-3">

          {/* Language */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition text-[11px] font-semibold text-alabaster/70 tracking-wider"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span className="text-[9px] opacity-50">▾</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 glass rounded-xl shadow-2xl py-2 min-w-[130px] z-50 animate-fadeIn">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => switchLang(l.code)}
                    className={`w-full text-left px-4 py-2 text-[11px] flex items-center gap-2 hover:bg-white/5 transition-colors
                      ${i18n.language === l.code ? 'text-gold font-semibold' : 'text-alabaster/60'}`}
                  >
                    <span>{l.flag}</span> {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition text-[11px] font-semibold text-alabaster/70 tracking-wider"
            >
              <span>{currency}</span>
              <span className="text-[9px] opacity-50">▾</span>
            </button>
            {currOpen && (
              <div className="absolute right-0 mt-2 glass rounded-xl shadow-2xl py-2 min-w-[90px] z-50 animate-fadeIn">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { changeCurrency(c); setCurrOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[11px] hover:bg-white/5 transition-colors
                      ${currency === c ? 'text-gold font-semibold' : 'text-alabaster/60'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 text-gold flex items-center justify-center font-bold text-xs tracking-wider">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-52 glass rounded-2xl shadow-2xl py-2 text-alabaster opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 animate-fadeIn">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="font-semibold text-sm truncate">{user.first_name} {user.last_name}</p>
                  <p className="text-[10px] text-alabaster/40 truncate mt-0.5">{user.email}</p>
                </div>
                <Link to="/account" className="block px-4 py-2.5 text-xs hover:text-gold transition-colors">
                  {t('nav.profile')}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2.5 text-xs text-gold/80 hover:text-gold transition-colors">
                    {t('nav.adminPanel')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost !px-5 !py-2 !text-[10px]">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-gold !px-5 !py-2 !text-[10px]">
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-2"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-alabaster/80 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-alabaster/80 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-alabaster/80 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass mx-4 mt-2 rounded-2xl p-6 animate-fadeIn space-y-4">
          <Link to="/hotels" onClick={() => setMenuOpen(false)} className="block text-sm text-alabaster/70 hover:text-gold transition-colors">
            {t('nav.findHotels')}
          </Link>
          {user && (
            <Link to="/account/bookings" onClick={() => setMenuOpen(false)} className="block text-sm text-alabaster/70 hover:text-gold transition-colors">
              {t('nav.myBookings')}
            </Link>
          )}
          {!user && (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost !px-4 !py-2 !text-xs flex-1 text-center">
                {t('nav.login')}
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold !px-4 !py-2 !text-xs flex-1 text-center">
                {t('nav.register')}
              </Link>
            </div>
          )}
          {user && (
            <button onClick={handleLogout} className="block text-sm text-red-400 hover:text-red-300 transition-colors">
              {t('nav.logout')}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
