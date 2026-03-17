import React from 'react';
import { motion } from 'motion/react';

interface StickyActionButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isProcessing?: boolean;
}

export const StickyActionButtons: React.FC<StickyActionButtonsProps> = ({
  onBack,
  onNext,
  nextLabel = 'Continue',
  isNextDisabled = false,
  isProcessing = false,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-eco-100 p-4 shadow-soft z-50"
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-xl border border-eco-200 text-eco-700 font-medium hover:bg-eco-50 transition-colors cursor-pointer"
          >
            Back
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            disabled={isNextDisabled || isProcessing}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all cursor-pointer ${
              isNextDisabled || isProcessing
                ? 'bg-eco-300 cursor-not-allowed'
                : 'gradient-eco hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isProcessing ? 'Processing...' : nextLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};
