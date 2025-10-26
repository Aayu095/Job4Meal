'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTasksByUser } from '@/lib/db';
import { Task } from '@/lib/types';
import { Utensils, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyTasksPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=worker');
      return;
    }
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      const myTasks = await getTasksByUser(user.uid);
      setTasks(myTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/worker" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg">You haven't claimed any tasks yet.</p>
            <Link href="/worker" className="btn-primary mt-4 inline-block">
              Find Tasks
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/worker/task/${task.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status.toUpperCase()}
                      </span>
                      {task.status === 'verified' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                  
                  <div className="ml-4 text-center">
                    <div className={`rounded-lg p-4 ${task.status === 'verified' ? 'bg-green-100' : 'bg-primary-100'}`}>
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
    </div>
  );
}
