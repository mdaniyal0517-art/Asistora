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

    // Interactive navigation service catalog (single source of truth)
    // IMPORTANT: keep ONLY services that exist as <section id="..."> on your website.
    this.services = [
      {
        id: 'ai-customer-support-chatbots',
        icon: '🎭',
        title: 'AI Customer Support Chatbots',
        description: '24/7 support agents that resolve customer questions quickly and escalate when needed.',
        href: 'services.html#ai-customer-support-chatbots'
      },
      {
        id: 'website-chatbots',
        icon: '🧩',
        title: 'Website Chatbots',
        description: 'Engage visitors with proactive, personalized support that increases conversions.',
        href: 'services.html#website-chatbots'
      },
      {
        id: 'whatsapp-no-show-reducer',
        icon: '📉',
        title: 'WhatsApp No-Show Reducer',
        description: 'Automated reminders + nudges that reduce no-shows and improve attendance.',
        href: 'services.html#whatsapp-no-show-reducer'
      },
      {
        id: 'whatsapp-automation-bots',
        icon: '📱',
        title: 'WhatsApp Automation Bots',
        description: 'WhatsApp Business API flows for lead nurturing and customer communication.',
        href: 'services.html#whatsapp-automation-bots'
      },
      {
        id: 'lead-generation-bots',
        icon: '📬',
        title: 'Lead Generation Bots',
        description: 'Qualify leads 24/7 and book meetings automatically.',
        href: 'services.html#lead-generation-bots'
      },
      {
        id: 'ai-appointment-booking',
        icon: '📅',
        title: 'AI Appointment Booking',
        description: 'Frictionless scheduling that handles rescheduling and reminders.',
        href: 'services.html#ai-appointment-booking'
      },
      {
        id: 'custom-ai-agents',
        icon: '🤖',
        title: 'Custom AI Agents',
        description: 'Bespoke intelligence for complex workflows beyond simple chat.',
        href: 'services.html#custom-ai-agents'
      },
      {
        id: 'business-process-automation',
        icon: '⚙️',
        title: 'Business Process Automation',
        description: 'End-to-end workflow automation powered by AI decision-making.',
        href: 'services.html#business-process-automation'
      }

    ];


    this.init();
  }

  init() {
    if (!this.chatWindow || !this.chatToggle) return;

    this.setupDOM();

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
    // Pointer events (kept for potential future enhancements)
    this.chatToggle.addEventListener('pointerdown', () => {});


    this.chatToggle.addEventListener('click', (e) => {

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
        'background: #F3F4F6; color: #1F2937; border-bottom-left-radius: 8px; border: 1px solid #E5E7EB;' : 
        'background: #374151; color: #ffffff; border-bottom-right-radius: 8px; border: 1px solid rgba(55, 65, 81, 0.35);'}
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
      font-size: 14px;
      line-height: 1.4;
    `;

    bubble.textContent = text;
    
    message.appendChild(bubble);
    this.chatMessages.appendChild(message);
    this.scrollToBottom();
  }

  // Keyword-based UX helpers (navigation-first bot)
  shouldShowServiceCards(userText) {
    const t = (userText || '').toLowerCase();
    const offerIntents = [
      'what do you offer',
      'what you offer',
      'what do you have',
      'what can you do',
      'show your services',
      'show services',
      'services',
      'service',
      'products',
      'product',
      'do you offer',
      'what can you do',
      'options',
      'browse'
    ];
    return offerIntents.some(k => t.includes(k));
  }


  resolveServiceFromText(userText) {
    // Map user intent keywords to ONLY the 8 allowed services.
    const t = (userText || '').toLowerCase();

    const map = [
      // 1) AI Customer Support Chatbots
      { test: ['support', 'customer support', 'helpdesk', 'help desk', 'faq'], id: 'ai-customer-support-chatbots' },

      // 2) Website Chatbots
      { test: ['website', 'web site', 'site', 'landing', 'web chatbot', 'chatbot'], id: 'website-chatbots' },

      // 3) WhatsApp No-Show Reducer
      { test: ['no-show', 'no show', 'noshow', 'missed appointment', 'no show reducer'], id: 'whatsapp-no-show-reducer' },

      // 4) WhatsApp Automation Bots
      { test: ['whatsapp', 'whats app', 'wa bot', 'whatsapp automation', 'message', 'messaging'], id: 'whatsapp-automation-bots' },

      // 5) Lead Generation Bots
      { test: ['lead', 'leads', 'generate leads', 'lead gen', 'lead generation'], id: 'lead-generation-bots' },

      // 6) AI Appointment Booking
      { test: ['appointment', 'book', 'booking', 'schedule', 'reschedule', 'calendar'], id: 'ai-appointment-booking' },

      // 7) Custom AI Agents
      { test: ['custom', 'agent', 'agents', 'ai agents', 'build agent', 'custom ai'], id: 'custom-ai-agents' },

      // 8) Business Process Automation
      { test: ['automation', 'automate', 'workflow', 'workflows', 'process', 'business process', 'orchestration'], id: 'business-process-automation' }
    ];

    for (const row of map) {
      if (row.test.some(k => t.includes(k))) return row.id;
    }
    return null;
  }



  renderServiceCards({ subsetIds = null, introText = 'Here are our available automation products. Click any option to explore more.' } = {}) {

    const ids = subsetIds && subsetIds.length ? subsetIds : this.services.map(s => s.id);
    // Reliability: render only destinations that exist on services.html.
    const cards = ids
      .map(id => this.services.find(s => s.id === id))
      .filter(Boolean)
      .filter(service => {
        try {
          const anchorId = (service && service.id) ? service.id : '';
          if (!anchorId) return false;
          // Since all links are to services.html#<id>, we can validate the hash target
          // when user is already on services.html. Otherwise we still validate against
          // a DOM-less environment by checking window location.
          const isOnServicesPage = (window.location.pathname || '').endsWith('services.html');
          if (!isOnServicesPage) return true; // will be validated again after navigation
          return !!document.getElementById(anchorId);
        } catch (e) {
          return false;
        }
      });


    // Intro message bubble
    if (introText) {
      this.addMessage(introText, 'bot');
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'chat-services-wrapper';
    wrapper.style.cssText = 'margin-top: 10px; display:grid; grid-template-columns: 1fr; gap: 10px;';

    cards.forEach(service => {
      const card = document.createElement('a');
      card.setAttribute('href', service.href);
      card.setAttribute('role', 'button');

      card.className = 'chat-service-card';
      card.setAttribute('aria-label', `Open ${service.title}`);
      card.style.cssText = `
        display:flex; align-items:flex-start; gap: 12px;
        width: 100%;
        text-align:left;
        padding: 12px 12px;
        border-radius: 16px;
        background: rgba(255,255,255,0.98);
        border: 1px solid #E5E7EB;
        box-shadow: 0 6px 18px rgba(15,23,42,0.05);
        cursor:pointer;
        transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
      `;


      // Click should follow the real href.
      // We still call navigateToService to close the chatbot immediately.
      card.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToService(service);
      });
      // Also expose href for debugging/a11y
      card.setAttribute('data-href', service.href);
      // Ensure card behaves like a link
      card.style.textDecoration = 'none';



      // Icon

      const icon = document.createElement('div');
      icon.textContent = service.icon;
      icon.setAttribute('aria-hidden', 'true');
      icon.style.cssText = 'font-size: 22px; width: 34px; height: 34px; display:flex; align-items:center; justify-content:center; border-radius: 12px; background: rgba(31,41,55,0.06); border: 1px solid #E5E7EB; color: #111827;';


      const body = document.createElement('div');
      body.style.cssText = 'min-width:0;';

      const title = document.createElement('div');
      title.textContent = service.title;
      title.style.cssText = 'font-weight: 800; font-size: 14px; color: rgba(2,8,23,0.92);';

      const desc = document.createElement('div');
      desc.textContent = service.description;
      desc.style.cssText = 'margin-top: 4px; font-size: 12.5px; color: rgba(2,8,23,0.65); line-height: 1.35;';

      const arrow = document.createElement('div');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.style.cssText = 'margin-left:auto; color: rgba(31,41,55,0.78); font-weight:900; padding-top:2px;';


      body.appendChild(title);
      body.appendChild(desc);

      card.appendChild(icon);
      card.appendChild(body);
      card.appendChild(arrow);

      // Hover animation (with reduced motion support via CSS)
      card.addEventListener('pointerenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 14px 28px rgba(15,23,42,0.10)';
        card.style.borderColor = '#D1D5DB';
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 6px 18px rgba(15,23,42,0.05)';
        card.style.borderColor = '#E5E7EB';
      });


      wrapper.appendChild(card);
    });

    // Wrap inside a bot message row for consistent spacing
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom: 0.75rem; display:flex; justify-content:flex-start; padding-bottom:0.25rem;';
    const bubble = document.createElement('div');
    bubble.style.cssText = 'max-width: 100%; width: 100%;';
    bubble.appendChild(wrapper);
    row.appendChild(bubble);

    this.chatMessages.appendChild(row);
    this.scrollToBottom();
  }

  navigateToService(service) {
    try {
      if (!service || !service.href) return;

      // Close chatbot first so user sees navigation immediately
      this.setOpen(false);

      const url = service.href;
      const hash = url.includes('#') ? url.split('#')[1] : '';

      if (hash) {
        // Navigate with hash, then force scroll after load (helps on some browsers)
        window.location.href = `services.html#${hash}`;
        // Also set a flag for the next page load
        try {
          window.sessionStorage.setItem('asistoraScrollTo', hash);
        } catch (e) {}
        return;
      }

      window.location.href = url;
    } catch (e) {
      // Fallback: no-op
    }
  }



  // Ensure smooth scroll to hash target after arriving on services.html
  afterNavigationScroll() {
    try {
      const isServicesPage = window.location.pathname && window.location.pathname.endsWith('services.html');
      if (!isServicesPage) return;

      // Prefer hash in URL; fallback to our scroll flag.
      const urlHash = (window.location.hash || '').replace('#', '').trim();
      const sessionHash = (() => {
        try {
          return window.sessionStorage.getItem('asistoraScrollTo') || '';
        } catch (e) {
          return '';
        }
      })();

      const hash = urlHash || sessionHash;
      if (!hash) return;

      const el = document.getElementById(hash);
      if (!el) {
        console.warn('Chatbot scroll target not found:', hash);
        return;
      }

      // Allow layout to settle before scrolling (esp. on mobile)
      const doScroll = () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(doScroll);
      });

      // Clear flag after use
      try {
        window.sessionStorage.removeItem('asistoraScrollTo');
      } catch (e) {}
    } catch (e) {
      // no-op
    }
  }




  sendMessage() {
    if (!this.chatInput || !this.chatInput.value.trim() || this.isTyping) return;

    const message = this.chatInput.value.trim();
    const shouldCards = this.shouldShowServiceCards(message);
    const matchedServiceId = this.resolveServiceFromText(message);
    const subsetIds = matchedServiceId ? [matchedServiceId] : null;
    
    // Decide cards-before-AI (navigation-first UX)
    const cardsBeforeAI = shouldCards || !!matchedServiceId;

    this.chatInput.value = '';
    this.addMessage(message, 'user');

      // Navigation-first UX: show interactive cards immediately
    if (cardsBeforeAI) {
      this.hideTyping();

      // If user asks about services/products/solutions, show ONLY the 8 services.
      // If message matches a specific service, show just that service.
      const shouldShowAll = shouldCards && !matchedServiceId;
      const intro = shouldCards ? 'Here are our AI automation services. Click any service to explore more.' : '';

      this.renderServiceCards({
        subsetIds: shouldShowAll ? null : subsetIds,
        introText: intro
      });
      return;
    }


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
  const isLocalhost = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const localProxyUrl = 'http://localhost:3000/api/chat';
  const vercelProxyUrl = 'https://asistora.vercel.app/api/chat';
  const proxyUrl = isLocalhost ? localProxyUrl : vercelProxyUrl;

      const tryProxy = (url) => fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(r => {
        if (!r.ok) throw new Error('Proxy not available');
        return r.json();
      });

      // Local: if :3000 fails, try direct (302/alt) before showing demo.
      // Production: only try the configured Vercel proxy.
      (isLocalhost ? tryProxy(proxyUrl).catch(() => tryProxy(vercelProxyUrl)) : tryProxy(proxyUrl))
      .then(data => {
        this.hideTyping();
        const reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || (data && data.reply) || 'Sorry, no reply.';
        this.addMessage(reply, 'bot');
      })
      .catch(() => {
        setTimeout(() => {
          this.hideTyping();
          const attempted = proxyUrl;
          this.addMessage(`Sorry — demo reply. Proxy failed (${attempted}). To enable real AI replies, set GROQ_API_KEY on the server and re-run the proxy.`, 'bot');
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
      background: #F3F4F6; color: #1F2937; padding: 0.875rem 1.125rem; 
      border-radius: 20px; border-bottom-left-radius: 8px;
      font-size: 14px;
      border: 1px solid #E5E7EB;
    `;
    typingBubble.innerHTML = '<div style="width:16px;height:16px;border:2px solid #E5E7EB;border-radius:50%;border-top-color:var(--accent);animation:spin 1s linear infinite;"></div> Typing...';

    
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
  const bot = new AsistoraChatbot();
  // If we loaded services.html#hash, scroll smoothly to the matching section.
  if (bot && typeof bot.afterNavigationScroll === 'function') bot.afterNavigationScroll();
});

