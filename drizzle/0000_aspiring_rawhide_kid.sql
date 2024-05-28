CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"nickname" text NOT NULL,
	"name" text NOT NULL,
	"birth" text,
	"stack" text,
	CONSTRAINT "users_nickname_unique" UNIQUE("nickname")
);
