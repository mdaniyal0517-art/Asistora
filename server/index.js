const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Groq } = require("groq");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve frontend files

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Asistora Bot for Asistora AI agency - "Intelligent Chatbots. Real Business Growth."

Website Info:
- Services: AI Customer Support, Website Chatbots, WhatsApp Bots, Lead Generation, Appointment Booking, Custom AI Agents, Business Automation
- Pricing: Starter $49/mo, Business $199/mo, Enterprise Custom
- Clients: Universities, E-commerce, SMBs, Startups, Service Companies

Be professional, persuasive. End EVERY response with CTA. Concise: 2-4 sentences.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 250
    });

    res.json({ reply: completion.choices[0]?.message?.content || "Sorry, try again!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Chat service unavailable" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Asistora Server running on http://localhost:${PORT}`);
  console.log('Chat API: POST /api/chat');
  console.log('Frontend served from parent directory');
});
