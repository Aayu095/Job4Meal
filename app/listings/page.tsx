'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Clock, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function ListingsPage() {
  const { user } = useAppStore();
  // Mock data for demonstration
  const mockTasks = [
    {
      id: 1,
      title: 'Deliver groceries to elderly neighbor',
      organization: 'Community Care NGO',
      location: '2.3 km away',
      credits: 2,
      duration: '30 mins',
      category: 'Delivery'
    },
    {
      id: 2,
      title: 'Help with community garden cleanup',
      organization: 'Green Future Initiative',
      location: '1.5 km away',
      credits: 3,
      duration: '1-2 hours',
      category: 'Community Service'
    },
    {
      id: 3,
      title: 'Sort donations at local food bank',
      organization: 'Food For All',
      location: '3.1 km away',
      credits: 4,
      duration: '2-3 hours',
      category: 'Volunteer'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* Hero/Search Section */}
      <div className="bg-gradient-to-br from-green-50 to-primary-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6 text-center">Find Tasks Near You</h1>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
                <button className="btn-primary px-8 py-3">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-white border-2 border-neutral-300 rounded-full hover:border-primary-500 transition-colors">
              <Filter className="w-4 h-4 inline mr-2" />
              All Categories
            </button>
            <button className="px-6 py-2 bg-white border-2 border-neutral-300 rounded-full hover:border-primary-500 transition-colors">
              Delivery
            </button>
            <button className="px-6 py-2 bg-white border-2 border-neutral-300 rounded-full hover:border-primary-500 transition-colors">
              Community Service
            </button>
            <button className="px-6 py-2 bg-white border-2 border-neutral-300 rounded-full hover:border-primary-500 transition-colors">
              Volunteer
            </button>
          </div>

          {/* Task Cards */}
          <div className="space-y-6">
            {mockTasks.map((task) => (
              <div key={task.id} className="card bg-white hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-xl">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">{task.title}</h3>
                        <p className="text-neutral-600 mb-4">{task.organization}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            {task.location}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-4 h-4 text-green-500" />
                            {task.duration}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">{task.credits}</div>
                      <div className="text-sm text-neutral-600">meal credits</div>
                    </div>
                    <Link 
                      href="/auth?role=worker"
                      className="btn-primary px-8 py-3 whitespace-nowrap"
                    >
                      Accept Task
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Message - Only show if not logged in */}
          {!user && (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg mb-4">
                🔐 <strong>Login to see more tasks in your area</strong>
              </p>
              <Link href="/auth" className="btn-secondary px-8 py-3 inline-block">
                Sign Up / Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
