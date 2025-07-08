import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  const { buffer, mimetype, originalname } = file;
  
  try {
    switch (mimetype) {
      case 'application/pdf':
        return await extractTextFromPDF(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromDOCX(buffer);
      case 'text/plain':
        return buffer.toString('utf-8');
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error(`Error extracting text from ${originalname}:`, error);
    throw new Error(`Failed to extract text from ${originalname}: ${(error as Error).message}`);
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build issues
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid PDF.');
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build issues
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. Please ensure it is a valid Word document.');
  }
}

export function validateFileType(mimetype: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return allowedTypes.includes(mimetype);
}

export function validateFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return size <= maxSize;
}
