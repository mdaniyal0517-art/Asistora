Server proxy for Asistora chatbot

- Copy `server/.env.example` to `server/.env` and set `GROQ_API_KEY`.
- Install dependencies in `server` folder: `npm install`.
- Start the proxy: `npm start` (defaults to port 8081).
- The client will POST to `/api/chat` on the proxy (client code calls the same-origin path if configured).

Security note: never commit `.env` with secrets.

Quick start (PowerShell)

```powershell
Push-Location server
npm install
npm start
Pop-Location
```
