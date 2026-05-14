# TODO - Interactive Navigation Assistant for Assistora

- [ ] Create reusable service catalog in `js/chatbot.js` (6 services with icon/title/description/target url+hash)
- [ ] Update `js/chatbot.js` to render clickable service cards inside chatbot when user asks “What do you offer?” and for relevant keywords
- [ ] Implement card click behavior: smooth scroll (same page) or redirect to `services.html#anchor` (other pages) + optional chatbot minimize
- [ ] Add service sections/anchors in `services.html` for:
  - [ ] WhatsApp No-Show Reducer
  - [ ] AI Review Reply Generator
  - [ ] Rebooking & Loyalty Nudges
  - [ ] Missed-Call to Booking Textback
  - [ ] Quote Follow-Up Autopilot
  - [ ] Review Request Engine
- [x] Add modern card/button styles for in-chat service cards in `css/style.css`

- [ ] Ensure accessibility (keyboard + aria) and reduced-motion support
- [ ] Quick manual test: open homepage/services and use chatbot to navigate

