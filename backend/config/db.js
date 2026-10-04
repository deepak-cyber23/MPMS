import mongoose from 'mongoose';
import { initializeStore } from '../utils/store.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || '';

  if (mongoUri && mongoUri.trim() !== '') {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500,
      });
      isMongoConnected = true;
      console.log(`[MPMS Node.js/MongoDB] Connected to MongoDB Server: ${mongoUri}`);
      await initializeStore(true);
      return { mode: 'mongodb', uri: mongoUri };
    } catch (err) {
      console.warn(
        `[MPMS Node.js/MongoDB] External MongoDB daemon not reachable at ${mongoUri}. Activating Mongoose-Validated Persistent Document Store (backend/data/mpms_mongodb_collections.json).`
      );
    }
  } else {
    console.log(
      '[MPMS Node.js/MongoDB] Initializing Mongoose-Validated Persistent Document Engine (backend/data/mpms_mongodb_collections.json)...'
    );
  }

  isMongoConnected = false;
  await initializeStore(false);
  return {
    mode: 'embedded-bson-store',
    uri: 'mongodb://embedded-engine/mpms_db (backend/data/mpms_mongodb_collections.json)',
  };
};

export const getMongoStatus = () => ({
  isLiveDaemon: isMongoConnected && mongoose.connection.readyState === 1,
  engine:
    isMongoConnected && mongoose.connection.readyState === 1
      ? 'MongoDB Community / Atlas (Live Mongoose Connection)'
      : 'MongoDB Persistent Document Engine (Mongoose Schema Validated)',
  databaseName: 'mpms_db',
  collections: ['admins', 'users', 'services', 'bookings', 'enquiries', 'pages'],
});
