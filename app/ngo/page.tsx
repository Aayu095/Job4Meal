'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getAllOrganizations, getTasksByOrg, getTasksByStatus, getPendingRedemptions } from '@/lib/db';
import { Task, Organization, Redemption } from '@/lib/types';
import { Utensils, Plus, ClipboardList, CheckCircle, LogOut, AlertCircle } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NGODashboard() {
  const router = useRouter();
  const { user, loading } = useAppStore();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<Task[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<Redemption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If not loading and no user, redirect to auth
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }

    // If wrong role, redirect home
    if (user.role !== 'ngo') {
      router.push('/');
      return;
    }

    // User is authenticated and has correct role, load data
    loadData();
  }, [user, loading, router]);

  const loadData = async () => {
    if (!user) return;

    try {
      // For demo: get first organization (in production, link user to org)
      const orgs = await getAllOrganizations();
      const userOrg = orgs[0]; // Demo: use first org
      setOrganization(userOrg);

      if (userOrg) {
        const [orgTasks, pendingTasks, redemptions] = await Promise.all([
          getTasksByOrg(userOrg.id),
          getTasksByStatus('submitted'),
          getPendingRedemptions(),
        ]);
        setTasks(orgTasks);
        setPendingVerifications(pendingTasks);
        setPendingRedemptions(redemptions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear user from store
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

  const activeTasks = tasks.filter((t) => t.status === 'open' || t.status === 'claimed').length;
  const completedTasks = tasks.filter((t) => t.status === 'verified').length;

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
              <Link 
                href="/ngo/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <span className="font-medium">{organization?.name || user.name}</span>
              </Link>
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">NGO Dashboard</h1>
            <p className="text-xl text-neutral-600">Welcome back, {organization?.name || 'Partner'}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-white">
            <div className="text-sm font-semibold text-neutral-600 mb-2">Total Tasks</div>
              <div className="text-4xl font-bold text-neutral-900">{tasks.length}</div>
            </div>
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <div className="text-sm font-semibold text-blue-900 mb-2">Active Tasks</div>
              <div className="text-4xl font-bold text-blue-600">{activeTasks}</div>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <div className="text-sm font-semibold text-green-900 mb-2">Completed Tasks</div>
              <div className="text-4xl font-bold text-green-600">{completedTasks}</div>
            </div>
            <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="text-sm font-semibold text-orange-900 mb-2">Pending Verifications</div>
              <div className="text-4xl font-bold text-orange-600">
                {pendingVerifications.length}
              </div>
            </div>
          </div>

        {/* Alerts */}
          {pendingVerifications.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-bold text-orange-900 text-lg">
                    {pendingVerifications.length} task{pendingVerifications.length > 1 ? 's' : ''} waiting for verification
                  </p>
                  <Link href="/ngo/verify" className="text-orange-700 font-semibold underline text-sm hover:text-orange-800">
                    Review submissions →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {pendingRedemptions.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3">
                <Utensils className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-bold text-blue-900 text-lg">
                    {pendingRedemptions.length} meal redemption{pendingRedemptions.length > 1 ? 's' : ''} pending
                  </p>
                  <Link href="/ngo/redemptions" className="text-blue-700 font-semibold underline text-sm hover:text-blue-800">
                    Process redemptions →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/ngo/create-task" className="card bg-white hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-200">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-4 rounded-xl">
                  <Plus className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-900">Create New Task</h3>
                  <p className="text-sm text-neutral-600">Post a microtask for workers</p>
                </div>
              </div>
            </Link>

            <Link href="/ngo/verify" className="card bg-white hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-200">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-900">Verify Submissions</h3>
                  <p className="text-sm text-neutral-600">
                    Review completed work ({pendingVerifications.length})
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/ngo/tasks" className="card bg-white hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-neutral-900">Manage Tasks</h3>
                  <p className="text-sm text-neutral-600">View all posted tasks</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Tasks */}
          <div className="card bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Recent Tasks</h2>
              <Link href="/ngo/tasks" className="text-primary-600 hover:text-primary-700 font-bold">
                View All →
              </Link>
            </div>

          {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-neutral-700 text-xl font-semibold mb-4">No tasks created yet</p>
                <Link href="/ngo/create-task" className="btn-primary inline-block">
                  Create Your First Task
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="border-2 border-neutral-200 rounded-xl p-5 hover:bg-neutral-50 hover:border-primary-200 transition-all">
                  <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900">{task.title}</h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {task.status === 'open' && '✓ Available for workers'}
                          {task.status === 'claimed' && `👤 Claimed by ${task.claimedByName}`}
                          {task.status === 'submitted' && '⏳ Waiting for verification'}
                          {task.status === 'verified' && '✅ Completed'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-primary-600 mb-1">
                          {task.rewardMeals}
                        </div>
                        <div className="text-xs text-neutral-600 mb-2">meals</div>
                        <div className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          task.status === 'open' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'claimed' ? 'bg-yellow-100 text-yellow-700' :
                          task.status === 'submitted' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
