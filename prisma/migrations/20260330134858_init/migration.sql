-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('STARTER', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN');

-- CreateEnum
CREATE TYPE "OnboardingPhase" AS ENUM ('DISCOVERY', 'ENGAGEMENT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "CoinType" AS ENUM ('PLAY', 'FIDELITE');

-- CreateEnum
CREATE TYPE "CoinReason" AS ENUM ('QR_SCAN', 'PVP_WIN', 'PVP_LOSS', 'QUIZ_WIN', 'BLIND_TEST_WIN', 'SPORTS_BET_WIN', 'SPORTS_BET_LOSS', 'PACK_PURCHASE', 'SPIN_COST', 'SPIN_WIN', 'REWARD_REDEMPTION', 'LEADERBOARD_REWARD', 'BOOST_PURCHASE', 'STATUS_PURCHASE', 'MANUAL_CREDIT', 'MANUAL_DEBIT', 'TOURNAMENT_ENTRY', 'TOURNAMENT_WIN', 'STEAL', 'REVERSAL', 'REFERRAL');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CLAIMED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('QUIZ', 'BLIND_TEST', 'PVP', 'SPORTS_BET', 'TOURNAMENT');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PvPStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "SportMatchStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'CLOSED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SportMatchResult" AS ENUM ('HOME', 'DRAW', 'AWAY');

-- CreateEnum
CREATE TYPE "SportBetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'REFUNDED');

-- CreateEnum
CREATE TYPE "LeaderboardType" AS ENUM ('SOIREE', 'HEBDO', 'MENSUEL', 'ANNUEL');

-- CreateEnum
CREATE TYPE "SpinOutcomeType" AS ENUM ('RETRY', 'PLAY_BONUS', 'DISCOUNT', 'DRINK', 'JACKPOT');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('PENDING', 'REDEEMED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PackType" AS ENUM ('DECOUVERTE', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('VIP_ECRAN', 'MAITRE_QUIZ', 'DOUBLE_OU_RIEN', 'DJ_MOMENT', 'MON_COCKTAIL', 'LE_LEGEND');

-- CreateEnum
CREATE TYPE "PhysicalGameType" AS ENUM ('DARTS', 'POOL', 'FOOSBALL', 'CUSTOM');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'STARTER',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bar" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "ownerId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'STARTER',
    "activeMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "boostActive" BOOLEAN NOT NULL DEFAULT false,
    "boostExpiresAt" TIMESTAMP(3),
    "wheelEnabled" BOOLEAN NOT NULL DEFAULT false,
    "onboardingPhase" "OnboardingPhase" NOT NULL DEFAULT 'DISCOVERY',
    "healthScore" INTEGER NOT NULL DEFAULT 0,
    "jackpotCountMonthly" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL,
    "barId" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "isVerified18" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarClient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "playBalance" INTEGER NOT NULL DEFAULT 0,
    "fideliteBalance" INTEGER NOT NULL DEFAULT 0,
    "totalCoinsEarned" INTEGER NOT NULL DEFAULT 0,
    "onboardingPhase" "OnboardingPhase" NOT NULL DEFAULT 'DISCOVERY',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "coinType" "CoinType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "CoinReason" NOT NULL,
    "sourceId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "coinsAwarded" INTEGER NOT NULL,
    "qrToken" TEXT NOT NULL,
    "qrExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "claimedByUserId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "multiplierApplied" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "config" JSONB NOT NULL DEFAULT '{}',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "isAutoMode" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "tags" TEXT[],
    "barId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAnswer" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT,
    "questionIndex" INTEGER NOT NULL,
    "answerIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "coinsAwarded" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PvPMatch" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "challengerId" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "physicalGameId" TEXT,
    "gameId" TEXT,
    "challengerBet" INTEGER NOT NULL,
    "opponentBet" INTEGER NOT NULL,
    "totalPot" INTEGER NOT NULL,
    "commission" INTEGER NOT NULL,
    "winnerPayout" INTEGER NOT NULL,
    "winnerId" TEXT,
    "status" "PvPStatus" NOT NULL DEFAULT 'PENDING',
    "challengerDeclared" TEXT,
    "opponentDeclared" TEXT,
    "acceptExpiresAt" TIMESTAMP(3),
    "resolveExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "PvPMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportMatch" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "teamHome" TEXT NOT NULL,
    "teamAway" TEXT NOT NULL,
    "oddsHome" DOUBLE PRECISION NOT NULL,
    "oddsDraw" DOUBLE PRECISION NOT NULL,
    "oddsAway" DOUBLE PRECISION NOT NULL,
    "status" "SportMatchStatus" NOT NULL DEFAULT 'UPCOMING',
    "result" "SportMatchResult",
    "autoRefundAt" TIMESTAMP(3) NOT NULL,
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportBet" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prediction" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payout" INTEGER,
    "status" "SportBetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "type" "LeaderboardType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "winnerId" TEXT,
    "reward" JSONB NOT NULL DEFAULT '{}',
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "outcomeType" "SpinOutcomeType" NOT NULL,
    "outcomeDetail" JSONB NOT NULL DEFAULT '{}',
    "voucherCode" TEXT,
    "voucherStatus" "VoucherStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FidelitePack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "packType" "PackType" NOT NULL,
    "fideliteCoins" INTEGER NOT NULL,
    "spinsIncluded" INTEGER NOT NULL DEFAULT 0,
    "bonusPlayCoins" INTEGER NOT NULL DEFAULT 0,
    "stripePaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FidelitePack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coinCost" INTEGER NOT NULL,
    "coinType" "CoinType" NOT NULL DEFAULT 'PLAY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardRedemption" (
    "id" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "voucherCode" TEXT NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'PENDING',
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "statusType" "StatusType" NOT NULL,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ActiveStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalGame" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PhysicalGameType" NOT NULL,
    "qrCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PhysicalGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthScoreLog" (
    "id" TEXT NOT NULL,
    "barId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthScoreLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_barId_key" ON "Subscription"("barId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bar_slug_key" ON "Bar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_email_key" ON "StaffMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "BarClient_barId_idx" ON "BarClient"("barId");

-- CreateIndex
CREATE UNIQUE INDEX "BarClient_userId_barId_key" ON "BarClient"("userId", "barId");

-- CreateIndex
CREATE INDEX "CoinLedger_userId_barId_idx" ON "CoinLedger"("userId", "barId");

-- CreateIndex
CREATE INDEX "CoinLedger_barId_createdAt_idx" ON "CoinLedger"("barId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinLedger_userId_coinType_idx" ON "CoinLedger"("userId", "coinType");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_qrToken_key" ON "Transaction"("qrToken");

-- CreateIndex
CREATE INDEX "Transaction_barId_status_idx" ON "Transaction"("barId", "status");

-- CreateIndex
CREATE INDEX "Transaction_qrToken_idx" ON "Transaction"("qrToken");

-- CreateIndex
CREATE INDEX "Game_barId_status_idx" ON "Game"("barId", "status");

-- CreateIndex
CREATE INDEX "Question_theme_difficulty_idx" ON "Question"("theme", "difficulty");

-- CreateIndex
CREATE INDEX "Question_barId_idx" ON "Question"("barId");

-- CreateIndex
CREATE INDEX "GameAnswer_gameId_idx" ON "GameAnswer"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameAnswer_gameId_userId_questionIndex_key" ON "GameAnswer"("gameId", "userId", "questionIndex");

-- CreateIndex
CREATE INDEX "PvPMatch_barId_status_idx" ON "PvPMatch"("barId", "status");

-- CreateIndex
CREATE INDEX "PvPMatch_challengerId_idx" ON "PvPMatch"("challengerId");

-- CreateIndex
CREATE INDEX "PvPMatch_opponentId_idx" ON "PvPMatch"("opponentId");

-- CreateIndex
CREATE INDEX "SportMatch_barId_status_idx" ON "SportMatch"("barId", "status");

-- CreateIndex
CREATE INDEX "SportBet_matchId_idx" ON "SportBet"("matchId");

-- CreateIndex
CREATE INDEX "SportBet_userId_idx" ON "SportBet"("userId");

-- CreateIndex
CREATE INDEX "Leaderboard_barId_type_isFinalized_idx" ON "Leaderboard"("barId", "type", "isFinalized");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_barId_type_periodStart_key" ON "Leaderboard"("barId", "type", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "Spin_voucherCode_key" ON "Spin"("voucherCode");

-- CreateIndex
CREATE INDEX "Spin_userId_barId_idx" ON "Spin"("userId", "barId");

-- CreateIndex
CREATE UNIQUE INDEX "FidelitePack_stripePaymentId_key" ON "FidelitePack"("stripePaymentId");

-- CreateIndex
CREATE INDEX "FidelitePack_userId_barId_idx" ON "FidelitePack"("userId", "barId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardRedemption_voucherCode_key" ON "RewardRedemption"("voucherCode");

-- CreateIndex
CREATE INDEX "RewardRedemption_userId_barId_idx" ON "RewardRedemption"("userId", "barId");

-- CreateIndex
CREATE INDEX "RewardRedemption_voucherCode_idx" ON "RewardRedemption"("voucherCode");

-- CreateIndex
CREATE INDEX "ActiveStatus_userId_barId_isActive_idx" ON "ActiveStatus"("userId", "barId", "isActive");

-- CreateIndex
CREATE INDEX "ActiveStatus_barId_expiresAt_idx" ON "ActiveStatus"("barId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalGame_qrCode_key" ON "PhysicalGame"("qrCode");

-- CreateIndex
CREATE INDEX "HealthScoreLog_barId_calculatedAt_idx" ON "HealthScoreLog"("barId", "calculatedAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bar" ADD CONSTRAINT "Bar_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "StaffMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarClient" ADD CONSTRAINT "BarClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarClient" ADD CONSTRAINT "BarClient_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinLedger" ADD CONSTRAINT "CoinLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinLedger" ADD CONSTRAINT "CoinLedger_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_claimedByUserId_fkey" FOREIGN KEY ("claimedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAnswer" ADD CONSTRAINT "GameAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_physicalGameId_fkey" FOREIGN KEY ("physicalGameId") REFERENCES "PhysicalGame"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PvPMatch" ADD CONSTRAINT "PvPMatch_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportMatch" ADD CONSTRAINT "SportMatch_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportBet" ADD CONSTRAINT "SportBet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SportMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportBet" ADD CONSTRAINT "SportBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FidelitePack" ADD CONSTRAINT "FidelitePack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FidelitePack" ADD CONSTRAINT "FidelitePack_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRedemption" ADD CONSTRAINT "RewardRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveStatus" ADD CONSTRAINT "ActiveStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveStatus" ADD CONSTRAINT "ActiveStatus_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalGame" ADD CONSTRAINT "PhysicalGame_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthScoreLog" ADD CONSTRAINT "HealthScoreLog_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
