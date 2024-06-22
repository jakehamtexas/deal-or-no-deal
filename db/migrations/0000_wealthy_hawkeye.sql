CREATE TABLE IF NOT EXISTS "page" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" serial NOT NULL,
	"page_id" serial NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist_item" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"wishlist_id" serial NOT NULL,
	"page_id" serial NOT NULL,
	"image_url" text NOT NULL,
	"display_index" char(1) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_owner_id_player_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_wishlist_id_wishlist_id_fk" FOREIGN KEY ("wishlist_id") REFERENCES "public"."wishlist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_item" ADD CONSTRAINT "wishlist_item_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "page_url_idx" ON "page" USING btree ("url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player_name_idx" ON "player" USING btree ("name","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_owner_idx" ON "wishlist" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_page_idx" ON "wishlist" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_item_name_idx" ON "wishlist_item" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_item_wishlist_idx" ON "wishlist_item" USING btree ("wishlist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_item_page_idx" ON "wishlist_item" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_item_display_idx" ON "wishlist_item" USING btree ("display_index");