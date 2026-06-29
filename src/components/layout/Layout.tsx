import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Activity, Menu, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount }             = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate                  = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();          // server deletes the session row
    navigate('/', { replace: true });  // redirect to home
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <Activity className="h-6 w-6" />
              <span>Griffin-Okari</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">Shop All</Link>
              <Link to="/shop?category=Prescription" className="text-muted-foreground hover:text-foreground transition-colors">Prescriptions</Link>
              <Link to="/shop?category=Wellness" className="text-muted-foreground hover:text-foreground transition-colors">Wellness</Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(o => !o)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="gap-2">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <Link to="/cart">
              <Button variant="outline" className="relative gap-2 border-primary/20 hover:bg-primary/5">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t p-4 flex flex-col gap-4 bg-background">
            <Link to="/shop" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
            <Link to="/shop?category=Prescription" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Prescriptions</Link>
            <Link to="/shop?category=Wellness" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Wellness</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium flex items-center gap-1.5 text-primary" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin Panel
              </Link>
            )}
            {!user
              ? <Link to="/auth" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              : <button className="text-sm font-medium text-left text-muted-foreground flex items-center gap-2" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
            }
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary text-primary-foreground py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <Activity className="h-6 w-6" />
              <span>Griffin-Okari</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Your trusted neighborhood pharmacy. Providing quality care and medical products since 1998.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Departments</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/shop?category=Prescription" className="hover:text-white transition-colors">Prescriptions</Link></li>
              <li><Link to="/shop?category=OTC" className="hover:text-white transition-colors">Over-The-Counter</Link></li>
              <li><Link to="/shop?category=Wellness" className="hover:text-white transition-colors">Vitamins &amp; Supplements</Link></li>
              <li><Link to="/shop?category=Medical+Equipment" className="hover:text-white transition-colors">Medical Equipment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Contact Us</li>
              <li>Shipping &amp; Returns</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">Subscribe to receive health tips and exclusive offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-primary-foreground/10 border-primary-foreground/20 rounded-md px-3 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/50"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/10 text-sm text-primary-foreground/50 text-center">
          &copy; {new Date().getFullYear()} Griffin-Okari Pharmacy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
