'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getDashboardMetrics, getAllUsers, getAllTasks, getAllOrganizations } from '@/lib/db';
import { DashboardMetrics, User, Task, Organization } from '@/lib/types';
import { Users, Briefcase, Utensils, Building2, TrendingUp, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAppStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?role=admin');
      return;
    }

    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      const [metricsData, usersData, tasksData, orgsData] = await Promise.all([
        getDashboardMetrics(),
        getAllUsers(),
        getAllTasks(),
        getAllOrganizations(),
      ]);
      
      setMetrics(metricsData);
      setUsers(usersData);
      setTasks(tasksData);
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demoUserId');
      await signOut(auth);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Job4Meal - Admin Dashboard</h1>
                <p className="text-sm text-gray-600">System Overview & Analytics</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loadingData ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics?.totalUsers || 0}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics?.totalTasks || 0}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Utensils className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {metrics?.totalMealsIssued || 0}
                </div>
                <div className="text-sm text-gray-600">Meals Issued</div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {organizations.length}
                </div>
                <div className="text-sm text-gray-600">Partner Organizations</div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="card bg-blue-50 border-blue-200">
                <div className="text-2xl font-bold text-blue-900 mb-1">
                  {metrics?.activeTasks || 0}
                </div>
                <div className="text-sm text-blue-700">Active Tasks</div>
              </div>
              <div className="card bg-green-50 border-green-200">
                <div className="text-2xl font-bold text-green-900 mb-1">
                  {metrics?.completedTasks || 0}
                </div>
                <div className="text-sm text-green-700">Completed Tasks</div>
              </div>
              <div className="card bg-orange-50 border-orange-200">
                <div className="text-2xl font-bold text-orange-900 mb-1">
                  {metrics?.pendingVerifications || 0}
                </div>
                <div className="text-sm text-orange-700">Pending Verifications</div>
              </div>
            </div>

            {/* Users & Organizations */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-sm text-gray-600">{u.phone}</div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${
                          u.role === 'worker' ? 'bg-blue-100 text-blue-700' :
                          u.role === 'ngo' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                        {u.role === 'worker' && (
                          <div className="text-sm text-primary-600 font-semibold mt-1">
                            {u.wallet.mealCredits} credits
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Partner Organizations</h2>
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div key={org.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold">{org.name}</div>
                      <div className="text-sm text-gray-600">{org.type}</div>
                      <div className="text-xs text-gray-500 mt-1">{org.address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Title</th>
                      <th className="text-left py-3 px-2">Organization</th>
                      <th className="text-left py-3 px-2">Reward</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 10).map((task) => (
                      <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 font-semibold">{task.title}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.postedByOrgName}</td>
                        <td className="py-3 px-2">
                          <span className="font-semibold text-primary-600">
                            {task.rewardMeals} meals
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`badge ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {formatDate(task.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
