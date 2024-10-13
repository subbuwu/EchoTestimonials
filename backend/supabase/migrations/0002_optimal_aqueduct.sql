CREATE TABLE IF NOT EXISTS "feedback_forms" (
	"form_id" serial PRIMARY KEY NOT NULL,
	"space_id" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_questions" (
	"question_id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"question_text" text NOT NULL,
	"question_type" varchar(50) NOT NULL,
	"is_required" boolean DEFAULT false,
	"order_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spaces" (
	"space_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "spaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"tag_id" serial PRIMARY KEY NOT NULL,
	"space_id" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonial_responses" (
	"response_id" serial PRIMARY KEY NOT NULL,
	"testimonial_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"response_text" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_testimonials" (
	"testimonial_id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"customer_name" varchar(100),
	"customer_email" varchar(255),
	"overall_rating" integer,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_space_id_spaces_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("space_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_questions" ADD CONSTRAINT "form_questions_form_id_feedback_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."feedback_forms"("form_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spaces" ADD CONSTRAINT "spaces_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_space_id_spaces_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("space_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testimonial_responses" ADD CONSTRAINT "testimonial_responses_testimonial_id_user_testimonials_testimonial_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."user_testimonials"("testimonial_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "testimonial_responses" ADD CONSTRAINT "testimonial_responses_question_id_form_questions_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."form_questions"("question_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_testimonials" ADD CONSTRAINT "user_testimonials_form_id_feedback_forms_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."feedback_forms"("form_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");