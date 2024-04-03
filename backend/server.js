const mongoose = require('mongoose');
const express = require('express');
const app = express();
const usersRouter = require('./routes/user');
require('dotenv').config();


app.use(express.json());

// Using environment variable for MongoDB URI
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use('/api/users', usersRouter);

// Accessing PORT from environment variable, with a fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
