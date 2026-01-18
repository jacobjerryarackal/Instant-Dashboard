# Instant Dashboard App

Live Demo: https://instant-dashboard.vercel.app

This project demonstrates an AI-powered web application that transforms raw JSON data into a visual dashboard preview using a large language model.

Users provide structured JSON data along with a natural language prompt, and the system generates a one-page HTML/CSS dashboard that is rendered instantly in the browser.

---

## Screenshots

### Generated Website Preview

![Website Preview](public/screenshots/output1.png)

### JSON Input & Prompt

![JSON Preview](public/screenshots/output2.png)
![JSON Input](public/screenshots/output3.png)

### Awesome Design

![Design](public/screenshots/output4.png)
![Design](public/screenshots/output5.png)

### Generated Dashboard Preview

![Dashboard Preview](public/screenshots/output1.png)

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Plain CSS / CSS Modules
- Google Gemini API (LLM)
- Node.js

---

## Core Features

- JSON input with validation
- Natural language prompt input
- Secure server-side LLM integration
- Hidden system prompt to prevent hallucinations
- AI-generated HTML/CSS dashboard
- Live preview rendered using iframe
- Graceful error handling for invalid JSON

---

## Application Flow

1. User enters JSON data
2. User provides dashboard instructions in text
3. Backend sends data and system prompt to the LLM
4. LLM returns only valid HTML and CSS
5. Generated dashboard is rendered in a preview panel

---

## Example Test Data

### JSON Input

```json
{
  "report_title": "Monthly Office Spending",
  "currency": "USD",
  "expenses": [
    { "item": "High-speed Internet", "amount": 250 },
    { "item": "Coffee & Snacks", "amount": 400 },
    { "item": "Software Subscriptions", "amount": 1200 },
    { "item": "Office Electricity", "amount": 350 }
  ]
}
```
