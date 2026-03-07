'use client';

import { useCheckoutStore } from '@/store/checkoutStore';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Truck, Home, ShoppingBag } from 'lucide-react';

// More detailed tracking in SuccessScreen
const OrderTimeline = ({ currentStatus }: { currentStatus: number }) => {
  const statuses = [
    { step: 1, name: 'Processing', icon: '📦', description: 'Your order is being prepared' },
    { step: 2, name: 'Shipped', icon: '🚚', description: 'Package sent to delivery partner' },
    { step: 3, name: 'In Transit', icon: '🚛', description: 'On its way to you' },
    { step: 4, name: 'Delivered', icon: '✅', description: 'Order delivered' },
  ];

  return (
    <div className="space-y-0">
      {statuses.map((status, idx) => (
        <div key={status.step} className="flex gap-6">
          <div className={`flex flex-col items-center ${idx !== statuses.length - 1 ? 'pb-2' : ''}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border-4 border-white z-10
              ${currentStatus >= status.step 
                ? 'bg-eco-600 text-white' 
                : 'bg-gray-100 text-gray-400'
              }`}>
              {status.icon}
            </div>
            {idx !== statuses.length - 1 && (
              <div className={`w-1 h-16 -mt-2 ${currentStatus > status.step ? 'bg-eco-600' : 'bg-gray-100'}`}></div>
            )}
          </div>
          <div className="pt-3 pb-8">
            <h4 className={`font-bold text-lg ${currentStatus >= status.step ? 'text-gray-900' : 'text-gray-500'}`}>{status.name}</h4>
            <p className="text-sm text-gray-500 font-medium mt-1">{status.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SuccessScreen() {
  const { 
    orderNumber, 
    shippingAddress, 
    cartItems, 
    getTotalPrice,
    resetCheckout
  } = useCheckoutStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-eco-600 p-10 text-center text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10 animate-pulse-ring"
          >
            <CheckCircle2 size={70} className="text-eco-500" />
          </motion.div>
          
          <h1 className="text-4xl font-extrabold mb-3 relative z-10">Order Successful! 🎉</h1>
          <p className="text-eco-100 text-xl font-medium relative z-10">Thank you for choosing sustainable products.</p>
          
          <div className="mt-8 inline-block bg-eco-800/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-eco-400/30 relative z-10 shadow-lg">
            <p className="text-sm text-eco-100 mb-1 font-medium uppercase tracking-wider">Order Number</p>
            <p className="font-mono font-bold text-2xl tracking-widest">{orderNumber}</p>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Track Order</h3>
              <OrderTimeline currentStatus={1} />
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">Delivery Details</h3>
                <div className="text-gray-600 space-y-2">
                  <p className="font-bold text-gray-900 text-lg">{shippingAddress.fullName}</p>
                  <p className="font-medium">{shippingAddress.phone}</p>
                  <p className="font-medium">{shippingAddress.email}</p>
                  <p className="mt-3 pt-3 border-t border-gray-200 font-medium">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">Order Summary</h3>
                <ul className="space-y-3 mb-6">
                  {cartItems.map(item => (
                    <li key={item.product_id} className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">{item.quantity}x {item.product_name}</span>
                      <span className="font-bold text-gray-900">₹{(item.product_price * item.quantity).toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total Paid</span>
                  <span className="font-extrabold text-2xl text-eco-600">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center border-t border-gray-100 pt-10">
            <button
              onClick={resetCheckout}
              className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <ShoppingBag size={22} />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
