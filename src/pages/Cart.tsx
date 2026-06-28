import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(4, 'Valid ZIP is required'),
  cardNumber: z.string().min(16, 'Valid card number required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Order processed:', data, items);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card p-12 rounded-3xl border shadow-xl flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Thank you for trusting Griffin-Okari. Your health products are being prepared for secure shipping.
          </p>
          <Button size="lg" onClick={() => navigate('/')}>Return to Home</Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="bg-accent/30 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingCart className="w-12 h-12 text-primary/50" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any pharmaceutical products yet.</p>
        <Link to="/shop">
          <Button size="lg" className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const requiresRx = items.some(item => item.requiresPrescription);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden shadow-sm"
              >
                <div className="w-full sm:w-32 h-32 bg-accent/20 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      {item.requiresPrescription && (
                        <span className="inline-block mt-2 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Rx Required</span>
                      )}
                    </div>
                    <div className="font-bold text-lg text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                      <div className="text-sm font-normal text-muted-foreground">${item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-md bg-background">
                      <button className="px-3 py-1 hover:bg-accent" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-accent" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-4 h-4" /> Remove
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 text-sm mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cartTotal > 50 ? 'Free' : '$5.99'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-xl mb-6">
              <span>Total</span>
              <span>${(cartTotal + (cartTotal > 50 ? 0 : 5.99) + cartTotal * 0.08).toFixed(2)}</span>
            </div>

            {requiresRx && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm mb-6 flex gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Your order contains prescription medications. A pharmacist will contact you to verify prescriptions before shipping.</p>
              </div>
            )}

            {!isCheckingOut ? (
              <Button size="lg" className="w-full text-lg" onClick={() => setIsCheckingOut(true)}>
                Proceed to Checkout
              </Button>
            ) : (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4 pt-4 border-t"
              >
                <div>
                  <Input placeholder="Full Name" {...register('fullName')} />
                  {errors.fullName && <span className="text-destructive text-xs mt-1 block">{errors.fullName.message}</span>}
                </div>
                <div>
                  <Input type="email" placeholder="Email Address" {...register('email')} />
                  {errors.email && <span className="text-destructive text-xs mt-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <Input placeholder="Shipping Address" {...register('address')} />
                  {errors.address && <span className="text-destructive text-xs mt-1 block">{errors.address.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input placeholder="City" {...register('city')} />
                    {errors.city && <span className="text-destructive text-xs mt-1 block">{errors.city.message}</span>}
                  </div>
                  <div>
                    <Input placeholder="ZIP Code" {...register('zipCode')} />
                    {errors.zipCode && <span className="text-destructive text-xs mt-1 block">{errors.zipCode.message}</span>}
                  </div>
                </div>
                <div>
                  <Input placeholder="Card Number" {...register('cardNumber')} />
                  {errors.cardNumber && <span className="text-destructive text-xs mt-1 block">{errors.cardNumber.message}</span>}
                </div>
                
                <div className="pt-2 flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCheckingOut(false)}>Back</Button>
                  <Button type="submit" className="flex-[2]">Confirm Order</Button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
