CREATE TABLE "company_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ar" text NOT NULL,
	"tagline_en" text,
	"tagline_ar" text,
	"description_en" text NOT NULL,
	"description_ar" text NOT NULL,
	"logo_url" text NOT NULL,
	"phones" text[] DEFAULT '{}' NOT NULL,
	"emails" text[] DEFAULT '{}' NOT NULL,
	"whatsapp" text NOT NULL,
	"website" text NOT NULL,
	"address_en" text NOT NULL,
	"address_ar" text NOT NULL,
	"google_maps_url" text NOT NULL,
	"working_hours_en" text,
	"working_hours_ar" text,
	"showroom_address_en" text,
	"showroom_address_ar" text,
	"instagram" text,
	"facebook" text,
	"tiktok" text,
	"youtube" text,
	"linkedin" text,
	"twitter" text,
	"snapchat" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"full_name_en" text NOT NULL,
	"full_name_ar" text NOT NULL,
	"position_en" text NOT NULL,
	"position_ar" text NOT NULL,
	"department_en" text NOT NULL,
	"department_ar" text NOT NULL,
	"photo_url" text,
	"mobile" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"bio_en" text,
	"bio_ar" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"description_en" text NOT NULL,
	"description_ar" text NOT NULL,
	"icon" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"description_en" text,
	"description_ar" text,
	"category" text NOT NULL,
	"image_url" text,
	"video_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showroom_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"caption_en" text,
	"caption_ar" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_ar" text NOT NULL,
	"type" text NOT NULL,
	"file_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
