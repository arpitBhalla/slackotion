-- CreateTable
CREATE TABLE "Teams" (
    "id" SERIAL NOT NULL,
    "team_id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Databases" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "db_id" TEXT NOT NULL,

    CONSTRAINT "Databases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teams_team_id_key" ON "Teams"("team_id");
