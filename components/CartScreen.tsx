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

// Custom Cart Item Component
const CartItem = ({ item }: { item: CartItemType }) => (
  <div className="flex flex-col sm:flex-row gap-6 p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center sm:items-start">
    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm">
      <Image 
        src={item.image} 
        alt={item.product_name} 
        fill 
        className="object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <h3 className="font-bold text-lg text-gray-900">
        {item.product_name}
      </h3>
      <p className="text-eco-600 font-semibold mt-1">
        ₹{item.product_price.toLocaleString('en-IN')} each
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Quantity: <span className="font-bold text-gray-900">{item.quantity}</span>
      </p>
    </div>
    <div className="text-center sm:text-right mt-4 sm:mt-0">
      <p className="text-2xl font-bold text-eco-600">
        ₹{(item.product_price * item.quantity).toLocaleString('en-IN')}
      </p>
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
