import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "default_key",
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "default_key");

export interface ParsedResumeData {
  name: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrentJob: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
  }>;
  theme: string;
}

const resumeParsingPrompt = `You are an expert resume parser and portfolio generator. Parse the provided resume text and extract structured information for creating a professional portfolio website.\n\nExtract the following information and return it as JSON:\n- name: Full name\n- title: Professional title/role\n- about: Professional summary (2-3 sentences)\n- email: Email address\n- phone: Phone number\n- linkedin: LinkedIn profile URL\n- github: GitHub profile URL\n- website: Personal website URL\n- skills: Array of technical skills\n- experience: Array of work experience with company, position, startDate, endDate, description, isCurrentJob\n- education: Array of education with institution, degree, field, startDate, endDate, gpa\n- projects: Array of projects with name, description, technologies, url, githubUrl\n- theme: Recommended theme based on profession (default, creative, technical, executive)\n\nFor dates, use format "YYYY-MM" or "YYYY" if month not specified. Use "Present" for current positions.\nIf information is missing, use empty string or empty array as appropriate.\nBe intelligent about extracting implicit information and formatting it professionally.`;

async function parseResumeWithGemini(resumeText: string): Promise<ParsedResumeData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `${resumeParsingPrompt}\n\nParse this resume and extract structured portfolio data:\n\n${resumeText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n|```/g, '').trim();
    const parsedResult = JSON.parse(jsonString);

    return {
      name: parsedResult.name || "Professional Name",
      title: parsedResult.title || "Professional Title",
      about: parsedResult.about || "Experienced professional with a passion for excellence.",
      email: parsedResult.email || "",
      phone: parsedResult.phone || "",
      linkedin: parsedResult.linkedin || "",
      github: parsedResult.github || "",
      website: parsedResult.website || "",
      skills: Array.isArray(parsedResult.skills) ? parsedResult.skills : [],
      experience: Array.isArray(parsedResult.experience) ? parsedResult.experience : [],
      education: Array.isArray(parsedResult.education) ? parsedResult.education : [],
      projects: Array.isArray(parsedResult.projects) ? parsedResult.projects : [],
      theme: parsedResult.theme || "default",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to parse resume with Gemini: " + (error as Error).message);
  }
}

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: resumeParsingPrompt },
        { role: "user", content: `Parse this resume and extract structured portfolio data:\n\n${resumeText}` }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      name: result.name || "Professional Name",
      title: result.title || "Professional Title",
      about: result.about || "Experienced professional with a passion for excellence.",
      email: result.email || "",
      phone: result.phone || "",
      linkedin: result.linkedin || "",
      github: result.github || "",
      website: result.website || "",
      skills: Array.isArray(result.skills) ? result.skills : [],
      experience: Array.isArray(result.experience) ? result.experience : [],
      education: Array.isArray(result.education) ? result.education : [],
      projects: Array.isArray(result.projects) ? result.projects : [],
      theme: result.theme || "default",
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Check for rate limit or quota error (example status code)
    if ((error as any).status === 429) {
      console.log("OpenAI rate limit exceeded. Falling back to Gemini.");
      return parseResumeWithGemini(resumeText);
    }
    throw new Error("Failed to parse resume with AI: " + (error as Error).message);
  }
}

export async function generatePortfolioContent(parsedData: ParsedResumeData): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional portfolio content generator. Create enhanced, professional content for a portfolio website based on the provided data.\n\nEnhance the about section to be more compelling and professional.\nImprove project descriptions to be more engaging and highlight achievements.\nEnsure all content is professional, error-free, and optimized for a portfolio website.\nMaintain the original structure but enhance the quality and impact of the content.\n\nReturn the enhanced data in the same JSON format as provided.`
        },
        {
          role: "user",
          content: `Enhance this portfolio content:\n\n${JSON.stringify(parsedData, null, 2)}`
        }
      ],
      response_format: { type: "json_object" },
    });

    return response.choices[0].message.content || JSON.stringify(parsedData);
  } catch (error) {
    console.error("OpenAI Content Generation Error:", error);
    // Return original data if enhancement fails
    return JSON.stringify(parsedData);
  }
}
