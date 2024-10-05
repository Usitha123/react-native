// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Sample Schema and Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', UserSchema);

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  try {
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start server locally (optional)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
