import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  runTransaction,
  increment,
  serverTimestamp,
  writeBatch,
  GeoPoint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Task,
  Organization,
  Redemption,
  TaskStatus,
  DashboardMetrics,
} from './types';

// ============ USERS ============

export async function createUser(uid: string, userData: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...userData,
    wallet: { mealCredits: 0 },
    verified: false,
    createdAt: serverTimestamp(),
  });
}

export async function getUser(uid: string): Promise<User | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { uid, ...userSnap.data() } as User;
  }
  return null;
}

export async function updateUser(uid: string, data: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data as any);
}

export async function getAllUsers(): Promise<User[]> {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as User));
}

// ============ ORGANIZATIONS ============

export async function createOrganization(
  orgData: Omit<Organization, 'id' | 'createdAt'>
): Promise<string> {
  const orgsRef = collection(db, 'orgs');
  const docRef = await addDoc(orgsRef, {
    ...orgData,
    verified: true, // Auto-verify for demo
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const orgRef = doc(db, 'orgs', orgId);
  const orgSnap = await getDoc(orgRef);
  if (orgSnap.exists()) {
    return { id: orgId, ...orgSnap.data() } as Organization;
  }
  return null;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const orgsRef = collection(db, 'orgs');
  const snapshot = await getDocs(orgsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Organization));
}

// ============ TASKS ============

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
  const tasksRef = collection(db, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    status: 'open',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTask(taskId: string): Promise<Task | null> {
  const taskRef = doc(db, 'tasks', taskId);
  const taskSnap = await getDoc(taskRef);
  if (taskSnap.exists()) {
    return { id: taskId, ...taskSnap.data() } as Task;
  }
  return null;
}

export async function getOpenTasks(limitCount: number = 50): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('status', '==', status), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function getTasksByOrg(orgId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('postedByOrg', '==', orgId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('claimedBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function getAllTasks(): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function claimTask(taskId: string, userId: string, userName: string) {
  const taskRef = doc(db, 'tasks', taskId);
  await runTransaction(db, async (transaction) => {
    const taskDoc = await transaction.get(taskRef);
    if (!taskDoc.exists()) {
      throw new Error('Task does not exist');
    }
    const task = taskDoc.data() as Task;
    if (task.status !== 'open') {
      throw new Error('Task is not available');
    }
    transaction.update(taskRef, {
      status: 'claimed',
      claimedBy: userId,
      claimedByName: userName,
      claimedAt: serverTimestamp(),
    });
  });
}

export async function submitTaskProof(
  taskId: string,
  photoUrl: string,
  geo?: { lat: number; lng: number }
) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    status: 'submitted',
    proof: {
      photoUrl,
      geo,
      submittedAt: serverTimestamp(),
    },
  });
}

export async function verifyTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);

  await runTransaction(db, async (transaction) => {
    const taskDoc = await transaction.get(taskRef);
    if (!taskDoc.exists()) {
      throw new Error('Task does not exist');
    }

    const task = taskDoc.data() as Task;
    if (task.status !== 'submitted') {
      throw new Error('Task is not in submitted status');
    }
    if (!task.claimedBy) {
      throw new Error('No user claimed this task');
    }

    // Update task status
    transaction.update(taskRef, {
      status: 'verified',
      verifiedAt: serverTimestamp(),
    });

    // Increment user wallet
    const userRef = doc(db, 'users', task.claimedBy);
    transaction.update(userRef, {
      'wallet.mealCredits': increment(task.rewardMeals),
    });
  });
}

export async function cancelTask(taskId: string) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    status: 'cancelled',
  });
}

// ============ REDEMPTIONS ============

export async function createRedemption(
  userId: string,
  userName: string,
  orgId: string,
  orgName: string,
  mealCredits: number
): Promise<string> {
  const redemptionsRef = collection(db, 'redemptions');
  const docRef = await addDoc(redemptionsRef, {
    userId,
    userName,
    orgId,
    orgName,
    mealCredits,
    status: 'requested',
    requestedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRedemption(redemptionId: string): Promise<Redemption | null> {
  const redemptionRef = doc(db, 'redemptions', redemptionId);
  const redemptionSnap = await getDoc(redemptionRef);
  if (redemptionSnap.exists()) {
    return { id: redemptionId, ...redemptionSnap.data() } as Redemption;
  }
  return null;
}

export async function getRedemptionsByUser(userId: string): Promise<Redemption[]> {
  const redemptionsRef = collection(db, 'redemptions');
  const q = query(
    redemptionsRef,
    where('userId', '==', userId),
    orderBy('requestedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Redemption));
}

export async function getRedemptionsByOrg(orgId: string): Promise<Redemption[]> {
  const redemptionsRef = collection(db, 'redemptions');
  const q = query(
    redemptionsRef,
    where('orgId', '==', orgId),
    orderBy('requestedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Redemption));
}

export async function getPendingRedemptions(): Promise<Redemption[]> {
  const redemptionsRef = collection(db, 'redemptions');
  const q = query(
    redemptionsRef,
    where('status', '==', 'requested'),
    orderBy('requestedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Redemption));
}

export async function completeRedemption(
  redemptionId: string,
  userId: string,
  mealCredits: number
): Promise<void> {
  const redemptionRef = doc(db, 'redemptions', redemptionId);

  await runTransaction(db, async (transaction) => {
    const redemptionDoc = await transaction.get(redemptionRef);
    if (!redemptionDoc.exists()) {
      throw new Error('Redemption does not exist');
    }

    const redemption = redemptionDoc.data() as Redemption;
    if (redemption.status !== 'requested') {
      throw new Error('Redemption is not in requested status');
    }

    // Update redemption status
    transaction.update(redemptionRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
    });

    // Deduct credits from user wallet
    const userRef = doc(db, 'users', userId);
    transaction.update(userRef, {
      'wallet.mealCredits': increment(-mealCredits),
    });
  });
}

export async function rejectRedemption(redemptionId: string, reason: string) {
  const redemptionRef = doc(db, 'redemptions', redemptionId);
  await updateDoc(redemptionRef, {
    status: 'rejected',
    rejectionReason: reason,
  });
}

// ============ DASHBOARD METRICS ============

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [users, tasks] = await Promise.all([getAllUsers(), getAllTasks()]);

  const completedTasks = tasks.filter((t) => t.status === 'verified').length;
  const activeTasks = tasks.filter(
    (t) => t.status === 'open' || t.status === 'claimed'
  ).length;
  const pendingVerifications = tasks.filter((t) => t.status === 'submitted').length;

  const totalMealsIssued = tasks
    .filter((t) => t.status === 'verified')
    .reduce((sum, t) => sum + t.rewardMeals, 0);

  return {
    totalUsers: users.length,
    totalTasks: tasks.length,
    completedTasks,
    totalMealsIssued,
    activeTasks,
    pendingVerifications,
  };
}
