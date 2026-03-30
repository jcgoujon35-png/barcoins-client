#!/bin/bash
# BarCoins V1 Client — Deploy to Vercel
# Run this from WSL: bash DEPLOY.sh

echo "BarCoins V1 — Deploiement Vercel"
echo "================================="

# Sync Windows edits to WSL native copy (faster builds)
WINDOWS_SRC="/mnt/c/Users/jean-/OneDrive/Documents/Barcoins/DEV/barcoins-client"
WSL_DEST="$HOME/barcoins-client"

echo "Sync Windows -> WSL..."
rsync -av --exclude='node_modules' --exclude='.git' "$WINDOWS_SRC/" "$WSL_DEST/" --quiet

cd "$WSL_DEST"

# Deploy (token cached in ~/.local/share/com.vercel.cli/auth.json)
echo "Deploiement en production..."
npx vercel --prod --yes

echo ""
echo "Deploye sur https://barcoins-client.vercel.app"
echo "iPhone : Safari > Partager > Sur l'ecran d'accueil"
