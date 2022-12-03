/*
  Warnings:

  - You are about to drop the `Databases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Databases";

-- DropTable
DROP TABLE "Teams";

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "slack_team_id" TEXT NOT NULL,
    "slack_bot_id" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "slack_user_id" TEXT NOT NULL,
    "notion_access_token" TEXT NOT NULL,
    "notion_database_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_slack_team_id_key" ON "Team"("slack_team_id");

-- CreateIndex
CREATE INDEX "slack_user_id" ON "User"("slack_user_id");
