'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Utensils, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header() {
  const { user, setUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear user from Zustand store
      setUser(null);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-green-500 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Utensils className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
              Job4Meal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
              How It Works
            </Link>
            {user && (
              <>
                <Link href={user.role === 'worker' ? '/worker/profile' : `/${user.role}`} className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                  {user.role === 'worker' ? 'My Profile' : 'Dashboard'}
                </Link>
                <Link href="/listings" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                  Listings
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/auth" className="btn-primary py-2 px-6 inline-block">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 py-4 border-t border-neutral-200">
            <div className="flex flex-col gap-4">
              <Link 
                href="/about" 
                className="text-neutral-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-neutral-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              {user && (
                <>
                  <Link 
                    href={user.role === 'worker' ? '/worker/profile' : `/${user.role}`}
                    className="text-neutral-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user.role === 'worker' ? 'My Profile' : 'Dashboard'}
                  </Link>
                  <Link 
                    href="/listings" 
                    className="text-neutral-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Listings
                  </Link>
                </>
              )}
              
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-left text-danger-600 font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className="text-neutral-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth" 
                    className="btn-primary py-2 px-6 inline-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
