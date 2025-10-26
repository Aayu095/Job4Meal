'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Target, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-neutral-50 to-primary-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-gradient-to-r from-primary-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                About Job4Meal
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 mb-6 leading-tight">
                Our Mission: <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Dignity Through Work
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mx-auto">
                Job4Meal is more than a platform—it's a movement to transform how communities support each other. We believe everyone deserves the dignity of earning their meal, not begging for it.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-8">The Story Behind Job4Meal</h2>
            <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
              <p className="text-xl leading-relaxed">
                In communities worldwide, millions face food insecurity daily. Traditional aid often creates dependency rather than empowerment. We asked ourselves: <strong className="text-primary-600">What if we could turn aid into opportunity?</strong>
              </p>
              <p className="text-xl leading-relaxed">
                Job4Meal was born from this simple yet powerful idea: connect people who need meals with meaningful micro-tasks they can complete with dignity. Every task completed is a step toward independence, every meal earned is a victory for self-respect.
              </p>
              <p className="text-xl leading-relaxed">
                We partner with NGOs, restaurants, and community organizations to create a network of verified tasks and meal redemption points. Workers earn meal credits by completing tasks that genuinely help their communities—from deliveries to community cleanup, from helping elderly neighbors to supporting local businesses.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-neutral-900 mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Core Values
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="card bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-4 rounded-xl">
                    <Heart className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Dignity First</h3>
                    <p className="text-neutral-700">
                      We believe every person deserves respect. Earning a meal through work preserves dignity and builds self-worth.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-4 rounded-xl">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Community Driven</h3>
                    <p className="text-neutral-700">
                      We strengthen communities by connecting neighbors and creating mutual support networks.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-4 rounded-xl">
                    <Target className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Transparency</h3>
                    <p className="text-neutral-700">
                      Every task is verified, every transaction is tracked, and impact is measured openly.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-4 rounded-xl">
                    <Globe className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">Sustainable Impact</h3>
                    <p className="text-neutral-700">
                      We build pathways to independence, not perpetual aid. Skills gained today lead to opportunities tomorrow.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Built by Changemakers</h2>
              <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed max-w-3xl mx-auto">
                Our team combines expertise in technology, social work, and community development to create meaningful change.
              </p>
            </div>
            
            <div className="flex justify-center gap-8 mb-12">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-5xl">👥</span>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-5xl">🤝</span>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-5xl">💼</span>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-neutral-50 to-neutral-100 border-2 border-neutral-200 text-center">
              <p className="text-xl text-neutral-800 leading-relaxed font-medium">
                We're social entrepreneurs, developers, and community organizers united by one goal: 
                <span className="block mt-3 text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                  Transforming aid into empowerment
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
