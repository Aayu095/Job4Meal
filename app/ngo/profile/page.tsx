'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getAllOrganizations } from '@/lib/db';
import { Organization } from '@/lib/types';
import { ArrowLeft, Building2, Phone, MapPin, Calendar, Award, Users, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function NGOProfilePage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }
    if (user.role !== 'ngo') {
      router.push('/');
      return;
    }
    loadOrganization();
  }, [user, router]);

  const loadOrganization = async () => {
    try {
      const orgs = await getAllOrganizations();
      setOrganization(orgs[0]); // Demo: use first org
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
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
          <Link href="/ngo" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header Card */}
        <div className="card bg-gradient-to-br from-green-50 to-primary-50 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-primary-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
              🏢
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {organization?.name || user.name}
              </h1>
              <p className="text-neutral-600 mb-3">Partner Organization</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="badge bg-green-100 text-green-700">
                  ✓ Verified Partner
                </span>
                <span className="badge bg-primary-100 text-primary-700">
                  {organization?.type || 'NGO'}
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

        {/* Organization Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Organization Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Organization Name</label>
                <div className="text-gray-900 font-medium">
                  {organization?.name || 'Community Care NGO'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Type</label>
                <div className="text-gray-900">
                  {organization?.type || 'Non-Profit Organization'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Address</label>
                <div className="flex items-start gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{organization?.address || '123 Community Street, Mumbai, India'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Stats */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              Contact & Statistics
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Contact Person</label>
                <div className="text-gray-900">{user.name}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Phone</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone || '+91 98765 43210'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Partner Since</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{user.createdAt ? formatDate(user.createdAt) : 'Recently joined'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Impact Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm font-semibold text-blue-900">Tasks Posted</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-1">8</div>
              <div className="text-sm font-semibold text-green-900">Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
              <div className="text-4xl font-bold text-primary-600 mb-1">24</div>
              <div className="text-sm font-semibold text-primary-900">Meals Provided</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border-2 border-teal-200">
              <div className="text-4xl font-bold text-teal-600 mb-1">15</div>
              <div className="text-sm font-semibold text-teal-900">Workers Helped</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Partner Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <div className="text-4xl mb-2">🌟</div>
              <div className="font-bold text-green-900">Verified</div>
              <div className="text-xs text-green-700">Partner</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-primary-900">Active</div>
              <div className="text-xs text-primary-700">Contributor</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border-2 border-teal-200">
              <div className="text-4xl mb-2">💪</div>
              <div className="font-bold text-teal-900">Community</div>
              <div className="text-xs text-teal-700">Builder</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-xl border-2 border-gray-200 opacity-50">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-bold text-gray-600">Top Partner</div>
              <div className="text-xs text-gray-500">Locked</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/ngo/create-task" className="card hover:shadow-lg transition-shadow text-center">
            <div className="text-4xl mb-2">➕</div>
            <h3 className="font-bold text-lg">Create Task</h3>
            <p className="text-sm text-gray-600">Post new opportunity</p>
          </Link>
          <Link href="/ngo/verify" className="card hover:shadow-lg transition-shadow text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="font-bold text-lg">Verify Work</h3>
            <p className="text-sm text-gray-600">Review submissions</p>
          </Link>
          <Link href="/ngo/redemptions" className="card hover:shadow-lg transition-shadow text-center">
            <div className="text-4xl mb-2">🍱</div>
            <h3 className="font-bold text-lg">Redemptions</h3>
            <p className="text-sm text-gray-600">Process meal pickups</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
