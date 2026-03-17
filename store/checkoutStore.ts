import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pinCode: string;
  city: string;
  state: string;
}

export interface CheckoutState {
  // --- STATE ---
  cartItems: CartItem[];
  shippingFee: number;
  discountApplied: number;
  currentStep: Step;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  isProcessing: boolean;
  orderNumber: string | null;
  
  // Address Management
  savedAddresses: ShippingAddress[];
  selectedAddressId: string | null;

  // --- ACTIONS ---
  setCurrentStep: (step: Step) => void;
  updateAddress: (address: Partial<ShippingAddress>) => void;
  setPaymentMethod: (method: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setOrderNumber: (orderNumber: string) => void;
  setDiscount: (discount: number) => void;
  resetCheckout: () => void;
  
  // Address Actions
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;

  calculateShippingFee: (subtotal: number) => number;
  calculateDiscount: (subtotal: number) => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

const initialAddress: ShippingAddress = {
  id: 'temp',
  fullName: '',
  email: '',
  phone: '',
  pinCode: '',
  city: '',
  state: '',
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      cartItems: mockData.cartItems,
      shippingFee: mockData.shipping_fee,
      discountApplied: mockData.discount_applied,
      currentStep: 'cart',
      shippingAddress: initialAddress,
      paymentMethod: 'credit_card',
      isProcessing: false,
      orderNumber: null,
      savedAddresses: [],
      selectedAddressId: null,

      // --- ACTIONS ---
      setCurrentStep: (step) => set({ currentStep: step }),
      updateAddress: (address) => set((state) => ({ 
        shippingAddress: { ...state.shippingAddress, ...address } 
      })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setOrderNumber: (orderNumber) => set({ orderNumber }),
      setDiscount: (discount) => set({ discountApplied: discount }),
      
      addAddress: (address) => set((state) => {
        const newAddress = { ...address, id: Date.now().toString() };
        return { savedAddresses: [...state.savedAddresses, newAddress] };
      }),
      deleteAddress: (id) => set((state) => ({
        savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
        selectedAddressId: state.selectedAddressId === id ? null : state.selectedAddressId
      })),
      selectAddress: (id) => set((state) => {
        const address = state.savedAddresses.find((a) => a.id === id);
        return { 
          selectedAddressId: id,
          shippingAddress: address ? { ...address } : state.shippingAddress
        };
      }),

      resetCheckout: () => set({
        currentStep: 'cart',
        shippingAddress: initialAddress,
        paymentMethod: 'credit_card',
        isProcessing: false,
        orderNumber: null,
        discountApplied: 0,
      }),

      calculateShippingFee: (subtotal) => (subtotal > 1500 ? 0 : 50),
      calculateDiscount: (subtotal) => {
        if (subtotal > 1500) return 150;
        if (subtotal > 1000) return 50;
        return 0;
      },
      getSubtotal: () => get().cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0),
      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        const shippingFee = get().calculateShippingFee(subtotal);
        const discount = get().discountApplied || get().calculateDiscount(subtotal);
        return subtotal + shippingFee - discount;
      }
    }),
    {
      name: 'checkout-storage',
    }
  )
);
