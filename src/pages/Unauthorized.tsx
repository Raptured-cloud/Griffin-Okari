import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-2">
          The Admin Panel is restricted to administrator accounts only.
        </p>
        {user && (
          <p className="text-sm text-muted-foreground mb-8">
            You are signed in as <span className="font-medium text-foreground">{user.email}</span> with a <span className="font-medium text-foreground">{user.role}</span> account.
          </p>
        )}
        {!user && (
          <p className="text-sm text-muted-foreground mb-8">
            Please sign in with an administrator account to continue.
          </p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-left">
          <p className="text-sm font-semibold text-amber-800 mb-2">Admin credentials for demo:</p>
          <div className="space-y-1 font-mono text-sm text-amber-700">
            <p><span className="text-amber-500">email:</span> admin@griffin-okari.com</p>
            <p><span className="text-amber-500">password:</span> admin123</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="gap-2 w-full sm:w-auto">
              <LogIn className="h-4 w-4" />
              Sign In as Admin
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
