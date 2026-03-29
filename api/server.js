const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fetch = require('node-fetch');
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const app = express();

app.use(cors());
app.use(express.json());

// API endpoint for chatbot proxy
app.post('/chat', async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      return res.json({
        choices: [{ message: { content: 'Demo proxy reply: set GROQ_API_KEY in Vercel env to enable real responses.' } }]
      });
    }

    const r = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await r.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy error' });
  }
});

// Status check
app.get('/chat', (req, res) => {
  res.json({
    ok: true,
    message: 'Asistora proxy is running. POST JSON to /chat for responses.'
  });
});

module.exports = app;

