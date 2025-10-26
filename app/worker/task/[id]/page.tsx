'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getTask, claimTask, submitTaskProof } from '@/lib/db';
import { Task } from '@/lib/types';
import { Utensils, MapPin, Clock, ArrowLeft, Camera, Upload, CheckCircle } from 'lucide-react';
import { formatDate, formatDateTime, calculateDistance, formatDistance, getStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  const { user } = useAppStore();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/auth?role=worker');
      return;
    }
    loadTask();
  }, [user, taskId]);

  const loadTask = async () => {
    try {
      const taskData = await getTask(taskId);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user || !task) return;

    setClaiming(true);
    try {
      await claimTask(task.id, user.uid, user.name);
      toast.success('Task claimed successfully!');
      await loadTask(); // Reload task
    } catch (error: any) {
      console.error('Error claiming task:', error);
      toast.error(error.message || 'Failed to claim task');
    } finally {
      setClaiming(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!user || !task || !photoFile) {
      toast.error('Please upload a photo');
      return;
    }

    setSubmitting(true);
    try {
      // DEMO MODE: Use base64 or placeholder image instead of Firebase Storage
      let photoUrl: string;
      
      if (photoFile.size < 500000) { // If less than 500KB, use base64
        photoUrl = photoPreview; // Use the preview (base64)
      } else {
        // Use placeholder image for larger files
        photoUrl = `https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80`;
      }

      // Get current geolocation (for demo, use task location)
      const geo = user.location;

      // Submit proof
      await submitTaskProof(task.id, photoUrl, geo);
      
      toast.success('Proof submitted! Waiting for verification.');
      router.push('/worker/my-tasks');
    } catch (error: any) {
      console.error('Error submitting proof:', error);
      toast.error(error.message || 'Failed to submit proof');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Task not found</p>
          <Link href="/worker" className="btn-primary">
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const distance = user?.location
    ? calculateDistance(
        user.location.lat,
        user.location.lng,
        task.location.lat,
        task.location.lng
      )
    : 0;

  const isMyClaim = task.claimedBy === user?.uid;
  const canClaim = task.status === 'open';
  const canSubmit = task.status === 'claimed' && isMyClaim;
  const isSubmitted = task.status === 'submitted' && isMyClaim;
  const isVerified = task.status === 'verified' && isMyClaim;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/worker" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
            <span className="font-semibold">Back to Tasks</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Task Details Card */}
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <span className={`badge ${getStatusColor(task.status)} mb-3`}>
                {task.status.toUpperCase()}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              {task.postedByOrgName && (
                <p className="text-gray-600">Posted by {task.postedByOrgName}</p>
              )}
            </div>
            <div className="bg-primary-100 rounded-xl p-4 text-center ml-4">
              <Utensils className="w-10 h-10 text-primary-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-600">{task.rewardMeals}</div>
              <div className="text-sm text-primary-700">meal credits</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Distance</div>
                    <div>{formatDistance(distance)}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Due Date</div>
                    <div>{formatDate(task.dueBy)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {canClaim && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="btn-primary w-full text-lg"
            >
              {claiming ? 'Claiming...' : `Claim Task — Earn ${task.rewardMeals} Meals`}
            </button>
          )}

          {canSubmit && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Submit Your Work</h3>
                <p className="text-sm text-blue-700">
                  Upload a photo showing you completed the task. This will be reviewed by the NGO.
                </p>
              </div>

              <div>
                <label className="label">Upload Proof Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-64 rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-semibold">Take a Photo</p>
                        <p className="text-sm text-gray-500">or select from gallery</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmitProof}
                disabled={!photoFile || submitting}
                className="btn-primary w-full text-lg"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Upload className="inline-block mr-2 w-5 h-5" />
                    Submit Proof for Verification
                  </>
                )}
              </button>
            </div>
          )}

          {isSubmitted && (
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 text-center">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-purple-900 text-lg mb-2">Proof Submitted!</h3>
              <p className="text-purple-700">
                Your work is being reviewed by {task.postedByOrgName}. You'll be notified once verified.
              </p>
              {task.proof?.photoUrl && (
                <img
                  src={task.proof.photoUrl}
                  alt="Submitted proof"
                  className="mt-4 max-h-48 rounded-lg mx-auto"
                />
              )}
            </div>
          )}

          {isVerified && (
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-900 text-lg mb-2">Task Completed!</h3>
              <p className="text-green-700 mb-4">
                You earned <strong>{task.rewardMeals} meal credits</strong>!
              </p>
              {task.verifiedAt && (
                <p className="text-sm text-green-600">
                  Verified on {formatDateTime(task.verifiedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
