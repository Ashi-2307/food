"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, CreditCard, Phone, User, Trash2, Plus, Minus } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function Checkout() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setName(session.user.user_metadata?.full_name || '');
      }
    });
  }, []);

  const subtotal = getTotal();
  const deliveryFee = 2;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to place an order');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Save order to Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([
          { 
            user_id: user.id, 
            items: items, 
            total_amount: total, 
            address: `${address}, Zip: ${zip}`,
            status: 'pending' 
          }
        ]);
      
      if (error) throw error;

      // 2. Clear cart and redirect
      clearCart();
      router.push('/order-confirmation');
    } catch (error: any) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onLoginClick={() => {}} />
        <div className="pt-32 max-w-7xl mx-auto px-4 text-center">
          <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some delicious food to get started!</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={() => {}} />
      
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                Delivery Address
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" id="checkout-form" onSubmit={handlePlaceOrder}>
                <div className="md:col-span-2 relative">
                  <User className="absolute left-4 top-4.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-4.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Zip Code" 
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium" 
                  />
                </div>
                <div className="md:col-span-2">
                  <textarea 
                    placeholder="Complete Delivery Address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                    rows={3} 
                    className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Credit Card', 'Cash on Delivery', 'Apple Pay'].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-5 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all border-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="payment" className="w-5 h-5 text-primary accent-primary" defaultChecked={method === 'Credit Card'} />
                    <span className="font-bold text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-gray-50 px-3 py-1 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-primary transition-colors"><Minus className="h-4 w-4" /></button>
                          <span className="text-sm font-black text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-primary transition-colors"><Plus className="h-4 w-4" /></button>
                        </div>
                        <p className="text-base font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 text-gray-500 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span className="text-primary tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-10 bg-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:bg-gray-300 flex items-center justify-center gap-3 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  `Place Order`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
