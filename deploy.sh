#!/bin/bash
# deploy.sh - One-command deploy to Cloudflare Pages

set -e  # Exit on error

echo "🔨 Building Next.js..."
npm run build

echo "📦 Building for Cloudflare Pages..."
npm run pages:build

echo "🚀 Deploying to Cloudflare Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Site: https://jordanfreelance.pages.dev"
