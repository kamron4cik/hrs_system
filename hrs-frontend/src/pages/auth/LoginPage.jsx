import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const { t }      = useTranslation();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/google`;
  };

  const inputCls =
    'w-full bg-transparent border-b border-white/15 py-3 px-0 text-alabaster text-sm font-body tracking-wide placeholder:text-alabaster/25 focus:outline-none focus:border-gold transition-colors duration-400 mt-1';

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-10 shadow-2xl shadow-black/60">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link to="/" className="font-display text-2xl text-alabaster">
              HRS<span className="italic text-gold">.uz</span>
            </Link>
            <h1 className="font-display text-alabaster text-3xl mt-6 mb-2">{t('auth.signIn')}</h1>
            <p className="font-body text-alabaster/40 text-sm">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-gold hover:text-alabaster transition-colors">
                {t('auth.registerHere')}
              </Link>
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 glass rounded-xl text-sm font-body text-alabaster/70 hover:text-alabaster hover:border-gold/30 transition-all duration-300 mb-8"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-80" />
            {t('auth.googleLogin')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/8" />
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-alabaster/30">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <div>
              <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                {t('auth.email')}
              </label>
              <input
                id="email" type="email"
                {...register('email', { required: 'Email is required' })}
                className={inputCls}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="font-body text-[10px] uppercase tracking-[0.15em] text-alabaster/40">
                  {t('auth.password')}
                </label>
                <Link to="/forgot-password" className="font-body text-[10px] text-gold/60 hover:text-gold transition-colors">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <input
                id="password" type="password"
                {...register('password', { required: 'Password is required' })}
                className={inputCls}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !py-4 !rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : t('auth.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
