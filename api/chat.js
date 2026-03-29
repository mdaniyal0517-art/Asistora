// Vercel Serverless Function - /api/chat
// Proxies client requests to Groq API using server-side env GROQ_API_KEY

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ ok: true, message: 'Asistora serverless proxy is running' });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end('Method Not Allowed');
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

    // If no key provided in env, return a safe demo response
    if (!GROQ_API_KEY) {
      return res.status(200).json({
        choices: [{ message: { content: 'Demo proxy reply: set GROQ_API_KEY in Vercel environment to enable real responses.' } }]
      });
    }

    // Forward the request body to Groq
    const fetchImpl = global.fetch || (await import('node-fetch')).default;

    const groqResp = await fetchImpl(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await groqResp.json();
    res.status(groqResp.status).json(data);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Proxy error' });
  }
};
