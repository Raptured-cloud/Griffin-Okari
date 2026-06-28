import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-accent/20 block">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.requiresPrescription && (
            <Badge variant="warning" className="shadow-sm gap-1 backdrop-blur-md bg-amber-500/90">
              <AlertCircle className="w-3 h-3" /> Rx Required
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="shadow-sm backdrop-blur-md bg-destructive/90">Out of Stock</Badge>
          )}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <span className="text-xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={!product.inStock}
            className="gap-2 rounded-full px-4"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
