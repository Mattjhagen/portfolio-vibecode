import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { storage } from "./storage";
import { extractTextFromFile, validateFileType, validateFileSize } from "./services/file-parser";
import { parseResumeWithAI, generatePortfolioContent } from "./services/openai";
import { insertPortfolioSchema, insertUploadedFileSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload resume endpoint
  app.post("/api/upload-resume", upload.single("resume"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;

      // Validate file type and size
      if (!validateFileType(file.mimetype)) {
        return res.status(400).json({ 
          message: "Invalid file type. Please upload a PDF, DOCX, or TXT file." 
        });
      }

      if (!validateFileSize(file.size)) {
        return res.status(400).json({ 
          message: "File too large. Maximum size is 10MB." 
        });
      }

      // Extract text from file
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText.trim()) {
        return res.status(400).json({ 
          message: "Could not extract text from the uploaded file. Please ensure it contains readable text." 
        });
      }

      // Save uploaded file record
      const uploadedFile = await storage.createUploadedFile({
        filename: `${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        extractedText,
        portfolioId: 0,
      });

      res.json({ 
        message: "File uploaded successfully",
        fileId: uploadedFile.id,
        extractedText: extractedText.substring(0, 500) + "..." // Preview
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        message: "Failed to upload file: " + (error as Error).message 
      });
    }
  });

  // Generate portfolio endpoint
  app.post("/api/generate-portfolio", async (req, res) => {
    try {
      const { fileId } = req.body;

      if (!fileId) {
        return res.status(400).json({ message: "File ID is required" });
      }

      // Get uploaded file
      const uploadedFile = await storage.getUploadedFile(fileId);
      if (!uploadedFile || !uploadedFile.extractedText) {
        return res.status(404).json({ message: "File not found or text not extracted" });
      }

      // Parse resume with AI
      const parsedData = await parseResumeWithAI(uploadedFile.extractedText);
      
      // Generate unique subdomain
      const subdomain = generateSubdomain(parsedData.name);
      
      // Create portfolio
      const portfolioData = {
        subdomain,
        name: parsedData.name,
        title: parsedData.title,
        about: parsedData.about,
        email: parsedData.email,
        phone: parsedData.phone,
        linkedin: parsedData.linkedin,
        github: parsedData.github,
        website: parsedData.website,
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        projects: parsedData.projects,
        theme: parsedData.theme,
        isPublic: "true",
      };

      const validatedData = insertPortfolioSchema.parse(portfolioData);
      const portfolio = await storage.createPortfolio(validatedData);

      // Update uploaded file with portfolio ID
      await storage.updateUploadedFile(fileId, { portfolioId: portfolio.id });

      res.json({
        message: "Portfolio generated successfully",
        portfolio: {
          id: portfolio.id,
          subdomain: portfolio.subdomain,
          name: portfolio.name,
          title: portfolio.title,
          url: `https://${portfolio.subdomain}.vibecodes.space`
        }
      });
    } catch (error) {
      console.error("Portfolio generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate portfolio: " + (error as Error).message 
      });
    }
  });

  // Get portfolio by subdomain
  app.get("/api/portfolio/:subdomain", async (req, res) => {
    try {
      const { subdomain } = req.params;
      const portfolio = await storage.getPortfolioBySubdomain(subdomain);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      res.json(portfolio);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ 
        message: "Failed to get portfolio: " + (error as Error).message 
      });
    }
  });

  // Get all portfolios (for examples)
  app.get("/api/portfolios", async (req, res) => {
    try {
      const portfolios = await storage.getAllPortfolios();
      const publicPortfolios = portfolios
        .filter(p => p.isPublic === "true")
        .map(p => ({
          id: p.id,
          subdomain: p.subdomain,
          name: p.name,
          title: p.title,
          theme: p.theme,
          url: `https://${p.subdomain}.vibecodes.space`
        }));

      res.json(publicPortfolios);
    } catch (error) {
      console.error("Get portfolios error:", error);
      res.status(500).json({ 
        message: "Failed to get portfolios: " + (error as Error).message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateSubdomain(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);
  
  const timestamp = Date.now().toString().slice(-4);
  return `${cleaned}${timestamp}`;
}
