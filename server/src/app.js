const express = require('express');
const cors = require('cors');
const analyzeRouter = require('./routes/analyze');
const chatRouter = require('./routes/chat');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/analyze', analyzeRouter);
app.use('/chat', chatRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
