const admin = require('firebase-admin');
require('dotenv').config();

// Usually you would use a serviceAccountKey.json file here
// For demo purposes, we will initialize with application default credentials or explicitly

let db, rtdb;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    });
    db = admin.firestore();
    rtdb = admin.database();
  } else {
    throw new Error('Missing FIREBASE_PRIVATE_KEY or FIREBASE_PROJECT_ID in env.');
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  console.warn('Using mock Firebase DB objects for demo purposes.');
  
  // Mock Firebase API for the demo to prevent crashes
  const mockCollection = {
    doc: () => ({ set: async () => {}, get: async () => ({ data: () => ({}) }) }),
    orderBy: () => mockCollection,
    limit: () => mockCollection,
    get: async () => ({ docs: [] })
  };
  
  db = { collection: () => mockCollection };
  rtdb = { ref: () => ({ set: async () => {}, on: () => {} }) };
}

module.exports = { admin, db, rtdb };
