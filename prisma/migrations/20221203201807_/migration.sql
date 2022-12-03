/*
  Warnings:

  - You are about to drop the column `slack_bot_id` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "slack_bot_id",
ADD COLUMN     "slack_meta_data" JSONB NOT NULL DEFAULT '{}';
