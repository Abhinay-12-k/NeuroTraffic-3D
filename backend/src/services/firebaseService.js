const { db, rtdb } = require('../config/firebase');

const saveTrafficHistory = async (trafficData) => {
  try {
    const docRef = db.collection('traffic_history').doc(new Date().toISOString());
    await docRef.set({
      timestamp: new Date().toISOString(),
      ...trafficData
    });
  } catch (error) {
    console.warn('Error saving traffic history:', error.message);
  }
};

const saveEmergencyEvent = async (eventData) => {
  try {
    const docRef = db.collection('emergency_events').doc();
    await docRef.set({
      id: docRef.id,
      timestamp: new Date().toISOString(),
      ...eventData
    });
  } catch (error) {
    console.warn('Error saving emergency event:', error.message);
  }
};

const getHistory = async (limit = 50) => {
  try {
    const snapshot = await db.collection('traffic_history')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn('Error getting history:', error.message);
    return [];
  }
};

const getEmergencyEvents = async (limit = 20) => {
  try {
    const snapshot = await db.collection('emergency_events')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn('Error getting emergency events:', error.message);
    return [];
  }
};

module.exports = {
  saveTrafficHistory,
  saveEmergencyEvent,
  getHistory,
  getEmergencyEvents
};
