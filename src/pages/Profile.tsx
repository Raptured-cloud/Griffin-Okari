import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Globe, Linkedin, Twitter,
  Award, BookOpen, ShieldCheck, Star, ShoppingCart,
  Package, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  in_stock: boolean;
  stock_count: number;
  requires_prescription: boolean;
  image_url: string;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.5 } },
};

const STAGGER = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function Profile() {
  const [searchParams]        = useSearchParams();
  const view                  = searchParams.get('view'); // 'tablet' | 'mobile' | null
  const [products, setProducts] = useState<Product[]>([]);
  const [added, setAdded]     = useState<Record<number, boolean>>({});
  const { addItem }           = useCart();

  useEffect(() => {
    fetch('/api/products.php?')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setProducts([]));
  }, []);

  const handleAdd = (p: Product) => {
    addItem({
      id:    String(p.id),
      name:  p.name,
      price: p.price,
      image: p.image_url,
    });
    setAdded(a => ({ ...a, [p.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [p.id]: false })), 1800);
  };

  // Responsive container — query param controls viewport simulation
  const outerClass =
    view === 'mobile'  ? 'max-w-[390px] mx-auto px-0' :
    view === 'tablet'  ? 'max-w-[768px] mx-auto px-0' :
    'w-full';

  return (
    <div className={outerClass}>

      {/* ── Hero / Profile Header ───────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
              <div className="relative">
                <img
                  src="https://picsum.photos/seed/pharmacist-profile/200/200"
                  alt="Dr. Griffin Okari"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-400 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  Available
                </span>
              </div>
            </motion.div>

            {/* Name + bio */}
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              animate="show"
              className="text-center sm:text-left flex-1"
            >
              <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-1">
                Chief Pharmacist &amp; Founder
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Dr. Griffin Okari</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base max-w-xl leading-relaxed">
                PharmD · MSc Clinical Pharmacology · 18+ years dispensing expertise across hospital,
                community, and e-commerce pharmacy environments.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                {['PharmD', 'Board Certified', 'CPR Certified', 'ISO 9001'].map(b => (
                  <span key={b} className="text-xs bg-white/20 border border-white/30 rounded-full px-3 py-1 font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────── */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-x">
            {[
              { icon: Award,     value: '18+',   label: 'Years Experience' },
              { icon: BookOpen,  value: '4,200+',label: 'Prescriptions / yr' },
              { icon: ShieldCheck, value: '100%', label: 'Compliance Rate' },
              { icon: Star,      value: '4.9',   label: 'Patient Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center py-5 px-3 gap-1">
                <Icon className="h-5 w-5 text-primary mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT — About + Contact ─────────────────────────────── */}
        <aside className="lg:col-span-1 flex flex-col gap-6">

          {/* About */}
          <motion.div variants={FADE_UP} initial="hidden" animate="show" className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> About Me
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              I founded Griffin-Okari Pharmacy in 2006 with a single mission: make quality pharmaceutical
              care accessible to every patient, regardless of circumstance.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Having trained at the University of Lagos and completed my residency at Lagos University
              Teaching Hospital, I bring both academic rigour and compassionate patient-centred care
              to every consultation.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I personally curate every product in our catalogue — testing for efficacy, verifying
              regulatory approvals, and ensuring cold-chain integrity for all prescription items.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div variants={FADE_UP} initial="hidden" animate="show" className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Contact Info
            </h2>
            <ul className="space-y-3">
              {[
                { icon: Mail,    label: 'Email',    value: 'griffin@griffin-okari.com' },
                { icon: Phone,   label: 'Phone',    value: '+234 (0) 801 234 5678' },
                { icon: MapPin,  label: 'Address',  value: '14 Health Boulevard, Victoria Island, Lagos' },
                { icon: Globe,   label: 'Website',  value: 'www.griffin-okari.com' },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground break-all">{value}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Social links */}
            <div className="flex gap-3 mt-5 pt-4 border-t">
              <Button variant="outline" size="icon" className="h-9 w-9" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" title="Twitter / X">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" title="Website">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Specialisations */}
          <motion.div variants={FADE_UP} initial="hidden" animate="show" className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Specialisations
            </h2>
            <ul className="space-y-2">
              {[
                'Clinical Drug Therapy Management',
                'Diabetes & Metabolic Disorders',
                'Cardiovascular Pharmacology',
                'Paediatric Dosing & Safety',
                'Oncology Supportive Care',
              ].map(s => (
                <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </aside>

        {/* ── RIGHT — Product Showcase ────────────────────────────── */}
        <main className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Featured Products
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Personally selected by Dr. Okari
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border p-4 animate-pulse">
                  <div className="h-32 bg-slate-100 rounded-xl mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={STAGGER}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {products.map(p => (
                <motion.div
                  key={p.id}
                  variants={FADE_UP}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Product image */}
                  <div className="relative h-40 bg-slate-50 overflow-hidden">
                    <img
                      src={p.image_url || `https://picsum.photos/seed/${p.id}/400/300`}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {p.requires_prescription && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Rx
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.category === 'Prescription'       ? 'bg-blue-100 text-blue-700' :
                        p.category === 'OTC'                ? 'bg-green-100 text-green-700' :
                        p.category === 'Wellness'           ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {p.category}
                      </span>
                    </div>
                    {!p.in_stock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${p.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAdd(p)}
                        disabled={!p.in_stock || p.requires_prescription}
                        className="gap-1.5 h-8 text-xs"
                        title={p.requires_prescription ? 'Requires prescription — visit pharmacy' : ''}
                      >
                        {added[p.id]
                          ? <><CheckCircle className="h-3.5 w-3.5" /> Added</>
                          : <><ShoppingCart className="h-3.5 w-3.5" /> {p.requires_prescription ? 'Rx Only' : 'Add to Cart'}</>
                        }
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {p.stock_count} units in stock
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-lg mb-1">Book a Consultation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Need personalised medication advice? Dr. Okari offers 30-minute virtual consultations
              for existing patients.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="gap-2">
                <Phone className="h-4 w-4" /> Schedule a Call
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" /> Send a Message
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
