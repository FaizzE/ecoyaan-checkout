'use client';

import { useState } from 'react';
import { useCheckoutStore } from '@/store/checkoutStore';

export default function CartSummary() {
  const { cartItems, getSubtotal, calculateShippingFee, discountApplied, setDiscount, getTotalPrice } = useCheckoutStore();
  
  const [couponCode, setCouponCode] = useState('');
  
  const subtotal = getSubtotal();
  const shippingFee = calculateShippingFee(subtotal);
  const total = getTotalPrice();

  const VALID_COUPONS: Record<string, { code: string, discount: number, minAmount: number }> = {
    'ECO10': { code: 'ECO10', discount: 100, minAmount: 500 },
    'ECO20': { code: 'ECO20', discount: 250, minAmount: 1000 },
    'SUSTAINABLE': { code: 'SUSTAINABLE', discount: 200, minAmount: 800 },
  };

  const applyCoupon = () => {
    const coupon = VALID_COUPONS[couponCode.toUpperCase()];
    
    if (!coupon) {
      alert('Invalid coupon code');
      return;
    }
    
    if (subtotal < coupon.minAmount) {
      alert(`Minimum order amount ₹${coupon.minAmount} required`);
      return;
    }
    
    setDiscount(coupon.discount);
    alert(`Coupon applied! Discount: ₹${coupon.discount}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="border-b pb-3">
          <h3 className="font-semibold mb-2 text-gray-700">Items</h3>
          {cartItems.map(item => (
            <div key={item.product_id} className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.quantity}x {item.product_name}</span>
              <span className="font-medium text-gray-900">₹{(item.product_price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 py-3 border-b border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className={shippingFee === 0 ? 'text-eco-600 font-semibold' : 'font-medium text-gray-900'}>
              {shippingFee === 0 ? '🎉 FREE' : `₹${shippingFee}`}
            </span>
          </div>
          {discountApplied > 0 && (
            <div className="flex justify-between text-sm text-eco-600 font-semibold">
              <span>Discount</span>
              <span>-₹{discountApplied.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between font-bold text-lg pt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-eco-600 text-xl">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="mt-6 p-4 bg-eco-50 rounded-xl border border-eco-200">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Have a coupon?</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-500 focus:border-eco-500 outline-none transition-all"
          />
          <button
            onClick={applyCoupon}
            className="px-4 py-2 bg-eco-600 text-white font-medium rounded-lg hover:bg-eco-700 transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
        {discountApplied > 0 && (
          <p className="text-sm text-eco-700 mt-2 font-medium">
            ✅ Discount of ₹{discountApplied} applied!
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="mt-6 p-4 bg-eco-50 rounded-xl border border-eco-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm font-medium text-eco-800">Secure checkout</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">♻️</span>
          <p className="text-sm font-medium text-eco-800">Eco-friendly products</p>
        </div>
      </div>
    </div>
  );
}
