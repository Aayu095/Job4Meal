'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

// NGO dashboard now redirects to profile page
// All functionality is available in profile page
export default function NGODashboard() {
  const router = useRouter();
  const { user, loading } = useAppStore();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      // Not logged in - redirect to auth
      router.push('/auth?role=ngo');
    } else {
      // Logged in - redirect to profile page
      router.push('/ngo/profile');
    }
  }, [user, loading, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600 font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}
