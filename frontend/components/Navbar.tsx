"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const cartItemsCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-black text-primary italic tracking-tighter">
              Tomato
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                placeholder="Search for restaurant, cuisine or a dish"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Hi, {displayName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 font-bold"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-gray-600 hover:text-primary font-bold transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={onLoginClick}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  Sign up
                </button>
              </>
            )}
            
            <Link href="/checkout" className="relative text-gray-600 hover:text-primary transition-transform hover:scale-110">
              <ShoppingCart className="h-7 w-7" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/checkout" className="relative text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-gray-50 text-gray-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-100 px-6 pt-4 pb-10 space-y-4"
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2 text-gray-900 font-bold border-b border-gray-50 mb-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg">Hi, {displayName}</span>
                    <span className="text-xs text-gray-400 font-medium">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-lg font-bold text-gray-600 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 text-lg font-bold text-gray-600"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2 text-lg font-bold text-primary"
                >
                  Sign up
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
