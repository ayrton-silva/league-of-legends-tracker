CREATE TABLE "leagues" (
	"leagueid" text PRIMARY KEY NOT NULL,
	"queuetype" text NOT NULL,
	"tier" text NOT NULL,
	"ranking" text NOT NULL,
	"league_points" numeric,
	"wins" numeric,
	"losses" numeric,
	"puuid" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "leagues_tier_unique" UNIQUE("tier")
);
--> statement-breakpoint
CREATE TABLE "summoners" (
	"puuid" text PRIMARY KEY NOT NULL,
	"nickname" text,
	"tagname" text,
	"region" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_puuid_summoners_puuid_fk" FOREIGN KEY ("puuid") REFERENCES "public"."summoners"("puuid") ON DELETE no action ON UPDATE no action;