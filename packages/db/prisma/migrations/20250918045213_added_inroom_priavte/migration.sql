-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 10;
