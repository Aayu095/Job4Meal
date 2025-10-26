'use client';

import Link from 'next/link';
import { Utensils, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-green-500 p-2 rounded-xl">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Job4Meal</span>
            </Link>
            <p className="text-neutral-400 mb-4 leading-relaxed">
              Turning small tasks into meaningful meals. Building dignity through work and compassion.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-neutral-700 rounded-lg hover:bg-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-neutral-700 rounded-lg hover:bg-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-neutral-700 rounded-lg hover:bg-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-neutral-700 rounded-lg hover:bg-primary-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Find Tasks
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">For Organizations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ngo" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Post Tasks
                </Link>
              </li>
              <li>
                <Link href="/auth?role=ngo" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Impact Dashboard
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">support@job4meal.org</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">
                  123 Hope Street<br />
                  Community Center, CA 94000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © 2024 Job4Meal. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
