'use client';

import { useAppStore } from '@/lib/store';
import { CheckCircle, Shield, Users, Play, ArrowRight, TrendingUp, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { user, loading } = useAppStore();

  // Don't automatically redirect - let users view the homepage even when logged in
  // They can navigate to their dashboard via the header

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-neutral-50 to-primary-50 pt-8 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 mb-6 leading-tight">
                Turn Small Tasks Into <span className="text-primary-500">Meaningful Meals</span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-700 mb-8 leading-relaxed max-w-2xl">
                Connect with your community. Complete verified tasks. Earn meal credits. Build dignity through meaningful work.
              </p>

              {/* CTA Buttons - Dynamic based on auth state */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {!user ? (
                  // Not logged in - Show both buttons
                  <>
                    <Link href="/auth?role=worker" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group">
                      Start Helping Today
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/listings" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group">
                      Find Tasks Near Me
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                ) : (
                  // Logged in - Show only Find Tasks
                  <Link href="/listings" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group">
                    Find Tasks Near Me
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                className="flex flex-wrap gap-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-neutral-700">Verified Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-neutral-700">Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  <span className="font-medium text-neutral-700">Community Driven</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-green-100 to-primary-100 rounded-3xl p-8 shadow-2xl">
                {/* Hero Illustration Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-primary-50">
                  <Image
                    src="/images/hero-illustration.jpg"
                    alt="Job4Meal - Verified Tasks and Meal Rewards"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Simple steps to transform tasks into meals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="card text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
                <div className="text-6xl mb-4 mt-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">Find Tasks</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Browse verified tasks in your area. From deliveries to community service, choose what fits your skills.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="card text-center bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
                <div className="text-6xl mb-4 mt-4">✅</div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">Complete Work</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Complete the task with dignity. Submit proof of completion through our secure platform.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="card text-center bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
                <div className="text-6xl mb-4 mt-4">🍱</div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900">Earn Meals</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Get verified and earn meal credits. Redeem at partner restaurants and community kitchens.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Before/After Comparison Section - SIMPLE & CLEAN */}
      <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Breaking the Cycle of Dependency
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Traditional aid vs. Job4Meal's empowerment model
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Aid */}
            <motion.div 
              className="bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-bold mb-2">
                  ❌ Traditional Aid
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold text-red-300">Temporary Relief</p>
                    <p className="text-sm text-neutral-400">Food today, hunger tomorrow</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <p className="font-semibold text-red-300">Creates Dependency</p>
                    <p className="text-sm text-neutral-400">No path to self-sufficiency</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">😔</span>
                  <div>
                    <p className="font-semibold text-red-300">Loss of Dignity</p>
                    <p className="text-sm text-neutral-400">Handouts, not opportunities</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📉</span>
                  <div>
                    <p className="font-semibold text-red-300">No Skills Development</p>
                    <p className="text-sm text-neutral-400">No resume building</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Job4Meal Model */}
            <motion.div 
              className="bg-green-900/20 border-2 border-green-500/50 rounded-2xl p-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full font-bold mb-2">
                  ✅ Job4Meal Model
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💼</span>
                  <div>
                    <p className="font-semibold text-green-300">Sustainable Income</p>
                    <p className="text-sm text-neutral-400">Earn through verified work</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔓</span>
                  <div>
                    <p className="font-semibold text-green-300">Builds Independence</p>
                    <p className="text-sm text-neutral-400">Self-sustaining economic loop</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <p className="font-semibold text-green-300">Preserves Dignity</p>
                    <p className="text-sm text-neutral-400">Work, not charity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <p className="font-semibold text-green-300">Career Growth</p>
                    <p className="text-sm text-neutral-400">Build experience & skills</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-2xl font-bold text-green-400">
              "Not a handout. A hand up."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                See Job4Meal in Action
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Watch how we're transforming lives through dignity and work
              </p>
            </div>

            {/* Local Video Player */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-100 to-green-100 border-4 border-primary-200">
              <div className="aspect-video bg-black">
                <video 
                  className="w-full h-full object-cover"
                  controls
                  poster="/images/hero-illustration.jpg"
                  preload="metadata"
                >
                  <source src="/videos/demo-video.mp4" type="video/mp4" />
                  <source src="/videos/demo-video.webm" type="video/webm" />
                  {/* Fallback message for browsers that don't support video */}
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <div className="text-center text-white p-8">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-semibold mb-2">Video Not Available</p>
                      <p className="text-neutral-300 text-sm">
                        Please add your demo video as <span className="font-mono bg-black/30 px-2 py-1 rounded">demo-video.mp4</span> in the <span className="font-mono bg-black/30 px-2 py-1 rounded">public/videos/</span> folder
                      </p>
                    </div>
                  </div>
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why It Matters Section */}
      <div className="bg-gradient-to-br from-green-100 via-green-50 to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Why It Matters
            </h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              Building dignity through meaningful work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card text-center bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Dignity Over Dependency</h3>
              <p className="text-neutral-700 leading-relaxed">
                Every task is an opportunity to earn, not beg. We believe in empowerment through work, not handouts.
              </p>
            </div>

            <div className="card text-center bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Community Building</h3>
              <p className="text-neutral-700 leading-relaxed">
                Connect neighbors, strengthen communities, and create sustainable support networks that last.
              </p>
            </div>

            <div className="card text-center bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-600">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">Skills & Experience</h3>
              <p className="text-neutral-700 leading-relaxed">
                Build your resume, gain work experience, and open doors to future opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 text-neutral-900 animate-fade-in">
              Our Growing Impact
            </h3>
            <p className="text-xl text-center text-neutral-600 mb-12">
              Every task transforms a life. Join our growing community.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card text-center bg-white border-2 border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
                <AnimatedCounter 
                  end={150} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-extrabold text-primary-600"
                />
                <div className="text-neutral-700 mt-3 font-semibold">🍱 Meals Earned</div>
              </div>
              <div className="card text-center bg-white border-2 border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-300">
                <AnimatedCounter 
                  end={75} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-extrabold text-green-600"
                />
                <div className="text-neutral-700 mt-3 font-semibold">✅ Tasks Completed</div>
              </div>
              <div className="card text-center bg-white border-2 border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
                <AnimatedCounter 
                  end={50} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-extrabold text-teal-600"
                />
                <div className="text-neutral-700 mt-3 font-semibold">👥 Active Workers</div>
              </div>
              <div className="card text-center bg-white border-2 border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-500">
                <AnimatedCounter 
                  end={10} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-extrabold text-neutral-700"
                />
                <div className="text-neutral-700 mt-3 font-semibold">🤝 NGO Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials - Human Impact Stories */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 animate-fade-in">
              Stories of Transformation
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Hear from workers who transformed their lives through dignity and work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl">
                  👨‍🌾
                </div>
                <div>
                  <h4 className="font-bold text-lg text-neutral-900">Rajesh Kumar</h4>
                  <p className="text-sm text-neutral-600">Daily Wage Worker • Mumbai</p>
                </div>
              </div>
              <p className="text-neutral-700 leading-relaxed italic mb-4">
                "I used to beg for food. Now I earn it. Last month I completed 12 tasks and fed my family for 2 weeks. This gave me back my dignity."
              </p>
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>18 meals earned</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-3xl">
                  👩‍💼
                </div>
                <div>
                  <h4 className="font-bold text-lg text-neutral-900">Priya Sharma</h4>
                  <p className="text-sm text-neutral-600">Single Mother • Delhi</p>
                </div>
              </div>
              <p className="text-neutral-700 leading-relaxed italic mb-4">
                "Between jobs, Job4Meal kept my kids fed. The flexible tasks fit my schedule. Now I have work experience to show employers."
              </p>
              <div className="flex items-center gap-2 text-primary-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>25 meals earned</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-3xl">
                  🧑‍🎓
                </div>
                <div>
                  <h4 className="font-bold text-lg text-neutral-900">Amit Patel</h4>
                  <p className="text-sm text-neutral-600">Student • Bangalore</p>
                </div>
              </div>
              <p className="text-neutral-700 leading-relaxed italic mb-4">
                "As a student, I couldn't afford meals. Job4Meal let me work 2 hours and eat for the day. It's not charity—it's opportunity."
              </p>
              <div className="flex items-center gap-2 text-teal-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>32 meals earned</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 animate-fade-in animation-delay-800">
            <p className="text-2xl font-bold text-neutral-900 mb-2">
              "Dignity in every meal earned."
            </p>
            <p className="text-neutral-600">— The Job4Meal Promise</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
