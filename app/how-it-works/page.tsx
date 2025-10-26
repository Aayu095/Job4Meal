'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, CheckCircle, Award, Shield, MapPin, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-neutral-50 to-primary-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-gradient-to-r from-primary-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              How It Works
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              How Job4Meal Works
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
              A simple, secure platform connecting meaningful work with meals
            </p>
          </motion.div>
        </div>
      </div>

      {/* For Workers Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-4 text-center">For Workers</h2>
              <p className="text-xl text-neutral-600 text-center mb-16">Earn meals through dignified work</p>
            </motion.div>

            <div className="space-y-20">
              {/* Step 1 */}
              <motion.div 
                className="flex flex-col md:flex-row gap-12 items-center md:items-start"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                    <span className="text-5xl font-bold text-white">1</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 hover:shadow-2xl transition-all">
                    <div className="flex items-start gap-6">
                      <div className="bg-green-500 p-4 rounded-2xl shadow-lg flex-shrink-0">
                        <Search className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Sign Up & Browse Tasks</h3>
                        <p className="text-lg text-neutral-700 leading-relaxed">
                          Create your free account in seconds. Browse verified tasks near you posted by trusted NGOs and local businesses. Filter by location, skill level, and meal credits offered.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex flex-col md:flex-row gap-12 items-center md:items-start"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-primary-400 to-primary-600 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                    <span className="text-5xl font-bold text-white">2</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300 hover:shadow-2xl transition-all">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary-500 p-4 rounded-2xl shadow-lg flex-shrink-0">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Accept & Complete Tasks</h3>
                        <p className="text-lg text-neutral-700 leading-relaxed">
                          Choose tasks that match your skills. Complete them with pride—from deliveries to community service, gardening to helping neighbors. Submit photo proof when done.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="flex flex-col md:flex-row gap-12 items-center md:items-start"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-teal-400 to-teal-600 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                    <span className="text-5xl font-bold text-white">3</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="card bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 hover:shadow-2xl transition-all">
                    <div className="flex items-start gap-6">
                      <div className="bg-teal-500 p-4 rounded-2xl shadow-lg flex-shrink-0">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Get Verified & Earn Credits</h3>
                        <p className="text-lg text-neutral-700 leading-relaxed">
                          Task providers verify your work. Once approved, meal credits are added to your account instantly. Redeem at partner restaurants and community kitchens.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* For Organizations Section */}
      <div className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-4 text-center">For NGOs & Partners</h2>
              <p className="text-xl text-neutral-600 text-center mb-16">Create opportunities in your community</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="card bg-white text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Post Tasks</h3>
                <p className="text-neutral-700">
                  Create verified tasks for your community. Set meal credit values and requirements.
                </p>
              </motion.div>

              <motion.div 
                className="card bg-white text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Review Work</h3>
                <p className="text-neutral-700">
                  Workers submit proof. You verify completion and approve meal credits.
                </p>
              </motion.div>

              <motion.div 
                className="card bg-white text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Track Impact</h3>
                <p className="text-neutral-700">
                  See real-time analytics on tasks completed and meals provided.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Trust */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">Safety & Trust</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Verified Organizations</h3>
                  <p className="text-neutral-700">All task providers are vetted NGOs and registered businesses</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
                  <p className="text-neutral-700">Your data is encrypted and protected with industry-standard security</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Photo Verification</h3>
                  <p className="text-neutral-700">Proof of work ensures accountability for everyone</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Community Support</h3>
                  <p className="text-neutral-700">24/7 help available through our support channels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
