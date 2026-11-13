
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const leadRoutes = require('./routes/leadRoutes');
const connectdb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/leads', leadRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/pass-reset', passwordResetRoutes);

app.get('/home', (req, res) => {
    res.send('hello hy guys');
});

app.get('/test', (req, res) => {
    res.json({
        status: true,
        message: "Backend is working"
    });
});

// Start server only after MongoDB connects
const startServer = async () => {
    try {
        await connectdb();

        app.listen(PORT, () => {
            console.log('Server is running on PORT', PORT);
        });

    } catch (error) {
        console.log('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
