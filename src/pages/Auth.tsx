import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues    = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function Auth() {
  const [tab, setTab]           = useState<'login' | 'register'>('login');
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg]   = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const { login, register } = useAuth();
  const navigate             = useNavigate();
  const location             = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const switchTab = (next: 'login' | 'register') => {
    setTab(next);
    setServerError('');
    setSuccessMsg('');
    loginForm.reset();
    registerForm.reset();
  };

  // ── LOGIN submit ────────────────────────────────────────────────
  const onLoginSubmit = async (data: LoginValues) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      setSuccessMsg('Signed in successfully! Redirecting…');
      // Small delay so user sees the success flash before navigation
      setTimeout(() => {
        // Admins go straight to the admin panel
        navigate(data.email.toLowerCase() === 'admin@griffin-okari.com' ? '/admin' : from, { replace: true });
      }, 800);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── REGISTER submit ─────────────────────────────────────────────
  const onRegisterSubmit = async (data: RegisterValues) => {
    setServerError('');
    setSubmitting(true);
    try {
      await register(data.name, data.email, data.password);
      setSuccessMsg('Account created! Redirecting…');
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-accent/10">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 rounded-3xl shadow-xl border"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Activity className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {tab === 'login'
                ? 'Sign in to access your prescriptions and history'
                : 'Join Griffin-Okari for easier healthcare management'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-accent/50 p-1 rounded-lg mb-6">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                disabled={submitting}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  tab === t
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Server error banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 mb-5 text-sm"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {/* Success banner */}
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-5 text-sm"
              >
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LOGIN form ── */}
          {tab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={submitting}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-destructive text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-destructive text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base gap-2" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                ) : 'Sign In'}
              </Button>

              {/* Admin hint */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Admin demo credentials</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  admin@griffin-okari.com&nbsp;/&nbsp;admin123
                </p>
              </div>
            </form>
          )}

          {/* ── REGISTER form ── */}
          {tab === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <Input
                  placeholder="Jane Doe"
                  autoComplete="name"
                  disabled={submitting}
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={submitting}
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={submitting}
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-destructive text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base gap-2" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                ) : 'Create Account'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                New accounts are created with <span className="font-medium">customer</span> access.
              </p>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-primary">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
