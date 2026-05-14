# UPGRADE-TODO - Asistora Premium Redesign

## Phase 1 — Foundations
- [ ] Update design tokens + premium SaaS base styles in `css/style.css`
- [ ] Add font loading (Inter/Geist/Satoshi/Manrope fallbacks) and improved typography scale
- [ ] Ensure animations respect `prefers-reduced-motion`

## Phase 2 — Homepage rebuild (index.html)
- [ ] Rewrite `index.html` with required 13-section premium layout
- [ ] Premium sticky navbar + mobile menu with CTA "Book Demo"
- [ ] Implement: Hero, Stats, Solutions, Problem vs Solution, How It Works (3 steps), Industries, Dashboard preview, Testimonials, Pricing, FAQ (accordion), Final CTA, Footer

## Phase 3 — Interactions + accessibility
- [ ] Upgrade `js/script.js` (mobile menu a11y, FAQ accordion ARIA, scroll reveal)
- [ ] Verify chatbot overlay still works across pages (`js/chatbot.js`)

## Phase 4 — Visual QA
- [ ] Mobile breakpoints validation
- [ ] Hover/keyboard focus states audit
- [ ] SEO meta title/description audit

## Phase 5 — Delivery
- [ ] Ensure all pages still render without console errors
- [ ] Optional: update other pages (about/services/portfolio/contact/pricing) to match new design system

