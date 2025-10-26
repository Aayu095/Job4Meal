'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getAllOrganizations, createRedemption, getRedemptionsByUser } from '@/lib/db';
import { Organization, Redemption } from '@/lib/types';
import { Utensils, ArrowLeft, Store, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import QRCodeMockup from '@/components/QRCodeMockup';

export default function RedeemPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [mealCount, setMealCount] = useState(1);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=worker');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [orgs, userRedemptions] = await Promise.all([
        getAllOrganizations(),
        getRedemptionsByUser(user.uid),
      ]);
      setOrganizations(orgs.filter((o) => o.verified));
      setRedemptions(userRedemptions);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load redemption options');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!user || !selectedOrg || mealCount <= 0) return;

    if (user.wallet.mealCredits < mealCount) {
      toast.error('Insufficient meal credits');
      return;
    }

    setRedeeming(true);
    try {
      await createRedemption(
        user.uid,
        user.name,
        selectedOrg.id,
        selectedOrg.name,
        mealCount
      );
      
      toast.success('Redemption request submitted!');
      setSelectedOrg(null);
      setMealCount(1);
      await loadData();
    } catch (error: any) {
      console.error('Error creating redemption:', error);
      toast.error(error.message || 'Failed to create redemption request');
    } finally {
      setRedeeming(false);
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

      {/* Wallet Display */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-100 text-sm mb-2">Available Credits</p>
          <div className="flex items-center justify-center gap-2">
            <Utensils className="w-10 h-10" />
            <span className="text-6xl font-bold">{user.wallet.mealCredits}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Redemption Form */}
          <div className="card">
          <h2 className="text-2xl font-bold mb-4">Redeem Meal Credits</h2>
          
          {user.wallet.mealCredits === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
              <p className="text-yellow-800">You don't have any meal credits yet.</p>
              <Link href="/worker" className="btn-primary mt-4 inline-block">
                Find Tasks to Earn Credits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="label">Select Partner Organization</label>
                <div className="grid gap-3">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setSelectedOrg(org)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedOrg?.id === org.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Store className="w-6 h-6 text-gray-600" />
                        <div>
                          <div className="font-semibold">{org.name}</div>
                          <div className="text-sm text-gray-600">{org.address}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedOrg && (
                <>
                  <div>
                    <label className="label">Number of Meals</label>
                    <input
                      type="number"
                      min="1"
                      max={user.wallet.mealCredits}
                      value={mealCount}
                      onChange={(e) => setMealCount(parseInt(e.target.value) || 1)}
                      className="input"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      You can redeem up to {user.wallet.mealCredits} meals
                    </p>
                  </div>

                  <button
                    onClick={handleRedeem}
                    disabled={redeeming}
                    className="btn-primary w-full text-lg"
                  >
                    {redeeming ? 'Processing...' : `Redeem ${mealCount} Meal${mealCount > 1 ? 's' : ''}`}
                  </button>
                </>
              )}
            </div>
          )}
          </div>

          {/* QR Code Mockup */}
          <div>
            <QRCodeMockup credits={user.wallet.mealCredits} />
            <div className="mt-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3 text-neutral-900">How Redemption Works</h3>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Select a partner organization from the list</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Choose how many meal credits to redeem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Show the QR code at the partner location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Enjoy your meal with dignity!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Redemption History */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Redemption History</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : redemptions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No redemptions yet</p>
          ) : (
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div key={redemption.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`badge ${getStatusColor(redemption.status)}`}>
                          {redemption.status.toUpperCase()}
                        </span>
                        {redemption.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {redemption.status === 'requested' && (
                          <Clock className="w-4 h-4 text-orange-600" />
                        )}
                        {redemption.status === 'rejected' && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <p className="font-semibold">{redemption.orgName}</p>
                      <p className="text-sm text-gray-600">
                        {redemption.mealCredits} meal{redemption.mealCredits > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Requested {formatDateTime(redemption.requestedAt)}
                      </p>
                      {redemption.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed {formatDateTime(redemption.completedAt)}
                        </p>
                      )}
                      {redemption.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">
                          Rejected: {redemption.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
