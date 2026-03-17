'use client';

import { useMemo } from 'react';
import { useCheckoutStore, CartItem as CartItemType } from '@/store/checkoutStore';
import { motion } from 'motion/react';
import CartSummary from './CartSummary';
import { StickyActionButtons } from './StickyActionButtons';
import Image from 'next/image';

// Custom hook for cart calculations
const useCartCalculations = (items: CartItemType[]) => {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.product_price * item.quantity), 0
    );
    
    // Custom logic: Free shipping over ₹1500
    const shippingFee = subtotal > 1500 ? 0 : 50;
    
    // Custom logic: Loyalty discount for multiple items
    const loyaltyDiscount = items.length > 2 ? 100 : 0;
    
    const total = subtotal + shippingFee - loyaltyDiscount;
    
    return { subtotal, shippingFee, loyaltyDiscount, total };
  }, [items]);
};

import { Heart, Copy, Trash2, Minus, Plus } from 'lucide-react';

// Custom Cart Item Component
const CartItem = ({ item }: { item: CartItemType }) => (
  <div className="flex gap-4 p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <div className="flex items-center">
      <input type="checkbox" className="w-5 h-5 accent-eco-600 rounded border-gray-300" defaultChecked />
    </div>
    
    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm">
      <Image 
        src={item.image} 
        alt={item.product_name} 
        fill 
        className="object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-900">
          {item.product_name}
        </h3>
        <div className="flex gap-3 text-gray-400">
          <Heart size={20} className="hover:text-red-500 cursor-pointer" />
          <Copy size={20} className="hover:text-eco-600 cursor-pointer" />
          <Trash2 size={20} className="hover:text-red-600 cursor-pointer" />
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        Introducing our premium {item.product_name}, handcrafted with natural ingredients for the best experience.
      </p>
      
      <div className="flex items-center gap-3 mt-3">
        <span className="font-bold text-lg text-gray-900">₹{item.product_price.toLocaleString('en-IN')}</span>
        <span className="text-sm text-gray-400 line-through">₹{(item.product_price + 75).toLocaleString('en-IN')}</span>
        <span className="text-sm font-semibold text-eco-600">You Save ₹75</span>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Qty:</span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button className="p-2 hover:bg-gray-100"><Minus size={16} /></button>
            <span className="px-4 font-bold">{item.quantity}</span>
            <button className="p-2 hover:bg-gray-100"><Plus size={16} /></button>
          </div>
        </div>
        <button className="text-sm text-eco-600 font-semibold hover:underline">
          Save for later
        </button>
      </div>
    </div>
  </div>
);

export default function CartScreen() {
  const { cartItems, setCurrentStep } = useCheckoutStore();

  const handleCheckout = () => {
    // Custom validation before proceeding
    if (cartItems.length === 0) {
      alert('Cart is empty! Add items before checkout.');
      return;
    }
    setCurrentStep('shipping');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Cart ({cartItems.length} items)
            </h2>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Your cart is empty. Start shopping!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.product_id} 
                  item={item} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <CartSummary />
      </div>

      <StickyActionButtons 
        onNext={handleCheckout}
        isNextDisabled={cartItems.length === 0}
        nextLabel="Proceed to Checkout"
      />
    </motion.div>
  );
}
