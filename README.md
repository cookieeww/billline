# Billline — Free Invoice Generator

A fast, clean, 100% private in-browser invoice generator. No sign up required, no watermarks, no file uploads — your data never leaves your device.

Live demo: (local build ready for Cloudflare Pages / GitHub Pages deployment)

## Features

- **100% Private & Client-Side:** Runs entirely in your browser using standard JS. Zero server uploads, zero network dependencies.
- **No Sign-Up & No Watermark:** Create professional A4 PDF invoices instantly without creating an account or paying for watermark removal.
- **Custom Branding:** Upload your company logo, fill in your details, and preview changes live in real time.
- **Multi-Currency Support:** Format invoices in 28+ global currencies (USD, EUR, GBP, INR, AUD, CAD, JPY, etc.) or currency-less mode.
- **Automatic Calculations:** Real-time subtotal, percent or fixed discounts, and percent or fixed tax calculations formatted in integer cents for accuracy.
- **Autosave Draft:** Automatically saves your work to `localStorage` so you never lose an in-progress invoice.
- **Print & PDF Ready:** Custom `@media print` stylesheet optimized for 1-page A4 PDF output via your browser's native print dialog.
- **Sample Data Toggle:** Load a pre-populated sample invoice with 1 click to test or customize.
- **Ultra-Fast & Lightweight:** Entire application footprint is ~40 KB total (HTML, CSS, JS combined) with 0 third-party npm dependencies.

## Quick Start (Local Run)

No `npm install` or build step needed.

```bash
# Clone the repository
git clone https://github.com/your-username/billline.git
cd billline

# Run with any local HTTP server (or open index.html directly)
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Running Tests

Automated tests run via Node's native test runner (`node:test`) and Headless Chrome CDP:

```bash
# Run unit tests
node --test tests/smoke.test.mjs
```

## Tech Stack

- **HTML5:** Semantic structure, accessible form fields, skip link, viewport meta.
- **CSS3:** Flexbox & CSS Grid, CSS custom properties, custom print stylesheet (`@media print`).
- **JavaScript (ES5/ES6):** Modular plain JS (`format.js`, `money.js`, `store.js`, `app.js`).
- **Testing:** Node.js native test runner + CDP browser automation test.

## Security & Privacy

- All user data is processed locally in the DOM and cached in `localStorage`.
- No analytics, cookies, tracking scripts, or server requests.
- All user inputs rendered into HTML pass through HTML entity escaping to prevent XSS.

## License

MIT License. Free to use, modify, and host.
