import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, HeartPulse, Stethoscope, Pill } from 'lucide-react';
import { products } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-primary-foreground"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Expert care,<br />delivered daily.
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 leading-relaxed font-light">
              Your neighborhood pharmacy online. Authentic medications, expert advice, and wellness products delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8 rounded-full shadow-xl">
                  Shop Products
                </Button>
              </Link>
              <Link to="/shop?category=Prescription">
                <Button size="lg" variant="outline" className="border-white text-primary-foreground hover:bg-white/10 hover:text-white text-lg h-14 px-8 rounded-full">
                  Fill Prescription
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Verified Authentic", desc: "All medications sourced directly from manufacturers" },
            { icon: HeartPulse, title: "Expert Pharmacists", desc: "Available 24/7 for consultation and guidance" },
            { icon: Stethoscope, title: "Medical Grade", desc: "Top tier equipment and clinical wellness products" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
              className="bg-card p-8 rounded-2xl shadow-xl border border-border/50 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Link to="/shop" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Prescription", icon: Pill, color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
            { name: "OTC", icon: HeartPulse, color: "bg-teal-50 text-teal-700", border: "border-teal-100" },
            { name: "Wellness", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
            { name: "Medical Equipment", icon: Stethoscope, color: "bg-indigo-50 text-indigo-700", border: "border-indigo-100" }
          ].map((cat, i) => (
            <Link key={i} to={`/shop?category=${cat.name}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border ${cat.border} ${cat.color} flex flex-col items-center justify-center text-center h-48 transition-colors hover:shadow-md cursor-pointer`}
              >
                <cat.icon className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="font-bold text-lg">{cat.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked wellness essentials for your daily health.</p>
          </div>
          <Link to="/shop" className="hidden md:flex text-primary font-medium items-center gap-2 hover:gap-3 transition-all">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-secondary text-secondary-foreground rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-2xl relative z-10 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transfer your prescriptions today.</h2>
            <p className="text-lg text-secondary-foreground/80">
              Fast, easy, and secure. Let our pharmacists handle the transfer process for you.
            </p>
          </div>
          
          <div className="relative z-10">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 text-lg h-14 px-8 rounded-full shadow-lg">
              Start Transfer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
