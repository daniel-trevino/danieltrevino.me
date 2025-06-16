CREATE TABLE "ContactFormSubmission" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"formId" varchar(255) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"phone" varchar(50),
	"message" text,
	"submittedAt" timestamp DEFAULT now()
);
