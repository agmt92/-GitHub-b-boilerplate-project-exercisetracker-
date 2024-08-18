require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Define Exercise Schema
const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// Create a new user
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = new User({ username });
    const savedUser = await newUser.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add an exercise to a user
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercise = new Exercise({
      userId: _id,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    });

    const savedExercise = await exercise.save();
    res.json({
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve exercise log of a user
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = { userId: _id };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    let exercises = Exercise.find(query).select('description duration date');
    if (limit) exercises = exercises.limit(parseInt(limit));

    const log = await exercises.exec();

    res.json({
      username: user.username,
      count: log.length,
      _id: user._id,
      log: log.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});