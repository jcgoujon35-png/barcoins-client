// ============================================================
// BARCOINS — Seed base de données
// Crée : 1 bar test + 1 owner + 1 barman + données démo
// Commande : npx prisma db seed
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed BarCoins démarré...');

  // ── 1. Owner (gérant du bar test) ──────────────────────────
  const ownerHash = await bcrypt.hash('barcoins2026!', 12);

  const owner = await prisma.staffMember.upsert({
    where: { email: 'owner@bartest.fr' },
    update: {},
    create: {
      email: 'owner@bartest.fr',
      passwordHash: ownerHash,
      role: 'OWNER',
    },
  });

  console.log(`✅ Owner créé : ${owner.email}`);

  // ── 2. Bar de test ─────────────────────────────────────────
  const bar = await prisma.bar.upsert({
    where: { slug: 'bar-test-barcoins' },
    update: {},
    create: {
      slug: 'bar-test-barcoins',
      name: 'Bar Test BarCoins',
      address: '1 rue du Test',
      city: 'Perpignan',
      ownerId: owner.id,
      plan: 'STARTER',
      activeMultiplier: 1.0,
      wheelEnabled: false, // JAMAIS true en beta
    },
  });

  console.log(`✅ Bar créé : ${bar.name} (slug: ${bar.slug})`);

  // Mise à jour de l'owner pour le rattacher au bar
  await prisma.staffMember.update({
    where: { id: owner.id },
    data: { barId: bar.id },
  });

  // ── 3. Barman ──────────────────────────────────────────────
  const barmanHash = await bcrypt.hash('barman2026!', 12);

  const barman = await prisma.staffMember.upsert({
    where: { email: 'barman@bartest.fr' },
    update: {},
    create: {
      email: 'barman@bartest.fr',
      passwordHash: barmanHash,
      role: 'BARMAN',
      barId: bar.id,
    },
  });

  console.log(`✅ Barman créé : ${barman.email}`);

  // ── 4. Abonnement Starter ──────────────────────────────────
  await prisma.subscription.upsert({
    where: { barId: bar.id },
    update: {},
    create: {
      barId: bar.id,
      plan: 'STARTER',
      status: 'TRIALING',
    },
  });

  console.log('✅ Abonnement STARTER créé');

  // ── 5. Récompenses par défaut ──────────────────────────────
  const defaultRewards = [
    { name: 'Shot offert', coinCost: 30, category: 'boisson' },
    { name: 'Bière offerte', coinCost: 40, category: 'boisson' },
    { name: 'Bière qualité offerte', coinCost: 50, category: 'boisson' },
    { name: 'Cocktail offert', coinCost: 90, category: 'cocktail' },
    { name: 'Récompense premium', coinCost: 140, category: 'premium' },
    { name: 'Planche apéro offerte', coinCost: 150, category: 'food' },
  ];

  for (const reward of defaultRewards) {
    await prisma.reward.create({
      data: { barId: bar.id, coinType: 'PLAY', isActive: true, ...reward },
    });
  }

  console.log(`✅ ${defaultRewards.length} récompenses créées`);

  // ── 6. Questions quiz de démo (5 questions) ────────────────
  const demoQuestions = [
    {
      theme: 'Culture bar',
      difficulty: 1,
      question: 'Quelle est la bière la plus vendue en France ?',
      options: ['Heineken', 'Kronenbourg 1664', 'Leffe', 'Desperados'],
      correctIndex: 1,
      tags: ['biere', 'france', 'facile'],
    },
    {
      theme: 'Culture bar',
      difficulty: 1,
      question: 'Combien de cl contient un demi de bière classique ?',
      options: ['25 cl', '33 cl', 'Environ 25 cl', '50 cl'],
      correctIndex: 2,
      tags: ['biere', 'mesure', 'facile'],
    },
    {
      theme: 'Cocktails',
      difficulty: 2,
      question: 'Quels sont les ingrédients du Mojito ?',
      options: [
        'Rhum, citron vert, menthe, sucre, eau gazeuse',
        'Vodka, citron vert, gingembre, menthe',
        'Gin, tonic, citron, menthe',
        'Téquila, citron vert, sel, menthe',
      ],
      correctIndex: 0,
      tags: ['cocktail', 'rhum', 'moyen'],
    },
    {
      theme: 'Culture générale',
      difficulty: 2,
      question: 'Dans quel pays le whisky est-il né ?',
      options: ['Irlande', 'France', 'États-Unis', 'Écosse'],
      correctIndex: 3,
      tags: ['whisky', 'histoire', 'moyen'],
    },
    {
      theme: 'Music',
      difficulty: 3,
      question: 'Quelle chanson des Daft Punk est souvent jouée en bar ?',
      options: ['Around the World', 'Get Lucky', 'One More Time', 'Harder Better Faster'],
      correctIndex: 2,
      tags: ['musique', 'daft-punk', 'difficile'],
    },
  ];

  for (const q of demoQuestions) {
    await prisma.question.create({
      data: { ...q, options: q.options, barId: null }, // null = banque globale
    });
  }

  console.log(`✅ ${demoQuestions.length} questions démo créées`);

  // ── 7. Jeu physique demo ───────────────────────────────────
  await prisma.physicalGame.create({
    data: {
      barId: bar.id,
      name: 'Baby-foot principal',
      type: 'FOOSBALL',
      qrCode: `qr-physical-${bar.id}-foosball`,
      isActive: true,
    },
  });

  console.log('✅ Jeu physique créé');

  // ── Résumé ─────────────────────────────────────────────────
  console.log('\n🎉 Seed terminé avec succès !');
  console.log('─────────────────────────────────────');
  console.log(`📍 Bar : ${bar.name} (ID: ${bar.id})`);
  console.log(`👤 Owner : owner@bartest.fr / barcoins2026!`);
  console.log(`🍺 Barman : barman@bartest.fr / barman2026!`);
  console.log('─────────────────────────────────────');
  console.log('➡️  Lance : npx prisma studio pour explorer la BDD');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
