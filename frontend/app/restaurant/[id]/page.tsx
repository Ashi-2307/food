"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useCartStore } from '@/store/useCartStore';
import { Star, Clock, Search, Plus, Minus, Share2, Heart, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';

const RESTAURANT_DATA = {
  id: '1',
  name: 'Burger King',
  image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1200',
  rating: 4.2,
  reviewsCount: '1.2k',
  deliveryTime: '25-30 min',
  cuisines: ['Burgers', 'Fast Food', 'American'],
  address: '123 Burger St, New York, NY 10001',
  menu: [
    { id: 'm1', name: 'Whopper Junior', price: 12, description: 'Flame-grilled beef patty topped with tomatoes, fresh lettuce, mayo, ketchup, crunchy pickles, and sliced white onions.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', category: 'Recommended' },
    { id: 'm2', name: 'Crispy Chicken Sandwich', price: 10, description: 'A breaded, seasoned chicken fillet topped with fresh lettuce and creamy mayonnaise on a toasted sesame seed bun.', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=400', category: 'Recommended' },
    { id: 'm3', name: 'French Fries', price: 5, description: 'Our Great Tasting Fries are thickly cut and fried to a golden brown.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400', category: 'Sides' },
    { id: 'm4', name: 'Onion Rings', price: 6, description: 'Thick-cut onion rings are breaded and fried to a golden brown.', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=400', category: 'Sides' },
  ]
};

const TABS = ['Overview', 'Order Online', 'Reviews', 'Photos', 'Menu'];

export default function RestaurantDetail() {
  const [activeTab, setActiveTab] = useState('Order Online');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { items, addItem, updateQuantity } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('Recommended');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (item: any) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    }
  };

  const getItemQuantity = (id: string) => items.find(i => i.id === id)?.quantity || 0;

  return (
    <main className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[350px] md:h-[450px] rounded-3xl overflow-hidden mb-6">
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
            <img src={RESTAURANT_DATA.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="col-span-2 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-lg">View All Photos</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">{RESTAURANT_DATA.name}</h1>
            <p className="text-lg text-gray-500 mb-4">{RESTAURANT_DATA.cuisines.join(', ')}</p>
            <p className="text-gray-400 flex items-center gap-2">
              <Navigation className="h-4 w-4" /> {RESTAURANT_DATA.address} 
              <span className="text-primary font-bold cursor-pointer hover:underline ml-2">View on Map</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center bg-green-700 text-white px-3 py-1 rounded-lg text-xl font-black shadow-lg shadow-green-700/20 mb-1">
                {RESTAURANT_DATA.rating} <Star className="h-4 w-4 fill-current ml-1" />
              </div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{RESTAURANT_DATA.reviewsCount} Delivery Reviews</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"><Share2 className="h-5 w-5 text-gray-600" /></button>
              <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"><Heart className="h-5 w-5 text-gray-600" /></button>
            </div>
          </div>
        </div>

        <div className="sticky top-16 bg-white z-40 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-lg font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 pb-20">
          <div className="hidden lg:block w-64 flex-shrink-0 h-fit sticky top-40">
            <div className="space-y-1">
              {['Recommended', 'Sides', 'Beverages', 'Desserts'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                    activeCategory === cat ? 'bg-primary-light text-primary border-r-4 border-primary' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Search className="h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search within menu" className="bg-transparent border-none focus:outline-none w-full text-gray-700 font-medium" />
            </div>

            <div className="space-y-10">
              <h2 className="text-3xl font-black text-gray-900 mb-6">{activeCategory}</h2>
              {RESTAURANT_DATA.menu.filter(item => item.category === activeCategory).map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="flex flex-col md:flex-row gap-8 p-2 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 border border-green-600 flex items-center justify-center p-0.5"><div className="w-full h-full rounded-full bg-green-600"></div></div>
                      <span className="text-xs font-bold text-orange-500">BESTSELLER</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-xl font-black text-gray-800 mb-4">${item.price}</p>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{item.description}</p>
                  </div>
                  <div className="relative w-full md:w-48 h-48 md:h-40 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%]">
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center justify-between bg-white border border-primary rounded-xl p-2 shadow-2xl scale-105">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-primary hover:bg-primary/10 rounded-lg"><Minus className="h-4 w-4" /></button>
                          <span className="font-black text-primary text-lg">{getItemQuantity(item.id)}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-primary hover:bg-primary/10 rounded-lg"><Plus className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-white text-primary border border-primary py-2.5 rounded-xl font-extrabold shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95"
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  );
}
