'use client';

import { useCheckoutStore } from '@/store/checkoutStore';
import { motion } from 'motion/react';
import CartSummary from './CartSummary';
import { ArrowLeft, CreditCard, Wallet, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';

export default function PaymentScreen() {
  const { 
    shippingAddress, 
    setCurrentStep, 
    paymentMethod, 
    setPaymentMethod,
    isProcessing,
    setIsProcessing,
    setOrderNumber
  } = useCheckoutStore();

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate 2-second payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Generate random order number like ORD-12345678
      const randomOrderNum = `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setOrderNumber(randomOrderNum);
      setCurrentStep('success');
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
            <button 
              onClick={() => setCurrentStep('shipping')}
              className="text-eco-600 hover:text-eco-700 text-sm font-bold underline underline-offset-4 cursor-pointer transition-colors"
            >
              Edit Address
            </button>
          </div>
          
          <div className="text-gray-600 space-y-2 bg-eco-50/50 p-5 rounded-xl border border-eco-100">
            <p className="font-bold text-gray-900 text-lg">{shippingAddress.fullName}</p>
            <p className="flex items-center gap-2">
              <span className="font-medium">{shippingAddress.phone}</span>
              <span className="text-gray-300">•</span>
              <span>{shippingAddress.email}</span>
            </p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
          
          <div className="space-y-4">
            <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'credit_card' ? 'border-eco-500 bg-eco-50 shadow-sm' : 'border-gray-100 hover:border-eco-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
                className="w-5 h-5 text-eco-600 border-gray-300 focus:ring-eco-500 cursor-pointer"
              />
              <div className="ml-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${paymentMethod === 'credit_card' ? 'bg-white border-eco-200 text-eco-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Credit / Debit Card</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'upi' ? 'border-eco-500 bg-eco-50 shadow-sm' : 'border-gray-100 hover:border-eco-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="w-5 h-5 text-eco-600 border-gray-300 focus:ring-eco-500 cursor-pointer"
              />
              <div className="ml-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${paymentMethod === 'upi' ? 'bg-white border-eco-200 text-eco-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">UPI</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'wallet' ? 'border-eco-500 bg-eco-50 shadow-sm' : 'border-gray-100 hover:border-eco-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="w-5 h-5 text-eco-600 border-gray-300 focus:ring-eco-500 cursor-pointer"
              />
              <div className="ml-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${paymentMethod === 'wallet' ? 'bg-white border-eco-200 text-eco-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Digital Wallet</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Amazon Pay, Mobikwik</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => setCurrentStep('shipping')}
            disabled={isProcessing}
            className="w-full sm:w-1/3 py-4 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full sm:w-2/3 bg-eco-600 hover:bg-eco-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait disabled:hover:scale-100 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck size={20} />
                Pay Securely
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </motion.div>
  );
}
