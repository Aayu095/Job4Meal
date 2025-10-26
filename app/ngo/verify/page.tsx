'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTasksByStatus, verifyTask } from '@/lib/db';
import { Task } from '@/lib/types';
import { ArrowLeft, CheckCircle, XCircle, MapPin, User, Calendar } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function VerifyTasksPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    try {
      const submittedTasks = await getTasksByStatus('submitted');
      setTasks(submittedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (taskId: string) => {
    setVerifying(taskId);
    try {
      await verifyTask(taskId);
      toast.success('Task verified! Worker earned meal credits.');
      await loadTasks();
      setSelectedTask(null);
    } catch (error: any) {
      console.error('Error verifying task:', error);
      toast.error(error.message || 'Failed to verify task');
    } finally {
      setVerifying(null);
    }
  };

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

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Verify Task Submissions</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No submissions to verify</p>
            <p className="text-gray-500 mt-2">All caught up!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Task List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`card cursor-pointer transition-all ${
                    selectedTask?.id === task.id
                      ? 'ring-2 ring-primary-500 shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">{task.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Worker: {task.claimedByName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted {formatDateTime(task.proof?.submittedAt || new Date())}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <span className="font-semibold text-primary-600">
                      {task.rewardMeals} meal credits
                    </span>
                    <span className="text-sm text-gray-500">
                      Click to review →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Panel */}
            <div className="sticky top-24">
              {selectedTask ? (
                <div className="card">
                  <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                  
                  <div className="mb-4">
                    <p className="text-gray-700">{selectedTask.description}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Worker:</span> {selectedTask.claimedByName}
                      </div>
                      <div>
                        <span className="font-semibold">Reward:</span> {selectedTask.rewardMeals} meals
                      </div>
                      <div>
                        <span className="font-semibold">Submitted:</span>{' '}
                        {formatDateTime(selectedTask.proof?.submittedAt || new Date())}
                      </div>
                    </div>
                  </div>

                  {selectedTask.proof?.photoUrl && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Proof Photo</h3>
                      <img
                        src={selectedTask.proof.photoUrl}
                        alt="Task proof"
                        className="w-full rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}

                  {selectedTask.proof?.geo && (
                    <div className="mb-6 bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-900 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>
                          Location verified: {selectedTask.proof.geo.lat.toFixed(4)}, {selectedTask.proof.geo.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(selectedTask.id)}
                      disabled={verifying === selectedTask.id}
                      className="btn-success flex-1 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {verifying === selectedTask.id ? 'Verifying...' : 'Approve & Award Credits'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Approving will award {selectedTask.rewardMeals} meal credits to the worker
                  </p>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600">Select a submission to review</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
