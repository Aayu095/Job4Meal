'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTasksByOrg, getAllOrganizations } from '@/lib/db';
import { Task, Organization } from '@/lib/types';
import { ArrowLeft, Utensils, Plus } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ManageTasksPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'claimed' | 'submitted' | 'verified'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const orgs = await getAllOrganizations();
      const org = orgs[0]; // Demo: use first org
      setOrganization(org);

      if (org) {
        const orgTasks = await getTasksByOrg(org.id);
        setTasks(orgTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/ngo" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Tasks</h1>
          <Link href="/ngo/create-task" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                filter === 'open'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Open ({tasks.filter(t => t.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('claimed')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                filter === 'claimed'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Claimed ({tasks.filter(t => t.status === 'claimed').length})
            </button>
            <button
              onClick={() => setFilter('submitted')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                filter === 'submitted'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Submitted ({tasks.filter(t => t.status === 'submitted').length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                filter === 'verified'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'verified').length})
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg">
              {filter === 'all' ? 'No tasks created yet' : `No ${filter} tasks`}
            </p>
            <Link href="/ngo/create-task" className="btn-primary mt-4 inline-block">
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Created:</span> {formatDate(task.createdAt)}
                      </div>
                      <div>
                        <span className="font-semibold">Due:</span> {formatDate(task.dueBy)}
                      </div>
                      {task.claimedByName && (
                        <div>
                          <span className="font-semibold">Claimed by:</span> {task.claimedByName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-center">
                    <div className="bg-primary-100 rounded-lg p-4">
                      <Utensils className="w-8 h-8 text-primary-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-primary-600">
                        {task.rewardMeals}
                      </div>
                      <div className="text-xs text-primary-700">meals</div>
                    </div>
                  </div>
                </div>

                {task.status === 'submitted' && (
                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href="/ngo/verify"
                      className="btn-primary w-full sm:w-auto"
                    >
                      Review Submission
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
