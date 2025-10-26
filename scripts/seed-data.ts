/**
 * Seed Data Script for Job4Meal Demo
 * 
 * This script populates Firestore with realistic demo data for the hackathon presentation.
 * Run this after setting up Firebase to create:
 * - Organizations (NGOs, shops, donors)
 * - Users (workers, NGO staff, admin)
 * - Tasks (various statuses)
 * - Redemptions
 * 
 * Usage: npx ts-node scripts/seed-data.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

// Sample data
const organizations = [
  {
    id: 'org-hope-foundation',
    name: 'Hope Foundation',
    contactPhone: '+1234567890',
    address: '123 Main St, New York, NY 10001',
    type: 'NGO',
    verified: true,
  },
  {
    id: 'org-community-kitchen',
    name: 'Community Kitchen',
    contactPhone: '+1234567891',
    address: '456 Community Ave, Brooklyn, NY 11201',
    type: 'NGO',
    verified: true,
  },
  {
    id: 'org-green-grocers',
    name: 'Green Grocers Co-op',
    contactPhone: '+1234567892',
    address: '789 Market St, Queens, NY 11354',
    type: 'shop',
    verified: true,
  },
];

const users = [
  {
    uid: 'worker-john',
    name: 'John Smith',
    phone: '+1234560001',
    role: 'worker',
    location: { lat: 40.7128, lng: -74.0060 },
    wallet: { mealCredits: 8 },
    verified: true,
  },
  {
    uid: 'worker-maria',
    name: 'Maria Garcia',
    phone: '+1234560002',
    role: 'worker',
    location: { lat: 40.6782, lng: -73.9442 },
    wallet: { mealCredits: 12 },
    verified: true,
  },
  {
    uid: 'worker-ahmed',
    name: 'Ahmed Ali',
    phone: '+1234560003',
    role: 'worker',
    location: { lat: 40.7489, lng: -73.9680 },
    wallet: { mealCredits: 5 },
    verified: true,
  },
  {
    uid: 'ngo-staff',
    name: 'Sarah Johnson',
    phone: '+1234560010',
    role: 'ngo',
    wallet: { mealCredits: 0 },
    verified: true,
  },
  {
    uid: 'admin-demo',
    name: 'Admin User',
    phone: '+1234560099',
    role: 'admin',
    wallet: { mealCredits: 0 },
    verified: true,
  },
];

const tasks = [
  {
    id: 'task-1',
    title: 'Clean Community Center',
    description: 'Sweep floors, organize supplies, and clean windows at our community center (2-3 hours)',
    postedByOrg: 'org-hope-foundation',
    postedByOrgName: 'Hope Foundation',
    location: { lat: 40.7128, lng: -74.0060 },
    rewardMeals: 3,
    status: 'open',
    dueBy: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'task-2',
    title: 'Sort Donated Clothes',
    description: 'Help sort and organize donated clothing items by size and type (1-2 hours)',
    postedByOrg: 'org-hope-foundation',
    postedByOrgName: 'Hope Foundation',
    location: { lat: 40.7128, lng: -74.0060 },
    rewardMeals: 2,
    status: 'open',
    dueBy: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'task-3',
    title: 'Plant Trees in Park',
    description: 'Join us to plant 20 trees in the local park. Tools provided (3-4 hours)',
    postedByOrg: 'org-community-kitchen',
    postedByOrgName: 'Community Kitchen',
    location: { lat: 40.6782, lng: -73.9442 },
    rewardMeals: 4,
    status: 'claimed',
    claimedBy: 'worker-john',
    claimedByName: 'John Smith',
    claimedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    dueBy: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'task-4',
    title: 'Pack Food Boxes',
    description: 'Help pack food boxes for distribution to families (2 hours)',
    postedByOrg: 'org-community-kitchen',
    postedByOrgName: 'Community Kitchen',
    location: { lat: 40.6782, lng: -73.9442 },
    rewardMeals: 2,
    status: 'submitted',
    claimedBy: 'worker-maria',
    claimedByName: 'Maria Garcia',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      geo: { lat: 40.6782, lng: -73.9442 },
      submittedAt: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000)),
    },
    dueBy: Timestamp.fromDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'task-5',
    title: 'Deliver Meals to Seniors',
    description: 'Help deliver packed meals to senior citizens in the neighborhood (2-3 hours)',
    postedByOrg: 'org-community-kitchen',
    postedByOrgName: 'Community Kitchen',
    location: { lat: 40.7489, lng: -73.9680 },
    rewardMeals: 3,
    status: 'verified',
    claimedBy: 'worker-ahmed',
    claimedByName: 'Ahmed Ali',
    proof: {
      photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      geo: { lat: 40.7489, lng: -73.9680 },
      submittedAt: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
    },
    verifiedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    dueBy: Timestamp.fromDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)),
  },
];

const redemptions = [
  {
    id: 'redeem-1',
    userId: 'worker-maria',
    userName: 'Maria Garcia',
    orgId: 'org-green-grocers',
    orgName: 'Green Grocers Co-op',
    mealCredits: 3,
    status: 'requested',
    requestedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 60 * 60 * 1000)),
  },
  {
    id: 'redeem-2',
    userId: 'worker-john',
    userName: 'John Smith',
    orgId: 'org-community-kitchen',
    orgName: 'Community Kitchen',
    mealCredits: 2,
    status: 'completed',
    requestedAt: Timestamp.fromDate(new Date(Date.now() - 48 * 60 * 60 * 1000)),
    completedAt: Timestamp.fromDate(new Date(Date.now() - 47 * 60 * 60 * 1000)),
  },
];

async function seedData() {
  console.log('🌱 Starting to seed data...\n');

  try {
    // Seed Organizations
    console.log('📍 Creating organizations...');
    for (const org of organizations) {
      await db.collection('orgs').doc(org.id).set({
        ...org,
        createdAt: Timestamp.now(),
      });
      console.log(`  ✓ Created: ${org.name}`);
    }

    // Seed Users
    console.log('\n👥 Creating users...');
    for (const user of users) {
      await db.collection('users').doc(user.uid).set({
        ...user,
        createdAt: Timestamp.now(),
      });
      console.log(`  ✓ Created: ${user.name} (${user.role})`);
    }

    // Seed Tasks
    console.log('\n📋 Creating tasks...');
    for (const task of tasks) {
      await db.collection('tasks').doc(task.id).set({
        ...task,
        createdAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)),
      });
      console.log(`  ✓ Created: ${task.title} [${task.status}]`);
    }

    // Seed Redemptions
    console.log('\n🍽️  Creating redemptions...');
    for (const redemption of redemptions) {
      await db.collection('redemptions').doc(redemption.id).set(redemption);
      console.log(`  ✓ Created redemption: ${redemption.userName} - ${redemption.mealCredits} meals [${redemption.status}]`);
    }

    console.log('\n✅ Seed data created successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - ${organizations.length} organizations`);
    console.log(`  - ${users.length} users`);
    console.log(`  - ${tasks.length} tasks`);
    console.log(`  - ${redemptions.length} redemptions`);
    console.log('\n🎉 Your Job4Meal demo is ready to go!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedData();
