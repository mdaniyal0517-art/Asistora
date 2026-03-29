const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fetch = require('node-fetch');
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve frontend files

app.post('/api/chat', async (req, res) => {
  try {
    // If no API key configured, return a demo response
    if (!GROQ_API_KEY) {
      return res.json({
        choices: [ { message: { content: 'Demo proxy reply: set GROQ_API_KEY in server/.env to enable real responses.' } } ]
      });
    }

    // Forward the received payload to the Groq API
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

// Helpful GET for quick status checks from a browser
app.get('/api/chat', (req, res) => {
  res.json({
    ok: true,
    message: 'Asistora proxy is running. POST JSON to this endpoint to get chat responses.'
  });
});

app.listen(PORT, () => {
  console.log(`Asistora proxy listening on http://localhost:${PORT}`);
});
