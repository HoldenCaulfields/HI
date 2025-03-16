const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("mongodb connected"))
    .catch(error => console.error("mongodb error: ", error));

app.get('/', (req, res) => {
    res.send("Backend is running");
});

//Sample API route
app.get('/api/message', (req, res) => {
    res.json({message: "Hello from express.js"});
});

app.use('/api/auth', authRoutes);

app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`));