/**
 * Gumroad Webhook Handler for EmotiScope
 *
 * Handles purchase events from Gumroad and generates license keys.
 * Deploy this to Vercel, Netlify Functions, or any Node.js server.
 */

const LicenseGenerator = require('../license-generator');
const crypto = require('crypto');

/**
 * Send license key via email
 * Replace with your email service (SendGrid, Mailgun, Resend, etc.)
 */
async function sendLicenseEmail(email, licenseData, purchaseData) {
    // Example using SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        .instructions ol { margin-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to EmotiScope ${licenseData.tier.charAt(0).toUpperCase() + licenseData.tier.slice(1)}!</h1>
            <p>Thank you for your purchase, ${purchaseData.purchaser_name || 'valued customer'}!</p>
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
                    <li>Click the ⚙️ Settings icon in the top right</li>
                    <li>Scroll to "License Key" section</li>
                    <li>Paste your key: <code>${licenseData.key}</code></li>
                    <li>Click "Activate License"</li>
                    <li>Enjoy unlimited emotional growth! 🚀</li>
                </ol>
            </div>

            <div style="text-align: center;">
                <a href="https://emotiscope.com/app.html" class="button">Open EmotiScope App →</a>
            </div>

            <h3>What's Included:</h3>
            ${licenseData.tier === 'premium' ? `
            <ul>
                <li>✓ Unlimited AI messages per month</li>
                <li>✓ Full Learn Mode & Chat Mode access</li>
                <li>✓ Advanced emotional analytics</li>
                <li>✓ Conversation history export (CSV/PDF)</li>
                <li>✓ {self} map visualization</li>
                <li>✓ Priority feature access</li>
            </ul>
            ` : `
            <ul>
                <li>✓ Everything in Premium</li>
                <li>✓ White-label branding for your practice</li>
                <li>✓ Client progress tracking</li>
                <li>✓ API access for integrations</li>
                <li>✓ Priority email support</li>
                <li>✓ Quarterly strategy calls</li>
            </ul>
            `}

            <p><strong>Important:</strong> Keep this email safe. You'll need this license key to activate EmotiScope on any device.</p>

            <h3>Need Help?</h3>
            <p>Contact us at <a href="mailto:support@emotiscope.com">support@emotiscope.com</a> and we'll assist you within 24 hours.</p>

            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                <strong>Purchase Details:</strong><br>
                Order ID: ${purchaseData.order_id}<br>
                Date: ${new Date(purchaseData.created_at).toLocaleDateString()}<br>
                Amount: $${(purchaseData.price / 100).toFixed(2)}
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2025 EmotiScope. All rights reserved.</p>
            <p style="margin-top: 10px;">
                <a href="https://emotiscope.com/privacy" style="color: #a78bfa;">Privacy Policy</a> •
                <a href="https://emotiscope.com/terms" style="color: #a78bfa;">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email (example with console.log for now)
    console.log('📧 Sending email to:', email);
    console.log('License Key:', licenseData.key);

    // TODO: Replace with actual email service
    /*
    const msg = {
        to: email,
        from: 'hello@emotiscope.com',
        subject: `Your EmotiScope ${licenseData.tier.charAt(0).toUpperCase() + licenseData.tier.slice(1)} License Key`,
        html: emailHTML,
    };

    await sgMail.send(msg);
    */

    return true;
}

/**
 * Main webhook handler
 */
async function handleGumroadWebhook(req, res) {
    try {
        // Verify webhook signature
        // Gumroad doesn't use HMAC, so we skip verification for now
        // In production, use IP whitelist or other verification

        const data = req.body;

        console.log('📦 Gumroad webhook received:', data);

        // Check if it's a sale event
        if (data.sale_id) {
            const productId = data.product_id;
            const email = data.email;
            const purchaserName = data.purchaser_name || data.full_name;

            // Determine tier based on product ID
            let tier = 'premium';

            if (data.product_name && data.product_name.toLowerCase().includes('pro')) {
                tier = 'pro';
            }

            // Generate license key
            const license = LicenseGenerator.generate(tier, email);

            // Save to database
            await LicenseGenerator.saveLicense({
                ...license,
                gumroadSaleId: data.sale_id,
                gumroadProductId: productId,
                purchaserName: purchaserName,
                price: data.price,
                currency: data.currency,
            });

            // Send email with license key
            await sendLicenseEmail(email, license, data);

            // Log success
            console.log(`✓ License generated and sent: ${license.key} to ${email}`);

            // Return success
            return res.status(200).json({
                success: true,
                message: 'License generated and sent',
                key: license.key
            });
        }

        // Refund handling
        if (data.refunded === 'true' || data.refunded === true) {
            // TODO: Deactivate license
            console.log('⚠️ Refund detected for sale:', data.sale_id);
            // In production, mark license as inactive in database
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Export for serverless functions (Vercel, Netlify)
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return handleGumroadWebhook(req, res);
};

// For Express.js
module.exports.handler = handleGumroadWebhook;
