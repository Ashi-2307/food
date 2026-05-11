"use client";

import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920")' }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight">
            Tomato
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 font-medium">
            Find the best restaurants, cafés, and bars in New York
          </p>

          {/* Search Bar Container with Glassmorphism */}
          <div className="glass-effect rounded-2xl shadow-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto border border-white/30">
            {/* Location selector */}
            <div className="flex items-center px-4 py-3 bg-white rounded-xl md:w-1/3 border border-gray-100">
              <MapPin className="h-5 w-5 text-primary mr-3" />
              <input 
                type="text" 
                placeholder="New York, USA" 
                className="focus:outline-none text-gray-800 font-medium w-full bg-transparent"
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-gray-200 self-center" />

            {/* Search input */}
            <div className="flex flex-1 items-center px-4 py-3 bg-white rounded-xl border border-gray-100">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search for restaurant, cuisine or a dish" 
                className="focus:outline-none text-gray-800 font-medium w-full bg-transparent"
              />
            </div>
            
            <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-95">
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
