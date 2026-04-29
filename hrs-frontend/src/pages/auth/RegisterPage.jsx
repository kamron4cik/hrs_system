import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { register: rf, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();
  const { t }        = useTranslation();
  const password     = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await register(data);
      toast.success('Welcome to HRS.uz!');
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        const msgs = Object.values(err.response.data.errors || {}).flat().join('\n');
        toast.error(msgs || 'Validation error');
      } else {
        toast.error(err.response?.data?.message || 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-transparent border-b border-white/15 py-3 px-0 text-alabaster text-sm font-body tracking-wide placeholder:text-alabaster/25 focus:outline-none focus:border-gold transition-colors duration-400 mt-1';

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/4 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-10 shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-2xl text-alabaster">
              HRS<span className="italic text-gold">.uz</span>
            </Link>
            <h1 className="font-display text-alabaster text-3xl mt-6 mb-2">{t('auth.createAccount')}</h1>
            <p className="font-body text-alabaster/40 text-sm">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-gold hover:text-alabaster transition-colors">
                {t('auth.loginHere')}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                  {t('auth.firstName')}
                </label>
                <input type="text" {...rf('first_name', { required: 'Required' })} className={inputCls} placeholder="John" />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                  {t('auth.lastName')}
                </label>
                <input type="text" {...rf('last_name', { required: 'Required' })} className={inputCls} placeholder="Doe" />
                {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                {t('auth.email')}
              </label>
              <input type="email" {...rf('email', { required: 'Required' })} className={inputCls} placeholder="you@example.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                {t('auth.phone')}
              </label>
              <input type="text" {...rf('phone')} className={inputCls} placeholder="+998 90 000 00 00" />
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                {t('auth.password')}
              </label>
              <input
                type="password"
                {...rf('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
                className={inputCls}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                {...rf('password_confirmation', {
                  required: 'Required',
                  validate: v => v === password || 'Passwords do not match',
                })}
                className={inputCls}
                placeholder="••••••••"
              />
              {errors.password_confirmation && <p className="text-red-400 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <div
                className="relative mt-0.5 flex-shrink-0"
                onClick={() => {}}
              >
                <input
                  id="terms"
                  type="checkbox"
                  {...rf('terms_accepted', { required: 'You must accept the terms' })}
                  className="w-4 h-4 rounded border border-gold/30 bg-transparent accent-gold cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="font-body text-xs text-alabaster/40 leading-relaxed cursor-pointer">
                {t('auth.terms')}{' '}
                <Link to="/terms" target="_blank" className="text-gold hover:text-alabaster transition-colors">{t('auth.termsLink')}</Link>
                {' '}{t('auth.and')}{' '}
                <Link to="/terms" target="_blank" className="text-gold hover:text-alabaster transition-colors">{t('auth.privacyLink')}</Link>
              </label>
            </div>
            {errors.terms_accepted && <p className="text-red-400 text-xs -mt-4">{errors.terms_accepted.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !py-4 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.registering') : t('auth.registerBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
