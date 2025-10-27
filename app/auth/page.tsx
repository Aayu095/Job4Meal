'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import toast from 'react-hot-toast';
import { Utensils, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as UserRole | null;
  const { user, loading: authLoading } = useAppStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [role, setRole] = useState<UserRole>(roleParam || 'worker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // User is already logged in, redirect to their dashboard
      if (user.role === 'worker') {
        router.replace('/worker');
      } else if (user.role === 'ngo') {
        router.replace('/ngo');
      } else if (user.role === 'admin') {
        router.replace('/admin');
      }
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: name,
      });

      // Create user document in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
        role,
        wallet: { mealCredits: role === 'worker' ? 5 : 0 },
        verified: true,
        location: { lat: 0, lng: 0 },
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully!');

      // Redirect based on role
      setTimeout(() => {
        if (role === 'worker') {
          router.replace('/worker');
        } else if (role === 'ngo') {
          router.replace('/ngo');
        } else if (role === 'admin') {
          router.replace('/admin');
        }
      }, 500);
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Try signing in instead.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error('User profile not found. Please sign up first.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      
      toast.success('Signed in successfully!');

      // Wait a moment for AuthProvider to update state, then redirect
      setTimeout(() => {
        if (userData.role === 'worker') {
          router.replace('/worker');
        } else if (userData.role === 'ngo') {
          router.replace('/ngo');
        } else if (userData.role === 'admin') {
          router.replace('/admin');
        }
      }, 500);
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to sign in');
      }
      setLoading(false);
    }
  };


  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-neutral-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-green-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900">Job4Meal</h1>
          <p className="text-neutral-600 mt-2 text-lg">Earn a meal, feed a future</p>
        </div>

        {/* Auth Card */}
        <div className="card bg-white">
          <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn}>
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Role Selection - Only for Sign Up */}
            {mode === 'signup' && (
              <div className="mb-6">
                <label className="label mb-3">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'worker'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">👷</div>
                    <div className="font-semibold text-sm">Worker</div>
                    <div className="text-xs text-neutral-600">Find Tasks</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ngo')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === 'ngo'
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">🏢</div>
                    <div className="font-semibold text-sm">Partner</div>
                    <div className="text-xs text-neutral-600">Post Tasks</div>
                  </button>
                </div>
              </div>
            )}

            {/* Name Input - Only for Sign Up */}
            {mode === 'signup' && (
              <div className="mb-6">
                <label className="label">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                  required
                  minLength={6}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-neutral-600 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? mode === 'signup'
                  ? 'Creating Account...'
                  : 'Signing In...'
                : mode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
            </button>

            {/* Toggle Mode Link */}
            <p className="text-center mt-4 text-sm text-neutral-600">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
