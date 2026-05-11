"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RestaurantCard from '@/components/RestaurantCard';
import AuthModal from '@/components/AuthModal';
import { useCartStore } from '@/store/useCartStore';
import { Filter } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const FEATURED_RESTAURANTS = [
  {
    id: '1',
    name: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    rating: 4.2,
    deliveryTime: '25-30 min',
    cuisines: ['Burgers', 'Fast Food', 'American'],
    isVeg: false,
    price: 15
  },
  {
    id: '2',
    name: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    deliveryTime: '30-40 min',
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    isVeg: true,
    price: 20
  },
  {
    id: '3',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    deliveryTime: '35-45 min',
    cuisines: ['Sushi', 'Japanese', 'Seafood'],
    isVeg: false,
    price: 35
  },
  {
    id: '4',
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    deliveryTime: '20-25 min',
    cuisines: ['Salads', 'Healthy', 'Vegan'],
    isVeg: true,
    price: 18
  },
  {
    id: '5',
    name: 'Taco Bell',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=800',
    rating: 4.0,
    deliveryTime: '20-30 min',
    cuisines: ['Mexican', 'Fast Food'],
    isVeg: false,
    price: 12
  },
  {
    id: '6',
    name: 'The Cheesecake Factory',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    deliveryTime: '40-50 min',
    cuisines: ['Desserts', 'American', 'Bakery'],
    isVeg: true,
    price: 25
  }
];

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (restaurant: typeof FEATURED_RESTAURANTS[0]) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      addItem({
        id: restaurant.id,
        name: restaurant.name,
        price: restaurant.price,
        image: restaurant.image,
      });
      alert(`${restaurant.name} added to cart!`);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <div className="pt-16">
        <Hero />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Popular Restaurants
          </h2>
          
          <div className="flex flex-wrap items-center gap-4">
            {['Filters', 'Rating: 4.0+', 'Pure Veg', 'Fast Delivery'].map((filter) => (
              <button key={filter} className="px-5 py-2.5 border border-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURED_RESTAURANTS.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              {...restaurant} 
              onAddToCart={() => handleAddToCart(restaurant)}
            />
          ))}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <footer className="bg-gray-50 border-t border-gray-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-4xl font-black text-primary italic mb-6 tracking-tighter">Tomato</p>
          <div className="flex justify-center gap-10 mb-8 text-gray-400 font-bold uppercase text-xs tracking-widest">
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
          </div>
          <p className="text-gray-400 font-medium">© 2026 Tomato Food Delivery. Crafted with love.</p>
        </div>
      </footer>
    </main>
  );
}
