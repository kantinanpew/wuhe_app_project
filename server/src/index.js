// index.js
import dotenv from 'dotenv';
import express from 'express';
import admin from './firebase-admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Tea Farm API!' });
});

app.get('/api/tea-types', async (req, res) => {
  try {
    const db = admin.firestore();
    const teaSnapshot = await db.collection('teaTypes').get();
    const teaTypes = teaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teaTypes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tea types' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;