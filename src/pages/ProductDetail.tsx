import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, AlertCircle, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { products } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="bg-card rounded-2xl border p-6 md:p-10 mb-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-accent/20 rounded-xl overflow-hidden relative"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wider text-primary uppercase">{product.category}</span>
              {product.requiresPrescription && (
                <Badge variant="warning" className="gap-1 bg-amber-500">
                  <AlertCircle className="h-3 w-3" /> Rx Required
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-bold text-foreground mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-6 bg-accent/30 p-6 rounded-xl border border-accent mb-8">
              <div className="flex items-center justify-between">
                <span className="font-medium">Availability</span>
                {product.inStock ? (
                  <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-5 w-5" /> In Stock ({product.stockCount})
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-destructive font-semibold">
                    <AlertCircle className="h-5 w-5" /> Out of Stock
                  </span>
                )}
              </div>
              <hr className="border-border/50" />
              <div className="flex items-center gap-4">
                <div className="font-medium w-24">Quantity</div>
                <div className="flex items-center border rounded-md bg-background">
                  <button 
                    className="px-3 py-1 hover:bg-accent disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                  >-</button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button 
                    className="px-3 py-1 hover:bg-accent disabled:opacity-50"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount || !product.inStock}
                  >+</button>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button 
                size="lg" 
                className={`w-full text-lg h-14 ${isAdded ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Added to Cart</span>
                ) : (
                  <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Add to Cart</span>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Genuine Product
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Fast Shipping
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group flex bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-32 h-32 bg-accent/20 shrink-0">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2">{p.name}</h3>
                  <span className="text-primary font-semibold">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
