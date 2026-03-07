import { create } from 'zustand';
import { mockData } from '../data/mockData';

export type Step = 'cart' | 'shipping' | 'payment' | 'success';

export interface CartItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  // --- STATE ---
  
  // Cart items from mock data
  cartItems: CartItem[];
  
  // Shipping cost (free over 1500, otherwise 50)
  shippingFee: number;
  
  // Loyalty/coupon discount amount
  discountApplied: number;
  
  // Current checkout step: 'cart' | 'shipping' | 'payment' | 'success'
  currentStep: Step;
  
  // Shipping address form data
  shippingAddress: ShippingAddress;
  
  // Selected payment method
  paymentMethod: string;
  
  // Processing state (loading during payment)
  isProcessing: boolean;
  
  // Generated order number upon success
  orderNumber: string | null;
  
  // --- ACTIONS ---
  setCurrentStep: (step: Step) => void;
  updateAddress: (address: Partial<ShippingAddress>) => void;
  setPaymentMethod: (method: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setOrderNumber: (orderNumber: string) => void;
  setDiscount: (discount: number) => void;
  resetCheckout: () => void;
  
  /**
   * Calculate dynamic shipping fee
   * - Free shipping for orders > ₹1500
   * - Standard ₹50 shipping otherwise
   */
  calculateShippingFee: (subtotal: number) => number;
  
  /**
   * Calculate discount based on cart value
   */
  calculateDiscount: (subtotal: number) => number;
  
  /**
   * Get total with discount applied
   */
  getTotalPrice: () => number;
  
  getSubtotal: () => number;
}

const initialAddress: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  pinCode: '',
  city: '',
  state: '',
};

/**
 * Checkout Store Management using Zustand
 * 
 * This store manages the entire checkout flow state:
 * 1. Cart items and pricing
 * 2. Shipping address
 * 3. Current checkout step
 * 4. Payment method selection
 * 
 * Using Zustand for lightweight, efficient state management
 * instead of Context API or Redux
 */
export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  // --- STATE ---
  cartItems: mockData.cartItems,
  shippingFee: mockData.shipping_fee,
  discountApplied: mockData.discount_applied,
  currentStep: 'cart',
  shippingAddress: initialAddress,
  paymentMethod: 'credit_card',
  isProcessing: false,
  orderNumber: null,

  // --- ACTIONS ---
  setCurrentStep: (step) => set({ currentStep: step }),
  updateAddress: (address) => set((state) => ({ 
    shippingAddress: { ...state.shippingAddress, ...address } 
  })),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setOrderNumber: (orderNumber) => set({ orderNumber }),
  setDiscount: (discount) => set({ discountApplied: discount }),
  resetCheckout: () => set({
    currentStep: 'cart',
    shippingAddress: initialAddress,
    paymentMethod: 'credit_card',
    isProcessing: false,
    orderNumber: null,
    discountApplied: 0,
  }),

  calculateShippingFee: (subtotal) => {
    return subtotal > 1500 ? 0 : 50;
  },

  calculateDiscount: (subtotal) => {
    if (subtotal > 1500) return 150; // Free shipping + discount
    if (subtotal > 1000) return 50;
    return 0;
  },

  getSubtotal: () => {
    return get().cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  },

  getTotalPrice: () => {
    const subtotal = get().getSubtotal();
    const shippingFee = get().calculateShippingFee(subtotal);
    const discount = get().discountApplied || get().calculateDiscount(subtotal);
    return subtotal + shippingFee - discount;
  }
}));
