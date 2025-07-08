import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert resume parser and portfolio generator. Parse the provided resume text and extract structured information for creating a professional portfolio website.

Extract the following information and return it as JSON:
- name: Full name
- title: Professional title/role
- about: Professional summary (2-3 sentences)
- email: Email address
- phone: Phone number
- linkedin: LinkedIn profile URL
- github: GitHub profile URL
- website: Personal website URL
- skills: Array of technical skills
- experience: Array of work experience with company, position, startDate, endDate, description, isCurrentJob
- education: Array of education with institution, degree, field, startDate, endDate, gpa
- projects: Array of projects with name, description, technologies, url, githubUrl
- theme: Recommended theme based on profession (default, creative, technical, executive)

For dates, use format "YYYY-MM" or "YYYY" if month not specified. Use "Present" for current positions.
If information is missing, use empty string or empty array as appropriate.
Be intelligent about extracting implicit information and formatting it professionally.`
        },
        {
          role: "user",
          content: `Parse this resume and extract structured portfolio data:\n\n${resumeText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and provide defaults
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
          content: `You are a professional portfolio content generator. Create enhanced, professional content for a portfolio website based on the provided data.

Enhance the about section to be more compelling and professional.
Improve project descriptions to be more engaging and highlight achievements.
Ensure all content is professional, error-free, and optimized for a portfolio website.
Maintain the original structure but enhance the quality and impact of the content.

Return the enhanced data in the same JSON format as provided.`
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
