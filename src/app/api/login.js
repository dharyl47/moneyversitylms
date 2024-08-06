import clientPromise from '../lib/mongo';
import CryptoJS from 'crypto-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('moneyversity');

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For simplicity, we'll just return a success message
    // You should implement JWT or session management here
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
