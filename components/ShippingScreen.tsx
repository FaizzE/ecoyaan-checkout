'use client';

import { useState } from 'react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { validateAddressForm } from '@/utils/validation';
import { motion } from 'motion/react';
import CartSummary from './CartSummary';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

// Custom Input Component for enhanced styling
const CustomInput = ({ label, error, value, onChange, required, ...props }: any) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    
    <input
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
        ${error 
          ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-300' 
          : 'border-gray-200 bg-white focus:border-eco-500 focus:ring-2 focus:ring-eco-200'
        }
        font-medium placeholder-gray-400 focus:outline-none`}
      {...props}
    />
    
    {error && (
      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-medium animate-slide-in">
        <span>⚠️</span>
        {error}
      </p>
    )}
  </div>
);

export default function ShippingScreen() {
  const { shippingAddress, updateAddress, setCurrentStep } = useCheckoutStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateAddress({ [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsValidating(true);
    
    // Simulate validation delay for UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const validation = validateAddressForm(shippingAddress);
    
    if (validation.isValid) {
      setIsValidating(false);
      setCurrentStep('payment');
    } else {
      setErrors(validation.errors);
      setIsValidating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <CustomInput
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="John Doe"
                  required
                />
              </div>

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={shippingAddress.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
                required
              />

              <CustomInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={shippingAddress.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="10-digit mobile number"
                maxLength={10}
                required
              />

              <CustomInput
                label="PIN Code"
                name="pinCode"
                value={shippingAddress.pinCode}
                onChange={handleChange}
                error={errors.pinCode}
                placeholder="6-digit PIN"
                maxLength={6}
                required
              />

              <CustomInput
                label="City"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="City"
                required
              />

              <div className="sm:col-span-2">
                <CustomInput
                  label="State"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep('cart')}
                disabled={isValidating}
                className="w-full sm:w-1/2 py-4 px-6 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft size={20} />
                Back to Cart
              </button>
              
              <button
                type="submit"
                disabled={isValidating}
                className="w-full sm:w-1/2 relative bg-eco-600 hover:bg-eco-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-wait disabled:hover:scale-100"
              >
                {isValidating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Validating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue to Payment
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </motion.div>
  );
}
