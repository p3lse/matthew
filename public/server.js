require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Secure Session Logging
app.use(session({
    secret: 'zaint_level_encryption_998',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24-hour login token
}));

// Fallback to avoid crash if .env is missing locally
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/esports';
mongoose.connect(mongoURI).catch(err => console.error("MongoDB Connection Error:", err));

// Database Models
const Client = mongoose.model('Client', new mongoose.Schema({
    name: String, description: String, socials: String, logoUrl: String
}));
const SiteText = mongoose.model('SiteText', new mongoose.Schema({
    elementId: String, textContent: String
}));

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'h7F!x9Qz$2pL';

// Password Authentication Route
app.post('/api/login', (req, res) => {
    if (req.body.password === ADMIN_PASS) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Password' });
    }
});

app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.isAdmin });
});

// Text CMS Routes
app.get('/api/text', async (req, res) => {
    const texts = await SiteText.find();
    res.json(texts);
});

app.post('/api/text', async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).send('Unauthorized');
    const { elementId, textContent } = req.body;
    await SiteText.findOneAndUpdate({ elementId }, { textContent }, { upsert: true });
    res.json({ success: true });
});

// Client Routes
app.get('/api/clients', async (req, res) => {
    const clients = await Client.find();
    res.json(clients);
});

app.post('/api/clients', async (req, res) => {
    if (!req.session.isAdmin) return res.status(401).send('Unauthorized');
    const newClient = new Client(req.body);
    await newClient.save();
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Elite backend active on port ${PORT}`));