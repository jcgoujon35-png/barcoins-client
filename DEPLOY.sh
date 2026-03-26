#!/bin/bash
# BarCoins V1 Client — Deploy to Vercel
# Run this from WSL: bash DEPLOY.sh

echo "⚡ BarCoins V1 — Déploiement Vercel"
echo "======================================"

# Go to WSL native copy (faster builds)
cd ~/barcoins-client

# Login if needed
echo ""
echo "🔐 Login Vercel (ouvre ton browser)..."
npx vercel login

# Deploy
echo ""
echo "🚀 Déploiement en production..."
npx vercel --prod --yes

echo ""
echo "✅ Déployé ! L'URL apparaît ci-dessus."
echo "📱 Pour installer sur iPhone : Safari → Partager → Sur l'écran d'accueil"
