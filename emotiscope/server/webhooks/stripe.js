/**
 * Stripe Webhook Handler for EmotiScope
 *
 * Handles subscription events from Stripe and generates license keys.
 * Deploy this to Vercel, Netlify Functions, or any Node.js server.
 */

const LicenseGenerator = require('../license-generator');
const crypto = require('crypto');

// Initialize Stripe
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Send license key via email
 */
async function sendLicenseEmail(email, licenseData, customer) {
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .license-box { background: white; border: 2px dashed #7c3aed; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
        .license-key { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #7c3aed; letter-spacing: 2px; margin: 15px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
        .instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .billing { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to EmotiScope ${licenseData.tier.charAt(0).toUpperCase() + licenseData.tier.slice(1)}!</h1>
            <p>Your subscription is now active!</p>
        </div>

        <div class="content">
            <h2>Your License Key:</h2>

            <div class="license-box">
                <p style="margin-bottom: 10px; font-weight: 600;">Copy this key to activate your account:</p>
                <div class="license-key">${licenseData.key}</div>
            </div>

            <div class="instructions">
                <h3>📌 How to Activate:</h3>
                <ol>
                    <li>Open the EmotiScope app</li>
                    <li>Click the ⚙️ Settings icon</li>
                    <li>Scroll to "License Key" section</li>
                    <li>Paste your key: <code>${licenseData.key}</code></li>
                    <li>Click "Activate License"</li>
                    <li>Start your journey! 🚀</li>
                </ol>
            </div>

            <div style="text-align: center;">
                <a href="https://emotiscope.com/app.html" class="button">Open EmotiScope App →</a>
            </div>

            <div class="billing">
                <h3>💳 Billing Information:</h3>
                <p>
                    Your subscription will renew automatically on <strong>${new Date(customer.current_period_end * 1000).toLocaleDateString()}</strong>.
                </p>
                <p>
                    You can cancel anytime from your <a href="https://emotiscope.com/account">account settings</a> or by replying to this email.
                </p>
            </div>

            <h3>What's Included:</h3>
            ${licenseData.tier === 'premium' ? `
            <ul>
                <li>✓ Unlimited AI messages per month</li>
                <li>✓ Full Learn Mode & Chat Mode access</li>
                <li>✓ Advanced emotional analytics</li>
                <li>✓ Conversation history export</li>
                <li>✓ {self} map visualization</li>
                <li>✓ Priority feature access</li>
            </ul>
            ` : `
            <ul>
                <li>✓ Everything in Premium</li>
                <li>✓ White-label branding</li>
                <li>✓ Client progress tracking</li>
                <li>✓ API access</li>
                <li>✓ Priority support (4-hour response)</li>
                <li>✓ Quarterly strategy calls</li>
            </ul>
            `}

            <h3>Need Help?</h3>
            <p>Contact us at <a href="mailto:support@emotiscope.com">support@emotiscope.com</a></p>
        </div>

        <div class="footer">
            <p>&copy; 2025 EmotiScope. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="https://emotiscope.com/account" style="color: #a78bfa;">Manage Subscription</a> •
                <a href="https://emotiscope.com/privacy" style="color: #a78bfa;">Privacy</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    console.log('📧 Sending email to:', email);
    console.log('License Key:', licenseData.key);

    // TODO: Send via email service (SendGrid, Resend, etc.)

    return true;
}

/**
 * Verify Stripe webhook signature
 */
function verifyStripeSignature(payload, signature, secret) {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const event = stripe.webhooks.constructEvent(payload, signature, secret);
        return event;
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return null;
    }
}

/**
 * Main webhook handler
 */
async function handleStripeWebhook(req, res) {
    try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        // Verify webhook signature
        if (webhookSecret) {
            try {
                const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } catch (err) {
                console.error('⚠️ Webhook signature verification failed:', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
        } else {
            // For testing without signature verification
            event = req.body;
        }

        console.log('📦 Stripe event received:', event.type);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.json({ received: true });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session) {
    console.log('✓ Checkout completed:', session.id);

    const customerEmail = session.customer_email || session.customer_details?.email;
    const subscriptionId = session.subscription;

    if (!customerEmail) {
        console.error('❌ No customer email found');
        return;
    }

    // Determine tier from price ID
    const priceId = session.line_items?.data[0]?.price?.id || session.amount_total;

    let tier = 'premium';
    // Map price IDs to tiers (set these in your Stripe dashboard)
    const PRO_PRICE_IDS = [process.env.STRIPE_PRO_PRICE_ID];

    if (PRO_PRICE_IDS.includes(priceId)) {
        tier = 'pro';
    }

    // Generate license key
    const license = LicenseGenerator.generate(tier, customerEmail);

    // Save to database
    await LicenseGenerator.saveLicense({
        ...license,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        stripeSessionId: session.id,
    });

    // Send email
    await sendLicenseEmail(customerEmail, license, {
        current_period_end: session.expires_at
    });

    console.log(`✓ License generated: ${license.key} for ${customerEmail}`);
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription) {
    console.log('✓ Subscription created:', subscription.id);

    // License already generated in checkout.session.completed
    // This is just for logging/analytics
}

/**
 * Handle subscription updates (upgrade/downgrade)
 */
async function handleSubscriptionUpdated(subscription) {
    console.log('ℹ️ Subscription updated:', subscription.id);

    // Check if tier changed (upgrade/downgrade)
    const newPriceId = subscription.items.data[0].price.id;

    // TODO: Update license tier in database if needed
    // For now, customer keeps same license key, just tier changes
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription) {
    console.log('⚠️ Subscription deleted:', subscription.id);

    // TODO: Deactivate license in database
    // Send cancellation confirmation email

    const customerEmail = subscription.customer_email;
    console.log(`Subscription cancelled for: ${customerEmail}`);
}

/**
 * Handle successful payment
 */
async function handleInvoicePaid(invoice) {
    console.log('✓ Invoice paid:', invoice.id);

    // Subscription renewal - ensure license is still active
    // This runs monthly for recurring subscriptions
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
    console.error('❌ Payment failed:', invoice.id);

    // TODO: Send email to customer about failed payment
    // Optionally suspend license temporarily
}

// Export for serverless functions (Vercel, Netlify)
module.exports = async (req, res) => {
    // For Stripe webhooks, we need raw body
    // Make sure your framework doesn't parse the body as JSON

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return handleStripeWebhook(req, res);
};

// For Express.js
module.exports.handler = handleStripeWebhook;
