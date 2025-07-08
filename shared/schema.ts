import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  subdomain: text("subdomain").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  about: text("about"),
  email: text("email"),
  phone: text("phone"),
  linkedin: text("linkedin"),
  github: text("github"),
  website: text("website"),
  skills: json("skills").$type<string[]>().default([]),
  experience: json("experience").$type<ExperienceItem[]>().default([]),
  education: json("education").$type<EducationItem[]>().default([]),
  projects: json("projects").$type<ProjectItem[]>().default([]),
  theme: text("theme").notNull().default("default"),
  isPublic: text("is_public").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: serial("size").notNull(),
  extractedText: text("extracted_text"),
  portfolioId: serial("portfolio_id").references(() => portfolios.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExperienceItem = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
};

export type EducationItem = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
};

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
});

export const insertUploadedFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  createdAt: true,
});

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = z.infer<typeof insertUploadedFileSchema>;
