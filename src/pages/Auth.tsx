import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const ADMIN_EMAIL    = 'admin@griffin-okari.com';
const ADMIN_PASSWORD = 'admin123';

const loginSchema = z.object({
  email:    z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Name is required'),
  email:    z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues    = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function Auth() {
  const [isLogin, setIsLogin]     = useState(true);
  const [loginError, setLoginError] = useState('');
  const { login }                 = useAuth();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  // Redirect back to wherever the user came from (e.g. /admin), or home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = (data: LoginValues) => {
    setLoginError('');
    const isAdmin =
      data.email.toLowerCase() === ADMIN_EMAIL &&
      data.password === ADMIN_PASSWORD;

    // For demo: admin credentials are fixed; any other email/password registers as customer
    if (data.email.toLowerCase() === ADMIN_EMAIL && !isAdmin) {
      setLoginError('Incorrect password for the admin account.');
      return;
    }

    login({
      email: data.email,
      name:  isAdmin ? 'Administrator' : data.email.split('@')[0],
      role:  isAdmin ? 'admin' : 'customer',
    });

    navigate(isAdmin ? '/admin' : from, { replace: true });
  };

  const onRegisterSubmit = (data: RegisterValues) => {
    // Registering always creates a customer account
    login({
      email: data.email,
      name:  data.name,
      role:  'customer',
    });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-accent/10">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-8 rounded-3xl shadow-xl border"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Activity className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? 'Sign in to access your prescriptions and history'
                : 'Join Griffin-Okari for easier healthcare management'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-accent/50 p-1 rounded-lg mb-8">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${isLogin ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => { setIsLogin(true); setLoginError(''); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!isLogin ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => { setIsLogin(false); setLoginError(''); }}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <Input type="email" placeholder="you@example.com" {...loginForm.register('email')} />
                {loginForm.formState.errors.email && (
                  <span className="text-destructive text-xs mt-1 block">{loginForm.formState.errors.email.message}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <Input type="password" placeholder="••••••••" {...loginForm.register('password')} />
                {loginForm.formState.errors.password && (
                  <span className="text-destructive text-xs mt-1 block">{loginForm.formState.errors.password.message}</span>
                )}
              </div>
              {loginError && (
                <p className="text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2">{loginError}</p>
              )}
              <Button type="submit" className="w-full h-12 text-base">Sign In</Button>

              {/* Admin hint */}
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-slate-700">Admin login (demo)</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">admin@griffin-okari.com / admin123</p>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <Input placeholder="John Doe" {...registerForm.register('name')} />
                {registerForm.formState.errors.name && (
                  <span className="text-destructive text-xs mt-1 block">{registerForm.formState.errors.name.message}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <Input type="email" placeholder="you@example.com" {...registerForm.register('email')} />
                {registerForm.formState.errors.email && (
                  <span className="text-destructive text-xs mt-1 block">{registerForm.formState.errors.email.message}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <Input type="password" placeholder="••••••••" {...registerForm.register('password')} />
                {registerForm.formState.errors.password && (
                  <span className="text-destructive text-xs mt-1 block">{registerForm.formState.errors.password.message}</span>
                )}
              </div>
              <Button type="submit" className="w-full h-12 text-base">Create Account</Button>
              <p className="text-xs text-center text-muted-foreground">
                New accounts are created as <span className="font-medium">customer</span> role.
              </p>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-primary">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
