'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getOpenTasks, getTasksByUser } from '@/lib/db';
import { Task } from '@/lib/types';
import { User, Phone, MapPin, Calendar, Award, Utensils, Edit2, LogOut, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDateTime, formatDistance, calculateDistance, getStatusColor } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import NotificationBell from '@/components/NotificationBell';

export default function WorkerProfilePage() {
  const router = useRouter();
  const { user, loading } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/auth?role=worker');
      return;
    }
    if (user.role !== 'worker') {
      router.push('/');
      return;
    }
    
    loadAllTasks();
  }, [user, loading, router]);

  const loadAllTasks = async () => {
    if (!user) return;
    
    try {
      const [open, userTasks] = await Promise.all([
        getOpenTasks(),
        getTasksByUser(user.uid)
      ]);
      setAvailableTasks(open.slice(0, 3)); // Show only 3 available tasks
      setMyTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      useAppStore.getState().setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header - Matching main site */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary-500 to-green-500 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                Job4Meal
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <NotificationBell count={3} animated={true} />
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Wallet Section */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-green-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white/80 text-sm mb-2">Your Meal Credits</p>
                <div className="flex items-center gap-3">
                  <Utensils className="w-10 h-10" />
                  <span className="text-6xl font-bold">{user.wallet.mealCredits}</span>
                </div>
                <p className="text-white/70 text-sm mt-2">Available to redeem</p>
              </div>
              <Link href="/worker/redeem" className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105">
                Redeem Meals →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header Card */}
        <div className="card bg-gradient-to-br from-primary-50 to-green-50 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{user.name}</h1>
              <p className="text-neutral-600 mb-3">Worker Profile</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="badge bg-green-100 text-green-700">
                  ✓ Verified
                </span>
                <span className="badge bg-primary-100 text-primary-700">
                  <Utensils className="w-4 h-4 inline mr-1" />
                  {user.wallet.mealCredits} Credits
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary px-6 py-3 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contact Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Phone</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone || 'Not provided'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Location</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Account Statistics
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Member Since</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{user.createdAt ? formatDate(user.createdAt) : 'Recently joined'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Total Meal Credits Earned</label>
                <div className="text-3xl font-bold text-primary-600">
                  {user.wallet.mealCredits}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Account Status</label>
                <span className="badge bg-green-100 text-green-700">
                  {user.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Achievements & Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <div className="text-4xl mb-2">🌟</div>
              <div className="font-bold text-green-900">First Task</div>
              <div className="text-xs text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-primary-900">5 Tasks</div>
              <div className="text-xs text-primary-700">Milestone</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border-2 border-teal-200">
              <div className="text-4xl mb-2">💪</div>
              <div className="font-bold text-teal-900">Reliable</div>
              <div className="text-xs text-teal-700">100% Complete</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-xl border-2 border-gray-200 opacity-50">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-bold text-gray-600">Top Earner</div>
              <div className="text-xs text-gray-500">Locked</div>
            </div>
          </div>
        </div>

        {/* My Tasks Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">My Tasks</h2>
            <span className="badge bg-primary-100 text-primary-700">
              {myTasks.length} Total
            </span>
          </div>

          {loadingTasks ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-neutral-700 text-lg font-semibold mb-2">No tasks claimed yet</p>
              <p className="text-neutral-600 mb-4">Start by browsing available tasks below</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.slice(0, 5).map((task) => (
                <Link
                  key={task.id}
                  href={`/worker/task/${task.id}`}
                  className="block border-2 border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:border-primary-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${getStatusColor(task.status)}`}>
                          {task.status.toUpperCase()}
                        </span>
                        {task.status === 'verified' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">
                        {task.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span>Created {formatDateTime(task.createdAt)}</span>
                      </div>

                      {task.status === 'verified' && task.verifiedAt && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified {formatDateTime(task.verifiedAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className={`rounded-xl p-4 ${task.status === 'verified' ? 'bg-green-100' : 'bg-primary-100'}`}>
                        <Utensils className={`w-8 h-8 mx-auto mb-1 ${task.status === 'verified' ? 'text-green-600' : 'text-primary-600'}`} />
                        <div className={`text-2xl font-bold ${task.status === 'verified' ? 'text-green-600' : 'text-primary-600'}`}>
                          {task.rewardMeals}
                        </div>
                        <div className={`text-xs ${task.status === 'verified' ? 'text-green-700' : 'text-primary-700'}`}>
                          {task.status === 'verified' ? 'earned' : 'meals'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Available Tasks Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Available Tasks Near You</h2>
            <Link href="/listings" className="text-primary-600 hover:text-primary-700 font-bold">
              View All →
            </Link>
          </div>

          {loadingTasks ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : availableTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-neutral-700 text-lg font-semibold mb-2">No tasks available at the moment</p>
              <p className="text-neutral-600">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {availableTasks.map((task) => {
                const distance = user.location
                  ? calculateDistance(
                      user.location.lat,
                      user.location.lng,
                      task.location.lat,
                      task.location.lng
                    )
                  : 0;

                return (
                  <Link
                    key={task.id}
                    href={`/worker/task/${task.id}`}
                    className="block card bg-white hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-200"
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                          {task.title}
                        </h3>
                        <p className="text-neutral-700 mb-4 leading-relaxed">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            <span className="font-medium">{formatDistance(distance)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Due {formatDate(task.dueBy)}</span>
                          </div>
                        </div>
                        
                        {task.postedByOrgName && (
                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <p className="text-sm text-neutral-600">
                              Posted by <span className="font-semibold text-neutral-900">{task.postedByOrgName}</span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-6 border-2 border-primary-200">
                          <Utensils className="w-10 h-10 text-primary-600 mx-auto mb-2" />
                          <div className="text-4xl font-bold text-primary-600">
                            {task.rewardMeals}
                          </div>
                          <div className="text-sm font-semibold text-primary-700">meal credits</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
