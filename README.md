# New Start Media — marketing website

The first production website for **New Start Media Ltd.** A static marketing
page plus working lead capture. Nothing more — no CMS, no database, no
customer accounts, no dashboard.

## Positioning

New Start Media helps established, owner-operated service businesses (movers,
HVAC, plumbing, electrical, roofing, landscaping, trades, and similar
appointment/job-based businesses) increase revenue and reduce owner workload
by improving the systems between customer acquisition, operations and
payment. AI is an enabling technology, not the product — and the site is
explicit that AI belongs *behind* the employee, not automatically between the
business and its customers.

## Stack

Plain HTML + CSS + JS. No framework, no build step, no external fonts or
assets — the same proven, zero-dependency approach used for the New Start
Moving site (`../new-start-moving-landing`), reused here without coupling
the two businesses together (no shared code, no shared config/secrets,
separate repo, separate deploy).

| File | Purpose |
|---|---|
| `index.html` | The whole site: hero, positioning sections, Business Systems Review explainer, lead form |
| `privacy/index.html` | Privacy Policy |
| `styles.css` | Design tokens + all styling |
| `app.js` | Form validation, bot guards, submit, success state |
| `config.js` | Non-secret config: Web3Forms key, lead subject |
| `404.html` | Fallback page |
| `robots.txt`, `sitemap.xml` | Baseline technical SEO |

## Form delivery — Web3Forms

Same pattern as New Start Moving, but **a separate Web3Forms key** — leads
for the two businesses must not land in the same inbox/account by accident.

**To connect it (one-time, ~1 minute):**

1. Go to <https://web3forms.com> and enter the email address that should
   receive New Start Media inquiries.
2. Copy the **Access Key** it emails you (a UUID — designed to be public,
   not a secret).
3. Paste it into `config.js` as `web3formsAccessKey` and commit.

Until a key is set, the form validates but shows a visible "not connected"
message instead of sending — a lead can never be silently dropped.

Bot protection: a hidden honeypot field plus a minimum time-on-page check.
No CAPTCHA friction.

## Lead form fields

Name, business name, email, phone, website (optional), type of business,
approximate number of employees, and the business's biggest
operational/customer-growth problem — deliberately short, enough to qualify
and start a real conversation, not a long questionnaire.

## What was intentionally left out of v1

Per the initial release scope: no Services/Blog/Case-Studies/About pages,
no customer accounts, no dashboard, no CRM, no custom auth, no database, no
Mission Control integration. Add pages only when they materially improve the
experience — not to make the site look larger.

No testimonials, customer counts, or case studies are included because none
exist yet to honestly report. The "persistent company intelligence" AI
section is deliberately hedged ("exploring," "the direction we're building
toward") — it is not claimed as a fully deployed capability.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deployment (Render Static Site)

Auto-deploys from the `main` branch. No build step; publish directory is the
repo root.

No custom domain is owned/confirmed for New Start Media yet — `canonical`,
Open Graph, `sitemap.xml`, and `robots.txt` all currently point at the
generated `*.onrender.com` URL. Once a domain is purchased and connected,
update those four references to the real domain.
