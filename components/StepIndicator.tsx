'use client';

import { useCheckoutStore } from '@/store/checkoutStore';
import { Check } from 'lucide-react';

const steps = [
  { id: 'cart', label: 'Cart', number: 1 },
  { id: 'shipping', label: 'Shipping', number: 2 },
  { id: 'payment', label: 'Payment', number: 3 },
  { id: 'success', label: 'Success', number: 4 },
];

export default function StepIndicator() {
  const currentStep = useCheckoutStore((state) => state.currentStep);
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full py-6 mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
        
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-600 z-0 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isCurrent 
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? <Check size={20} /> : step.number}
              </div>
              <span 
                className={`absolute top-12 text-xs font-medium whitespace-nowrap ${
                  isCurrent ? 'text-emerald-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
