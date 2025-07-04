const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const sensorController = require('./controllers/sensorController');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/data', sensorController.postSensorData);
app.get('/api/data', sensorController.getLatestData);
app.get('/api/data/all', sensorController.getAllData);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
