#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generates secure random strings for environment variables
 */
function generateSecureString(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * Generates Railway environment variables template
 */
function generateRailwayEnv() {
  const envTemplate = `# Railway Environment Variables for Cal.com API v2
# Generated on: ${new Date().toISOString()}

# ===== REQUIRED VARIABLES =====

# Database Configuration
# Get these from your Railway PostgreSQL service
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.railway.internal:5432/railway
DATABASE_READ_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.railway.internal:5432/railway
DATABASE_WRITE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.railway.internal:5432/railway

# Authentication Secrets (Auto-generated secure values)
NEXTAUTH_SECRET=${generateSecureString(64)}
JWT_SECRET=${generateSecureString(32)}

# Cal.com Configuration
CALCOM_LICENSE_KEY=YOUR_LICENSE_KEY_HERE
WEB_APP_URL=https://your-calcom-webapp.com
API_URL=https://your-api.railway.app

# ===== OPTIONAL VARIABLES =====

# Node Configuration
NODE_ENV=production
API_PORT=80
API_KEY_PREFIX=cal_
LOG_LEVEL=INFO

# Get License Key URL
GET_LICENSE_KEY_URL=https://console.cal.com/api/license

# E2E Testing
IS_E2E=false

# Documentation URL
DOCS_URL=https://your-api.railway.app/docs

# ===== STRIPE CONFIGURATION (if using payments) =====
# STRIPE_API_KEY=sk_live_YOUR_STRIPE_KEY
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
# STRIPE_PRICE_ID_STARTER=price_YOUR_PRICE_ID
# STRIPE_PRICE_ID_STARTER_OVERAGE=price_YOUR_PRICE_ID
# STRIPE_PRICE_ID_ESSENTIALS=price_YOUR_PRICE_ID
# STRIPE_PRICE_ID_ESSENTIALS_OVERAGE=price_YOUR_PRICE_ID
# STRIPE_PRICE_ID_ENTERPRISE=price_YOUR_PRICE_ID
# STRIPE_PRICE_ID_ENTERPRISE_OVERAGE=price_YOUR_PRICE_ID

# ===== MONITORING (optional) =====
# SENTRY_DSN=https://YOUR_SENTRY_DSN
# AXIOM_DATASET=your-dataset
# AXIOM_TOKEN=your-axiom-token

# ===== LOGGER CONFIGURATION =====
# DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3
LOGGER_BRIDGE_LOG_LEVEL=1
`;

  return envTemplate;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating Railway environment variables for Cal.com API v2...\n');

  const envContent = generateRailwayEnv();
  const outputPath = path.join(process.cwd(), '.env.railway');

  fs.writeFileSync(outputPath, envContent);

  console.log(`✅ Environment template generated at: ${outputPath}`);
  console.log('\n📋 Next steps:');
  console.log('1. Review and update the generated .env.railway file');
  console.log('2. Replace placeholder values with your actual configuration');
  console.log('3. Copy these variables to your Railway project settings');
  console.log('4. DO NOT commit .env.railway to version control!\n');

  // Add to .gitignore if not already present
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env.railway')) {
      fs.appendFileSync(gitignorePath, '\n# Railway environment file\n.env.railway\n');
      console.log('✅ Added .env.railway to .gitignore');
    }
  }
}

// Run the script
if (require.main === module) {
  main();
}