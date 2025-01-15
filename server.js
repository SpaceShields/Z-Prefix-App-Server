const express = require('express');
const cors = require('cors');

// Create the express application
const app = express();

// setting port from environment or default to 5000
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/users', require('./routes/userRoute'));
app.use('/items', require('./routes/itemRoute'));

// Error handling middleware

// Server running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});