// Asistora Live Chatbot
// NOTE: API keys must NOT be shipped to the browser.
// Remove any hard-coded secret and use a server-side proxy to call the Groq API.
const GROQ_API_KEY = ''; // intentionally empty — configure on the server
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

class AsistoraChatbot {
  constructor() {
    this.chatWindow = document.querySelector('.chatbot-window');
    this.chatToggle = document.querySelector('.chatbot-float');
    this.isTyping = false;
    this.chatInput = null;
    
    this.init();
  }

  init() {
    if (!this.chatWindow || !this.chatToggle) return;

    this.setupDOM();

  console.log('AsistoraChatbot: init');

  // Ensure chat is hidden initially (use CSS .active for transitions)
  this.chatWindow.classList.remove('active');

    // Accessible toggle button
    this.chatToggle.setAttribute('role', 'button');
    this.chatToggle.setAttribute('aria-expanded', 'false');
    this.chatToggle.setAttribute('aria-label', 'Open chat');
    // Make sure the float button is clickable and on top
    try {
      this.chatToggle.style.cursor = 'pointer';
      this.chatToggle.style.zIndex = '9999';
      this.chatWindow.style.zIndex = '9999';
      this.chatWindow.style.pointerEvents = 'auto';
    } catch (e) {
      // ignore style failures on older browsers
    }

    // Use setOpen for consistent open/close behavior
    // Debug: log pointer events on the float button to ensure clicks reach it
    this.chatToggle.addEventListener('pointerdown', (e) => {
      console.log('AsistoraChatbot: pointerdown on float', e.type, e.target);
    });
    this.chatToggle.addEventListener('click', (e) => {
      console.log('AsistoraChatbot: click on float');
      e.stopPropagation();
      const isOpen = this.chatWindow.classList.contains('active');
      this.setOpen(!isOpen);
    });

    // Mark that this script manages the chatbot to avoid duplicate handlers
    try {
      window.AsistoraChatbotLoaded = true;
    } catch (e) {}

    document.addEventListener('click', (e) => this.closeOnOutsideClick(e));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.setOpen(false);
    });

    this.addMessage('Hi! I\'m Asistora Bot 👋 Ask me anything about our AI chatbots, pricing, or services!', 'bot');
  }

  setupDOM() {
    // Messages container
    let messagesContainer = this.chatWindow.querySelector('.chat-messages');
    if (!messagesContainer) {
      messagesContainer = document.createElement('div');
      messagesContainer.className = 'chat-messages';
      messagesContainer.style.cssText = 'flex: 1; overflow-y: auto; padding: 1rem; background: #f8fafc;';
      
      // Clear and set up content area (second child)
      const contentArea = this.chatWindow.children[1];
      if (contentArea) {
        contentArea.innerHTML = '';
        contentArea.appendChild(messagesContainer);
      }
    }
    this.chatMessages = messagesContainer;

    // Input container
    let inputContainer = this.chatWindow.querySelector('.chat-input-container');
    if (!inputContainer) {
      inputContainer = document.createElement('div');
      inputContainer.className = 'chat-input-container';
      inputContainer.style.cssText = 'padding: 1rem; border-top: 1px solid #e2e8f0; background: white; display: flex; gap: 0.5rem; align-items: center;';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Type your message...';
      input.style.cssText = 'flex: 1; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 25px; font-size: 14px; outline: none;';
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendMessage();
        }
      });

      const sendBtn = document.createElement('button');
      sendBtn.innerHTML = '📤';
      sendBtn.style.cssText = 'background: var(--accent); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;';
      sendBtn.addEventListener('click', () => this.sendMessage());

      inputContainer.appendChild(input);
      inputContainer.appendChild(sendBtn);
      this.chatWindow.appendChild(inputContainer);
      
      this.chatInput = input;
    }
  }

  toggleChat() {
    // Backwards-compatible: toggle using setOpen
    this.setOpen(!this.chatWindow.classList.contains('active'));
  }

  closeOnOutsideClick(e) {
    if (!this.chatWindow.classList.contains('active')) return;
    if (this.chatWindow.contains(e.target) || this.chatToggle.contains(e.target)) return;
    this.setOpen(false);
  }

  setOpen(open) {
    if (open) {
      this.chatWindow.classList.add('active');
      this.chatToggle.setAttribute('aria-expanded', 'true');
    } else {
      this.chatWindow.classList.remove('active');
      this.chatToggle.setAttribute('aria-expanded', 'false');
    }
  }

  addMessage(text, sender = 'user') {
    const message = document.createElement('div');
    message.className = `message-${sender}`;
    message.style.cssText = `
      margin-bottom: 0.75rem;
      display: flex;
      ${sender === 'bot' ? 'justify-content: flex-start;' : 'justify-content: flex-end;'}
      padding-bottom: 0.25rem;
    `;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      max-width: 75%;
      padding: 0.875rem 1.125rem;
      border-radius: 20px;
      word-wrap: break-word;
      ${sender === 'bot' ? 
        'background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 8px;' : 
        'background: linear-gradient(135deg, var(--primary-dark), var(--primary-light)); color: white; border-bottom-right-radius: 8px;'}
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 14px;
      line-height: 1.4;
    `;
    bubble.textContent = text;
    
    message.appendChild(bubble);
    this.chatMessages.appendChild(message);
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.chatInput || !this.chatInput.value.trim() || this.isTyping) return;
    
    const message = this.chatInput.value.trim();
    this.chatInput.value = '';
    this.addMessage(message, 'user');
    
    this.showTyping();
    
    // SECURITY: Do NOT send API keys from the browser. If no server proxy is configured,
    // use a server-side proxy at /api/chat which reads GROQ_API_KEY from server env.
    if (!GROQ_API_KEY) {
      const payload = {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are Asistora Bot for Asistora AI agency - Intelligent Chatbots. Real Business Growth.

Key Info:
- Services: Customer Support Chatbots, Website Chatbots, WhatsApp Automation, Lead Generation, Appointment Booking, Custom AI Agents, Business Process Automation
- Target Clients: Universities, E-commerce, SMBs, Service Companies, Startups
- Pricing: Starter $49/mo (basic), Business $199/mo (advanced + analytics), Enterprise Custom
- Value Prop: 3x leads, 80% cost savings, 24/7 availability

Rules:
1. Answer ONLY from website context
2. Be professional & persuasive  
3. Always end with CTA: demo, pricing page, or contact
4. Keep responses 2-4 sentences max
5. Mention specific services when relevant`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7
      };

      // Try server proxy first
  // Prefer explicit proxy during local development so requests don't hit a static dev server (e.g. Live Server on :5500)
  const proxyHost = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '';
  const proxyUrl = proxyHost + '/api/chat';

      const tryProxy = (url) => fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(r => {
        if (!r.ok) throw new Error('Proxy not available');
        return r.json();
      });

      // Try primary port then fallback to alternate port (3000) before demo
      tryProxy(proxyUrl)
      .catch(() => {
        const altUrl = 'http://localhost:3000/api/chat';
        if (proxyUrl === altUrl) throw new Error('no-alt');
        return tryProxy(altUrl);
      })
      .then(data => {
        this.hideTyping();
        const reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || (data && data.reply) || 'Sorry, no reply.';
        this.addMessage(reply, 'bot');
      })
      .catch(() => {
        setTimeout(() => {
          this.hideTyping();
          this.addMessage('Thanks for the message — demo reply. To enable real AI replies, add your GROQ_API_KEY to the server .env and run the proxy.', 'bot');
        }, 800);
      });

      return;
    }

    // If a GROQ_API_KEY is present (NOT recommended in client-side code), the code would call the API.
    fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are Asistora Bot for Asistora AI agency - Intelligent Chatbots. Real Business Growth.

Key Info:
- Services: Customer Support Chatbots, Website Chatbots, WhatsApp Automation, Lead Generation, Appointment Booking, Custom AI Agents, Business Process Automation
- Target Clients: Universities, E-commerce, SMBs, Service Companies, Startups
- Pricing: Starter $49/mo (basic), Business $199/mo (advanced + analytics), Enterprise Custom
- Value Prop: 3x leads, 80% cost savings, 24/7 availability

Rules:
1. Answer ONLY from website context
2. Be professional & persuasive  
3. Always end with CTA: demo, pricing page, or contact
4. Keep responses 2-4 sentences max
5. Mention specific services when relevant`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7
      })
    })
    .then(res => res.json())
    .then(data => {
      this.hideTyping();
      this.addMessage(data.choices[0].message.content, 'bot');
    })
    .catch(() => {
      this.hideTyping();
      this.addMessage('Sorry, temporary issue! Try refresh or email hello@asistora.ai 🚀', 'bot');
    });
  }

  showTyping() {
    this.isTyping = true;
    const typingMsg = document.createElement('div');
    typingMsg.id = 'typing';
    typingMsg.className = 'message-bot';
    typingMsg.style.cssText = 'display: flex; justify-content: flex-start; padding-bottom: 0.25rem;';
    
    const typingBubble = document.createElement('div');
    typingBubble.style.cssText = `
      display: flex; align-items: center; gap: 0.5rem;
      background: #f1f5f9; color: #1e293b; padding: 0.875rem 1.125rem; 
      border-radius: 20px; border-bottom-left-radius: 8px;
      font-size: 14px;
    `;
    typingBubble.innerHTML = '<div style="width:16px;height:16px;border:2px solid #e2e8f0;border-radius:50%;border-top-color:var(--accent);animation:spin 1s linear infinite;"></div> Typing...';
    
    typingMsg.appendChild(typingBubble);
    this.chatMessages.appendChild(typingMsg);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new AsistoraChatbot();
});
