'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { createTask, getAllOrganizations } from '@/lib/db';
import { Organization } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateTaskPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rewardMeals: 2,
    dueInDays: 7,
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }
    loadOrganization();
  }, [user]);

  const loadOrganization = async () => {
    try {
      const orgs = await getAllOrganizations();
      setOrganization(orgs[0]); // Demo: use first org
    } catch (error) {
      console.error('Error loading organization:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !user) return;

    setLoading(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + formData.dueInDays);

      await createTask({
        title: formData.title,
        description: formData.description,
        postedByOrg: organization.id,
        postedByOrgName: organization.name,
        location: { lat: 40.7128, lng: -74.0060 }, // Demo location
        rewardMeals: formData.rewardMeals,
        status: 'open',
        dueBy: Timestamp.fromDate(dueDate),
      });

      toast.success('Task created successfully!');
      router.push('/ngo/tasks');
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Create New Task</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Clean community center"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what needs to be done..."
                className="input min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="label">Reward (Meal Credits)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.rewardMeals}
                onChange={(e) => setFormData({ ...formData, rewardMeals: parseInt(e.target.value) || 1 })}
                className="input"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                How many meal credits will the worker earn?
              </p>
            </div>

            <div>
              <label className="label">Due In (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.dueInDays}
                onChange={(e) => setFormData({ ...formData, dueInDays: parseInt(e.target.value) || 7 })}
                className="input"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Organization:</strong> {organization.name}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>Location:</strong> {organization.address}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="inline-block mr-2 w-5 h-5" />
                    Create Task
                  </>
                )}
              </button>
              <Link href="/ngo" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
