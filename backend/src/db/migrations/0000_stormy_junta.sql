CREATE TABLE "summoners" (
	"puuid" text PRIMARY KEY NOT NULL,
	"nickname" text,
	"region" text,
	"updated_at" timestamp DEFAULT now()
);
