import { portfolios, uploadedFiles, type Portfolio, type InsertPortfolio, type UploadedFile, type InsertUploadedFile, type ExperienceItem, type EducationItem, type ProjectItem } from "@shared/schema";

export interface IStorage {
  // Portfolio methods
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getPortfolioBySubdomain(subdomain: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  getAllPortfolios(): Promise<Portfolio[]>;
  
  // File methods
  getUploadedFile(id: number): Promise<UploadedFile | undefined>;
  createUploadedFile(file: InsertUploadedFile): Promise<UploadedFile>;
  updateUploadedFile(id: number, file: Partial<InsertUploadedFile>): Promise<UploadedFile | undefined>;
}

export class MemStorage implements IStorage {
  private portfolios: Map<number, Portfolio>;
  private uploadedFiles: Map<number, UploadedFile>;
  private currentPortfolioId: number;
  private currentFileId: number;

  constructor() {
    this.portfolios = new Map();
    this.uploadedFiles = new Map();
    this.currentPortfolioId = 1;
    this.currentFileId = 1;
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfolioBySubdomain(subdomain: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(
      (portfolio) => portfolio.subdomain === subdomain
    );
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = this.currentPortfolioId++;
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      createdAt: new Date(),
      about: insertPortfolio.about || null,
      email: insertPortfolio.email || null,
      phone: insertPortfolio.phone || null,
      linkedin: insertPortfolio.linkedin || null,
      github: insertPortfolio.github || null,
      website: insertPortfolio.website || null,
      skills: Array.isArray(insertPortfolio.skills) ? insertPortfolio.skills as string[] : null,
      experience: Array.isArray(insertPortfolio.experience) ? insertPortfolio.experience as ExperienceItem[] : null,
      education: Array.isArray(insertPortfolio.education) ? insertPortfolio.education as EducationItem[] : null,
      projects: Array.isArray(insertPortfolio.projects) ? insertPortfolio.projects as ProjectItem[] : null,
      theme: insertPortfolio.theme || "default",
      isPublic: insertPortfolio.isPublic || "true",
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;

    const updatedPortfolio: Portfolio = {
      ...portfolio,
      ...updates,
      skills: Array.isArray(updates.skills) ? updates.skills as string[] : portfolio.skills,
      experience: Array.isArray(updates.experience) ? updates.experience as ExperienceItem[] : portfolio.experience,
      education: Array.isArray(updates.education) ? updates.education as EducationItem[] : portfolio.education,
      projects: Array.isArray(updates.projects) ? updates.projects as ProjectItem[] : portfolio.projects,
    };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async getUploadedFile(id: number): Promise<UploadedFile | undefined> {
    return this.uploadedFiles.get(id);
  }

  async createUploadedFile(insertFile: InsertUploadedFile): Promise<UploadedFile> {
    const id = this.currentFileId++;
    const file: UploadedFile = {
      ...insertFile,
      id,
      createdAt: new Date(),
      size: insertFile.size || 0,
      extractedText: insertFile.extractedText || null,
      portfolioId: insertFile.portfolioId || 0,
    };
    this.uploadedFiles.set(id, file);
    return file;
  }

  async updateUploadedFile(id: number, updates: Partial<InsertUploadedFile>): Promise<UploadedFile | undefined> {
    const file = this.uploadedFiles.get(id);
    if (!file) return undefined;

    const updatedFile: UploadedFile = {
      ...file,
      ...updates,
    };
    this.uploadedFiles.set(id, updatedFile);
    return updatedFile;
  }
}

export const storage = new MemStorage();
