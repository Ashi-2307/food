"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  // In a real app, you would fetch the order details from the backend/supabase
  const orderDetails = {
    id: '#ORD-782910',
    total: 35.50,
    address: '123 Burger St, New York, NY 10001',
    estimatedTime: '30-45 min',
    items: ['Whopper Junior x2', 'French Fries x1']
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar onLoginClick={() => {}} />
      
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-10 text-lg">Your delicious meal is on its way to you.</p>

        <div className="bg-gray-50 rounded-3xl p-8 text-left space-y-6 mb-10 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-gray-500 font-medium">Order ID</span>
            <span className="font-bold text-gray-900">{orderDetails.id}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Items Ordered</p>
                <p className="text-gray-700 font-medium">{orderDetails.items.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Delivery Address</p>
                <p className="text-gray-700 font-medium">{orderDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Estimated Delivery</p>
                <p className="text-gray-700 font-medium">{orderDetails.estimatedTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total Paid</span>
            <span className="text-2xl font-bold text-primary">${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/"
            className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
          <button className="flex-1 border-2 border-gray-200 py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Track Order <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
