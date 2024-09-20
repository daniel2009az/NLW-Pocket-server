ALTER TABLE "goals" RENAME COLUMN "tite" TO "title";--> statement-breakpoint
ALTER TABLE "goals_completions" ALTER COLUMN "goal_id" SET DATA TYPE text;