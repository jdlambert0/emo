/**
 * License Key Generator for EmotiScope
 *
 * This generates secure, unique license keys for Premium and Pro tiers.
 * Can be used as a standalone script or integrated into webhook handlers.
 */

const crypto = require('crypto');

class LicenseGenerator {
    /**
     * Generate a secure license key
     * @param {string} tier - 'premium' or 'pro'
     * @param {string} email - Customer email for tracking
     * @returns {object} { key, tier, email, createdAt, expiresAt }
     */
    static generate(tier, email) {
        if (!['premium', 'pro'].includes(tier.toLowerCase())) {
            throw new Error('Invalid tier. Must be "premium" or "pro"');
        }

        // Format: TIER-XXXX-XXXX-XXXX
        const tierPrefix = tier.toUpperCase();

        // Generate three 4-character segments
        const segment1 = this.generateSegment();
        const segment2 = this.generateSegment();
        const segment3 = this.generateSegment();

        const key = `${tierPrefix}-${segment1}-${segment2}-${segment3}`;

        return {
            key: key,
            tier: tier.toLowerCase(),
            email: email,
            createdAt: new Date().toISOString(),
            expiresAt: null, // null = lifetime license
            metadata: {
                version: '1.0',
                generator: 'LicenseGenerator',
                timestamp: Date.now()
            }
        };
    }

    /**
     * Generate a 4-character alphanumeric segment
     * @returns {string} 4-character string
     */
    static generateSegment() {
        // Use uppercase letters and numbers (excluding confusing chars: 0, O, I, 1)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let segment = '';

        for (let i = 0; i < 4; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            segment += chars[randomIndex];
        }

        return segment;
    }

    /**
     * Validate license key format
     * @param {string} key - License key to validate
     * @returns {boolean} true if format is valid
     */
    static validateFormat(key) {
        if (typeof key !== 'string') return false;

        const parts = key.split('-');

        // Must have 4 parts
        if (parts.length !== 4) return false;

        // First part must be PREMIUM or PRO
        if (!['PREMIUM', 'PRO'].includes(parts[0])) return false;

        // Next three parts must be 4 characters each
        for (let i = 1; i < 4; i++) {
            if (parts[i].length !== 4) return false;
            // Must be alphanumeric
            if (!/^[A-Z0-9]+$/.test(parts[i])) return false;
        }

        return true;
    }

    /**
     * Generate multiple license keys (batch)
     * @param {string} tier - 'premium' or 'pro'
     * @param {number} count - Number of keys to generate
     * @returns {Array} Array of license objects
     */
    static generateBatch(tier, count = 10) {
        const licenses = [];

        for (let i = 0; i < count; i++) {
            const key = this.generate(tier, `batch-${i}@temp.com`);
            licenses.push(key);
        }

        return licenses;
    }

    /**
     * Save license to database (example)
     * In production, replace with your actual database
     */
    static async saveLicense(licenseData) {
        // Example: Save to file-based JSON database
        const fs = require('fs').promises;
        const path = require('path');

        const dbPath = path.join(__dirname, 'licenses.json');

        try {
            let licenses = [];

            // Read existing licenses
            try {
                const data = await fs.readFile(dbPath, 'utf8');
                licenses = JSON.parse(data);
            } catch (err) {
                // File doesn't exist yet, start fresh
                licenses = [];
            }

            // Add new license
            licenses.push(licenseData);

            // Write back to file
            await fs.writeFile(dbPath, JSON.stringify(licenses, null, 2));

            console.log(`✓ License saved: ${licenseData.key}`);
            return true;
        } catch (error) {
            console.error('Error saving license:', error);
            return false;
        }
    }

    /**
     * Verify license exists in database
     * @param {string} key - License key to verify
     * @returns {object|null} License data if found, null otherwise
     */
    static async verifyLicense(key) {
        // First check format
        if (!this.validateFormat(key)) {
            return null;
        }

        const fs = require('fs').promises;
        const path = require('path');
        const dbPath = path.join(__dirname, 'licenses.json');

        try {
            const data = await fs.readFile(dbPath, 'utf8');
            const licenses = JSON.parse(data);

            const license = licenses.find(l => l.key === key);

            if (license) {
                // Check if expired
                if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
                    return null; // Expired
                }

                return license;
            }

            return null;
        } catch (error) {
            console.error('Error verifying license:', error);
            return null;
        }
    }
}

// CLI Usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'generate':
            const tier = args[1] || 'premium';
            const email = args[2] || 'customer@example.com';
            const license = LicenseGenerator.generate(tier, email);
            console.log('\n🔑 License Generated:\n');
            console.log(`Key:       ${license.key}`);
            console.log(`Tier:      ${license.tier}`);
            console.log(`Email:     ${license.email}`);
            console.log(`Created:   ${license.createdAt}`);
            console.log('\n💾 Save this key for the customer!\n');

            // Optionally save to database
            LicenseGenerator.saveLicense(license);
            break;

        case 'batch':
            const batchTier = args[1] || 'premium';
            const count = parseInt(args[2]) || 10;
            const licenses = LicenseGenerator.generateBatch(batchTier, count);

            console.log(`\n🔑 Generated ${count} ${batchTier.toUpperCase()} licenses:\n`);
            licenses.forEach((l, i) => {
                console.log(`${i + 1}. ${l.key}`);
            });
            console.log('\n');
            break;

        case 'validate':
            const keyToValidate = args[1];
            const isValid = LicenseGenerator.validateFormat(keyToValidate);
            console.log(`\n${isValid ? '✓' : '✗'} Key format: ${keyToValidate}`);
            console.log(`Valid: ${isValid}\n`);
            break;

        case 'verify':
            const keyToVerify = args[1];
            LicenseGenerator.verifyLicense(keyToVerify).then(license => {
                if (license) {
                    console.log('\n✓ License found and valid:\n');
                    console.log(JSON.stringify(license, null, 2));
                } else {
                    console.log('\n✗ License not found or invalid\n');
                }
            });
            break;

        default:
            console.log(`
EmotiScope License Generator

Usage:
  node license-generator.js generate [tier] [email]
  node license-generator.js batch [tier] [count]
  node license-generator.js validate [key]
  node license-generator.js verify [key]

Examples:
  node license-generator.js generate premium user@example.com
  node license-generator.js batch pro 50
  node license-generator.js validate PREMIUM-A2B3-C4D5-E6F7
  node license-generator.js verify PREMIUM-A2B3-C4D5-E6F7
            `);
    }
}

module.exports = LicenseGenerator;
