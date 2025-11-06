# EmotiScope Payment Integration Guide

**Version:** 1.0
**Date:** 2025-11-06
**Status:** Ready for Production

---

## 📋 OVERVIEW

This guide covers complete payment integration for EmotiScope using Gumroad (recommended) or Stripe.

**What's Implemented:**
- ✅ License key generation system
- ✅ Webhook handlers (Gumroad & Stripe)
- ✅ Success page with key display
- ✅ Email templates
- ✅ Test mode for development
- ✅ Production-ready pricing page

---

## 🚀 QUICK START (Gumroad - 15 minutes)

### Step 1: Create Gumroad Account
1. Go to [gumroad.com/signup](https://gumroad.com/signup)
2. Complete profile setup
3. Add payment details (for receiving money)

### Step 2: Create Products
1. Click "+" → "New Product"
2. Create **Premium** product:
   - Name: "EmotiScope Premium"
   - Price: $9.99/month (recurring)
   - Description: "Unlimited AI messages, advanced analytics, history export"
   - Permalink: `emotiscope-premium`
3. Create **Pro** product:
   - Name: "EmotiScope Pro"
   - Price: $19.99/month (recurring)
   - Permalink: `emotiscope-pro`

### Step 3: Configure Webhooks
1. In Gumroad dashboard → Settings → Advanced
2. Add Ping URL: `https://your-domain.com/api/webhooks/gumroad`
3. Enable "Sale" events
4. Save

### Step 4: Deploy Webhook Handler
Deploy `/server/webhooks/gumroad.js` to:
- **Vercel:** `vercel deploy`
- **Netlify:** Copy to `/netlify/functions/gumroad.js`
- **Railway:** `railway up`

### Step 5: Test
1. Make test purchase on Gumroad (use test mode)
2. Verify webhook received
3. Check license generated
4. Test email delivery

**Done! You're live.**

---

## 💳 GUMROAD INTEGRATION (Detailed)

### Advantages
- ✅ **Easiest** - 5-minute setup
- ✅ **No backend needed** for payments
- ✅ **Handles VAT/taxes** automatically
- ✅ **Email delivery** built-in
- ✅ **Global payments** supported

### Disadvantages
- ❌ 10% fee (higher than Stripe)
- ❌ Less customization
- ❌ Basic analytics

### Product Setup

**Premium Product ($9.99/month):**
```
Name: EmotiScope Premium
Price: $9.99
Recurring: Monthly
Permalink: emotiscope-premium

Description:
Master your emotions with unlimited AI-powered conversations.

What's Included:
• Unlimited AI messages per month
• Full Learn Mode & Chat Mode access
• Advanced emotional analytics
• Conversation history export (CSV/PDF)
• {self} map visualization
• Priority feature access
• 100% private & local storage

Your license key will be emailed immediately after purchase.
```

**Pro Product ($19.99/month):**
```
Name: EmotiScope Pro
Price: $19.99
Recurring: Monthly
Permalink: emotiscope-pro

Description:
Professional emotional intelligence tools for therapists and coaches.

What's Included:
• Everything in Premium
• White-label branding for your practice
• Client progress tracking
• API access for custom integrations
• Priority email support (4-hour response)
• Quarterly strategy calls
• Commercial usage rights

Your license key will be emailed immediately after purchase.
```

### Webhook Handler

**File:** `/server/webhooks/gumroad.js`

**Deployment Options:**

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd emotiscope/server
vercel deploy

# Set as production
vercel --prod
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "functions": {
    "webhooks/gumroad.js": {
      "memory": 128,
      "maxDuration": 10
    }
  }
}
```

**Option B: Netlify Functions**
```bash
# Move webhook to netlify directory
mkdir -p netlify/functions
cp server/webhooks/gumroad.js netlify/functions/

# Deploy
netlify deploy --prod
```

**Netlify Configuration (`netlify.toml`):**
```toml
[functions]
  directory = "netlify/functions"
```

**Option C: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd emotiscope/server
railway init
railway up
```

### Testing Gumroad Integration

**1. Test Mode:**
```bash
# Run locally
node server/webhooks/gumroad.js

# Use ngrok for webhook testing
ngrok http 3000
```

**2. Test Purchase:**
- Go to `https://gumroad.com/l/emotiscope-premium`
- Use test credit card: `4242 4242 4242 4242`
- Complete purchase
- Check webhook logs

**3. Verify:**
- License key generated?
- Email sent?
- Key works in app?

---

## 💎 STRIPE INTEGRATION (Advanced)

### Advantages
- ✅ **Lower fees** - 2.9% + 30¢
- ✅ **Full control** over checkout
- ✅ **Advanced analytics**
- ✅ **Better branding**
- ✅ **Subscription management**

### Disadvantages
- ❌ More complex setup
- ❌ Need backend server
- ❌ Handle tax compliance

### Setup

**Step 1: Create Stripe Account**
1. Go to [stripe.com/register](https://stripe.com/register)
2. Complete verification
3. Get API keys (Dashboard → Developers → API keys)

**Step 2: Create Products**
1. Products → "+ Add Product"
2. **Premium Product:**
   - Name: EmotiScope Premium
   - Pricing: Recurring, $9.99/month
   - Copy Price ID: `price_xxxxx`
3. **Pro Product:**
   - Name: EmotiScope Pro
   - Pricing: Recurring, $19.99/month
   - Copy Price ID: `price_xxxxx`

**Step 3: Environment Variables**
```bash
# .env file
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PREMIUM_PRICE_ID=price_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
```

**Step 4: Deploy Webhook**
Deploy `/server/webhooks/stripe.js` to your server.

**Step 5: Configure Webhook in Stripe**
1. Developers → Webhooks → "+ Add endpoint"
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook signing secret

### Checkout Implementation

**Add to `pricing.html`:**
```html
<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');

async function checkoutPremium() {
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            priceId: 'price_premium_monthly',
            tier: 'premium'
        })
    });

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
}
</script>
```

**Create Checkout Session (Server):**
```javascript
// /api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    const { priceId, tier } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: priceId,
            quantity: 1,
        }],
        mode: 'subscription',
        success_url: `https://your-domain.com/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://your-domain.com/pricing.html`,
        metadata: {
            tier: tier
        }
    });

    res.json({ id: session.id });
};
```

---

## 🔑 LICENSE KEY SYSTEM

### Generator

**File:** `/server/license-generator.js`

**CLI Usage:**
```bash
# Generate single key
node license-generator.js generate premium user@example.com

# Generate batch
node license-generator.js batch premium 100

# Validate format
node license-generator.js validate PREMIUM-A2B3-C4D5-E6F7

# Verify in database
node license-generator.js verify PREMIUM-A2B3-C4D5-E6F7
```

**Programmatic Usage:**
```javascript
const LicenseGenerator = require('./license-generator');

// Generate key
const license = LicenseGenerator.generate('premium', 'user@example.com');
console.log(license.key); // PREMIUM-X7Y2-Z3A4-B5C6

// Validate format
const isValid = LicenseGenerator.validateFormat('PREMIUM-A2B3-C4D5-E6F7');

// Verify license
const license = await LicenseGenerator.verifyLicense('PREMIUM-A2B3-C4D5-E6F7');
```

### Storage

**Simple JSON File (Development):**
```javascript
// Stores in /server/licenses.json
await LicenseGenerator.saveLicense(licenseData);
```

**Database (Production):**
```javascript
// PostgreSQL example
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);

await client.query(`
    INSERT INTO licenses (key, tier, email, created_at)
    VALUES ($1, $2, $3, $4)
`, [license.key, license.tier, license.email, license.createdAt]);
```

**Redis (High Performance):**
```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

await client.set(`license:${license.key}`, JSON.stringify(license));
await client.expire(`license:${license.key}`, 31536000); // 1 year
```

---

## 📧 EMAIL DELIVERY

### Option 1: SendGrid (Recommended)

**Setup:**
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: customerEmail,
    from: 'hello@emotiscope.com',
    subject: 'Your EmotiScope License Key',
    html: emailHTML,
};

await sgMail.send(msg);
```

**Cost:** Free for 100 emails/day, then $15/month for 40K emails.

### Option 2: Resend (Modern)

**Setup:**
```bash
npm install resend
```

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
    from: 'EmotiScope <hello@emotiscope.com>',
    to: customerEmail,
    subject: 'Your EmotiScope License Key',
    html: emailHTML,
});
```

**Cost:** 3,000 emails/month free, then $20/month.

### Option 3: Mailgun

**Setup:**
```bash
npm install mailgun.js
```

```javascript
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});

await mg.messages.create('yourdomain.com', {
    from: 'EmotiScope <hello@emotiscope.com>',
    to: customerEmail,
    subject: 'Your EmotiScope License Key',
    html: emailHTML
});
```

**Cost:** 5,000 emails/month free, then $35/month.

---

## 🧪 TESTING

### Local Testing

**1. Test License Generation:**
```bash
cd emotiscope/server
node license-generator.js generate premium test@example.com
```

**2. Test Webhook Locally:**
```bash
# Install dependencies
npm install

# Run webhook
node -e "const handler = require('./webhooks/gumroad'); handler({ method: 'POST', body: { sale_id: 'test', email: 'test@example.com', product_name: 'Premium' }}, { json: console.log, status: () => ({ json: console.log }) })"
```

**3. Test with ngrok:**
```bash
# Install ngrok
npm i -g ngrok

# Expose local server
ngrok http 3000

# Use ngrok URL in Gumroad webhook settings
```

### Production Testing

**1. Test Mode Purchase:**
- Gumroad: Enable "Test Mode" in product settings
- Stripe: Use test API keys

**2. Test Credit Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

**3. Verify Flow:**
1. Make test purchase
2. Check webhook received (logs)
3. Verify license generated
4. Check email delivered
5. Test license activation in app
6. Verify unlimited access

---

## 🚢 DEPLOYMENT

### Recommended Stack

**Frontend:** Netlify or Vercel (free)
**Webhook:** Vercel Functions or Netlify Functions
**Database:** Supabase (PostgreSQL, free tier)
**Email:** Resend or SendGrid

### Deployment Steps

**1. Deploy Frontend:**
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod
```

**2. Deploy Webhooks:**
```bash
# Vercel Functions
cd emotiscope/server
vercel deploy --prod

# Netlify Functions
# Move to netlify/functions/
netlify deploy --prod
```

**3. Set Environment Variables:**
```bash
# Vercel
vercel env add STRIPE_SECRET_KEY
vercel env add SENDGRID_API_KEY

# Netlify
netlify env:set STRIPE_SECRET_KEY sk_live_xxx
```

**4. Configure Domain:**
- Point domain to Netlify/Vercel
- Enable SSL (automatic)
- Update webhook URLs in Stripe/Gumroad

---

## 📊 MONITORING

### Webhook Logs

**Gumroad:**
- Dashboard → Settings → Advanced → Webhook logs

**Stripe:**
- Developers → Webhooks → View logs

### Custom Monitoring

**Add to webhook handler:**
```javascript
// Log all webhook events
console.log('[WEBHOOK]', {
    timestamp: new Date().toISOString(),
    type: event.type,
    customer: event.customer,
    amount: event.amount
});

// Track metrics
// analytics.track('license_generated', { tier, email });
```

### Error Alerts

**Use Sentry:**
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });

try {
    // webhook logic
} catch (error) {
    Sentry.captureException(error);
    throw error;
}
```

---

## 🛡️ SECURITY

### Best Practices

1. **Verify Webhook Signatures**
   - Gumroad: IP whitelist or shared secret
   - Stripe: Verify `stripe-signature` header

2. **Validate Input**
   - Check email format
   - Sanitize product IDs
   - Verify amounts

3. **Rate Limiting**
   - Max 100 webhook calls/minute
   - Block suspicious IPs

4. **Secrets Management**
   - Use environment variables
   - Never commit API keys
   - Rotate keys quarterly

5. **HTTPS Only**
   - Enforce SSL/TLS
   - HSTS headers
   - Secure cookies

---

## 💰 COST BREAKDOWN

### Gumroad
- **Transaction Fee:** 10%
- **$10 sale:** You receive $9
- **No monthly fee**

### Stripe
- **Transaction Fee:** 2.9% + 30¢
- **$10 sale:** You receive $9.41
- **No monthly fee for basic**

### Infrastructure (Recommended)
- **Netlify/Vercel:** Free for <100GB bandwidth
- **Database (Supabase):** Free for <500MB
- **Email (Resend):** Free for <3,000 emails/month
- **Monitoring (Sentry):** Free for 5,000 events/month

**Total monthly cost at 100 paying customers: $0-$20**

---

## 📈 SCALING

### 0-100 Customers
- Gumroad + Netlify Functions
- JSON file storage
- Free tier everything
- **Cost:** ~$0/month

### 100-1,000 Customers
- Stripe + Vercel Functions
- PostgreSQL (Supabase)
- SendGrid
- **Cost:** ~$50/month

### 1,000-10,000 Customers
- Stripe + Dedicated server
- PostgreSQL (managed)
- SendGrid Pro
- CDN (Cloudflare)
- **Cost:** ~$200/month

### 10,000+ Customers
- Stripe + Kubernetes
- PostgreSQL cluster
- SendGrid Enterprise
- Full monitoring stack
- **Cost:** ~$1,000+/month

---

## 🔧 TROUBLESHOOTING

### Webhook Not Firing

**Check:**
1. Is webhook URL correct?
2. Is endpoint publicly accessible?
3. Are logs showing errors?
4. Is SSL certificate valid?

**Solution:**
- Test with curl:
```bash
curl -X POST https://your-domain.com/api/webhooks/gumroad \
  -H "Content-Type: application/json" \
  -d '{"sale_id":"test","email":"test@example.com"}'
```

### License Not Sent

**Check:**
1. Email service configured?
2. API keys valid?
3. From address verified?
4. Check spam folder

**Solution:**
- Test email manually:
```bash
node -e "require('./webhooks/gumroad').sendEmail('test@example.com', {...})"
```

### License Not Working

**Check:**
1. Key format valid? (TIER-XXXX-XXXX-XXXX)
2. Tier matches (premium/pro)?
3. LocalStorage working?
4. JavaScript errors in console?

**Solution:**
- Test in console:
```javascript
LicenseManager.activateLicense('PREMIUM-DEMO-TEST-KEY')
```

---

## 📞 SUPPORT SETUP

### Customer Support Portal

**Option 1: Help Scout ($50/month)**
- Shared inbox
- Knowledge base
- Customer profiles

**Option 2: Intercom ($74/month)**
- Live chat
- Email
- Knowledge base
- Bots

**Option 3: Email ($0)**
- Gmail/ProtonMail
- Canned responses
- Manual but works

### Auto-Responder

```javascript
// Send confirmation email immediately
const autoReply = `
Thank you for contacting EmotiScope support!

We typically respond within 24 hours (4 hours for Pro users).

In the meantime, check our FAQ: https://emotiscope.com/faq

Common issues:
- License activation: Copy key exactly as shown
- API key setup: Get key from OpenAI/Anthropic
- Message limit: Upgrade to Premium for unlimited

Best regards,
EmotiScope Team
`;
```

---

## ✅ LAUNCH CHECKLIST

### Pre-Launch
- [ ] Gumroad/Stripe account created
- [ ] Products created ($9.99 Premium, $19.99 Pro)
- [ ] Webhook deployed and tested
- [ ] License generator tested
- [ ] Email delivery tested
- [ ] Success page tested
- [ ] Test purchase completed successfully
- [ ] License activates in app
- [ ] Pricing page links correct

### Launch Day
- [ ] Switch to production API keys
- [ ] Remove test mode flags
- [ ] Monitor webhooks
- [ ] Test real purchase
- [ ] Announce on social media
- [ ] Email beta users
- [ ] Monitor for errors

### Post-Launch
- [ ] Track conversion rates
- [ ] Monitor churn
- [ ] Collect feedback
- [ ] Fix issues quickly
- [ ] Optimize pricing
- [ ] Scale infrastructure as needed

---

## 📚 RESOURCES

**Documentation:**
- `MONETIZATION_GUIDE.md` - Overall strategy
- `PAYMENT_INTEGRATION_GUIDE.md` - This guide
- `/server/license-generator.js` - Key generation
- `/server/webhooks/gumroad.js` - Gumroad webhook
- `/server/webhooks/stripe.js` - Stripe webhook

**External Links:**
- [Gumroad Docs](https://help.gumroad.com/article/247-webhooks)
- [Stripe Docs](https://stripe.com/docs/webhooks)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Vercel Docs](https://vercel.com/docs)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-06
**Status:** ✅ Ready for Production
