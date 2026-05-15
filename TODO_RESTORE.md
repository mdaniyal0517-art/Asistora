# Restore corrupted HTML files + SaaS redesign

## Restore step (required)
- [x] Restore `services.html` from `services_fixed.html` (will execute immediately).
- [ ] Restore `about.html`, `portfolio.html`, `contact.html`, and `pricing.html` from their backups (if provided) or from the latest known-good versions.

## Verify
- [ ] Run a quick HTML parse check (prettier --check or node/html parser).

## SaaS layout redesign
- [ ] Convert long presentation sections into card-based SaaS grids on: `index.html`, `services.html`, `about.html`, `portfolio.html`, `pricing.html`, `contact.html`.
- [ ] Each service section: 1-line value statement + <=3 bullets + CTA.
- [ ] Ensure chatbot services already show 8 allowed cards.
- [ ] Validate mobile responsiveness + hover animations.

