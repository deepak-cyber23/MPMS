import serverless from 'serverless-http';
import { app, connectDB } from '../../backend/server.js';

let dbInitialized = false;
let dbPromise = null;

const ensureDbConnection = async () => {
  if (dbInitialized) return;
  if (!dbPromise) {
    dbPromise = connectDB()
      .then((res) => {
        dbInitialized = true;
        console.log('[Netlify Function API] Connected to database store:', res?.mode || 'ready');
      })
      .catch((err) => {
        dbPromise = null;
        console.error('[Netlify Function API] Database initialization error:', err);
      });
  }
  await dbPromise;
};

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  await ensureDbConnection();

  return serverlessHandler(event, context);
};

export default handler;
