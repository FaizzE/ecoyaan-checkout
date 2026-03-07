'use client';

import { useCheckoutStore } from '@/store/checkoutStore';
import StepIndicator from '@/components/StepIndicator';
import CartScreen from '@/components/CartScreen';
import ShippingScreen from '@/components/ShippingScreen';
import PaymentScreen from '@/components/PaymentScreen';
import SuccessScreen from '@/components/SuccessScreen';
import { AnimatePresence } from 'motion/react';

export default function CheckoutClient() {
  const currentStep = useCheckoutStore((state) => state.currentStep);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">Ecoyaan</h1>
          <p className="text-gray-500 mt-2 font-medium">Secure Checkout</p>
        </div>

        {currentStep !== 'success' && <StepIndicator />}

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === 'cart' && <CartScreen key="cart" />}
            {currentStep === 'shipping' && <ShippingScreen key="shipping" />}
            {currentStep === 'payment' && <PaymentScreen key="payment" />}
            {currentStep === 'success' && <SuccessScreen key="success" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
