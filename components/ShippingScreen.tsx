'use client';

import { useState } from 'react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { validateAddressForm } from '@/utils/validation';
import { motion } from 'motion/react';
import CartSummary from './CartSummary';
import { StickyActionButtons } from './StickyActionButtons';

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
  const { shippingAddress, updateAddress, setCurrentStep, savedAddresses, addAddress, selectAddress, selectedAddressId } = useCheckoutStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateAddress({ [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = async () => {
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const validation = validateAddressForm(shippingAddress);
    
    if (validation.isValid) {
      if (saveAddress) {
        addAddress(shippingAddress);
      }
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
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32"
    >
      <div className="lg:col-span-2 space-y-8">
        {/* Saved Addresses Section */}
        {savedAddresses.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h3>
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  onClick={() => selectAddress(addr.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAddressId === addr.id ? 'border-eco-500 bg-eco-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pinCode}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
          
          <div className="space-y-6">
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

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="w-5 h-5 accent-eco-600 rounded"
              />
              <span className="text-sm text-gray-700">Save this address for future use</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <CartSummary />
      </div>

      <StickyActionButtons 
        onBack={() => setCurrentStep('cart')}
        onNext={handleNext}
        isProcessing={isValidating}
        nextLabel="Continue to Payment"
      />
    </motion.div>
  );
}
