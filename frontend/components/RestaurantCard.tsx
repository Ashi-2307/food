"use client";

import React from 'react';
import { Star, Clock, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisines: string[];
  isVeg?: boolean;
  onAddToCart: () => void;
}

const RestaurantCard = ({ 
  id,
  name, 
  image, 
  rating, 
  deliveryTime, 
  cuisines, 
  isVeg,
  onAddToCart 
}: RestaurantCardProps) => {
  return (
    <Link href={`/restaurant/${id}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="group bg-white rounded-2xl overflow-hidden card-shadow p-3 cursor-pointer"
      >
        <div className="relative h-56 rounded-xl overflow-hidden mb-4">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 z-10">
            <button 
              onClick={(e) => { e.preventDefault(); /* Favorite logic */ }}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-primary transition-all shadow-sm"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute bottom-3 left-3 flex gap-2">
            {isVeg && (
              <div className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                Pure Veg
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              Free Delivery
            </div>
          </div>
        </div>

        <div className="px-1 pb-2">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded-lg text-sm font-bold shadow-sm">
              {rating} <Star className="h-3 w-3 fill-current ml-1" />
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <p className="line-clamp-1 flex-1 font-medium">{cuisines.join(', ')}</p>
            <div className="flex items-center font-bold text-gray-700 ml-4">
              <Clock className="h-4 w-4 mr-1 text-primary" />
              {deliveryTime}
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default RestaurantCard;
