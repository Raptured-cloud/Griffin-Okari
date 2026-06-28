import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Activity, Menu } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Layout({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                  <Button variant="ghost" size="icon" onClick={logout} title="Logout">
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
            {!user && <Link to="/auth" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Sign In</Link>}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

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
              <li><Link to="/shop?category=Wellness" className="hover:text-white transition-colors">Vitamins & Supplements</Link></li>
              <li><Link to="/shop?category=Medical+Equipment" className="hover:text-white transition-colors">Medical Equipment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Contact Us</li>
              <li>Shipping & Returns</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">Subscribe to receive health tips and exclusive offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-primary-foreground/10 border-primary-foreground/20 rounded-md px-3 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/50" />
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
