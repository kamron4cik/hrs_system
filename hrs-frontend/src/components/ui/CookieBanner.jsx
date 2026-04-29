import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false); };
  const reject = () => { localStorage.setItem('cookie_consent', 'rejected'); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fadeIn">
      <div className="glass rounded-2xl p-5 shadow-2xl shadow-black/60 border border-gold/10">
        <p className="font-body text-xs text-alabaster/60 leading-relaxed mb-4">
          🍪 {t('cookie.message')}{' '}
          <Link to="/terms" className="text-gold hover:text-alabaster transition-colors">
            {t('cookie.learnMore')}
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={reject}
            className="btn-ghost !px-4 !py-2 !text-[10px] flex-1"
          >
            {t('cookie.rejectNonEssential')}
          </button>
          <button
            onClick={accept}
            className="btn-gold !px-4 !py-2 !text-[10px] flex-1"
          >
            {t('cookie.acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
