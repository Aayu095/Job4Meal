'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getPendingRedemptions, completeRedemption, rejectRedemption } from '@/lib/db';
import { Redemption } from '@/lib/types';
import { ArrowLeft, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RedemptionsPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=ngo');
      return;
    }
    loadRedemptions();
  }, [user]);

  const loadRedemptions = async () => {
    try {
      const pending = await getPendingRedemptions();
      setRedemptions(pending);
    } catch (error) {
      console.error('Error loading redemptions:', error);
      toast.error('Failed to load redemptions');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (redemption: Redemption) => {
    setProcessing(redemption.id);
    try {
      await completeRedemption(redemption.id, redemption.userId, redemption.mealCredits);
      toast.success('Redemption completed successfully!');
      await loadRedemptions();
    } catch (error: any) {
      console.error('Error completing redemption:', error);
      toast.error(error.message || 'Failed to complete redemption');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (redemptionId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessing(redemptionId);
    try {
      await rejectRedemption(redemptionId, reason);
      toast.success('Redemption rejected');
      await loadRedemptions();
    } catch (error: any) {
      console.error('Error rejecting redemption:', error);
      toast.error(error.message || 'Failed to reject redemption');
    } finally {
      setProcessing(null);
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Meal Redemptions</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : redemptions.length === 0 ? (
          <div className="card text-center py-12">
            <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No pending redemptions</p>
            <p className="text-gray-500 mt-2">All redemptions are processed!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {redemptions.map((redemption) => (
              <div key={redemption.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {redemption.userName}
                    </h3>
                    <p className="text-gray-600">
                      Redeeming at: {redemption.orgName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Requested {formatDateTime(redemption.requestedAt)}
                    </p>
                  </div>
                  
                  <div className="ml-4 text-center">
                    <div className="bg-primary-100 rounded-lg p-4">
                      <Utensils className="w-10 h-10 text-primary-600 mx-auto mb-1" />
                      <div className="text-3xl font-bold text-primary-600">
                        {redemption.mealCredits}
                      </div>
                      <div className="text-sm text-primary-700">
                        meal{redemption.mealCredits > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>Action Required:</strong> Confirm that {redemption.userName} has picked up{' '}
                    {redemption.mealCredits} meal{redemption.mealCredits > 1 ? 's' : ''} from your location.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleComplete(redemption)}
                    disabled={processing === redemption.id}
                    className="btn-success flex-1 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {processing === redemption.id ? 'Processing...' : 'Confirm Pickup'}
                  </button>
                  <button
                    onClick={() => handleReject(redemption.id)}
                    disabled={processing === redemption.id}
                    className="btn-danger flex-1 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
