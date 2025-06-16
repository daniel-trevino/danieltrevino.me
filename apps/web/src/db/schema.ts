import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const contactFormSubmissions = pgTable("ContactFormSubmission", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  formId: varchar("formId", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  submittedAt: timestamp("submittedAt", { mode: "date" }).defaultNow(),
});
