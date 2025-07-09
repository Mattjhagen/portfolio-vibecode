# VibeCode Portfolio Generator

## Overview

VibeCode is a full-stack web application that generates dynamic portfolios from uploaded resumes using AI-powered content parsing. The application allows users to upload PDF, DOCX, or TXT resume files, which are then processed by OpenAI's GPT-4 to extract structured portfolio data and generate professional portfolio websites with custom subdomains.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Processing**: Multer for file uploads, pdf-parse and mammoth for text extraction
- **AI Integration**: OpenAI GPT-4 for resume parsing and content generation

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express.js API
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Database Schema
- **Portfolios Table**: Stores portfolio data including personal info, skills, experience, education, projects, and theming
- **Uploaded Files Table**: Tracks uploaded resume files with metadata and extracted text
- **JSON Fields**: Complex data structures (skills, experience, education, projects) stored as JSON

### API Endpoints
- `POST /api/upload-resume`: Handles resume file uploads and AI processing
- `GET /api/portfolio/:subdomain`: Retrieves portfolio data by subdomain
- `GET /api/portfolios`: Lists all portfolios

### File Processing Pipeline
1. **Upload Validation**: File type (PDF/DOCX/TXT) and size validation (10MB limit)
2. **Text Extraction**: Content extraction using appropriate parsers
3. **AI Processing**: OpenAI GPT-4 parses resume text into structured data
4. **Portfolio Generation**: Creates portfolio record with unique subdomain
5. **Response**: Returns generated portfolio data to frontend

### Frontend Components
- **Home Page**: Landing page with upload zone and portfolio showcase
- **Portfolio Page**: Dynamic portfolio display with custom theming
- **Upload Zone**: Drag-and-drop file upload with progress tracking
- **Portfolio Card**: Preview cards for generated portfolios

## Data Flow

1. **User uploads resume** → File validation and storage
2. **Text extraction** → Content parsed from PDF/DOCX/TXT
3. **AI processing** → GPT-4 structures resume data
4. **Portfolio creation** → Database record with unique subdomain
5. **Portfolio display** → Dynamic rendering with custom themes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database connection
- **drizzle-orm**: Type-safe database operations
- **openai**: GPT-4 API integration
- **multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- **Server**: `npm run dev` starts Express server with hot reload
- **Client**: Vite dev server with HMR
- **Database**: Drizzle migrations with `npm run db:push`

### Production
- **Build**: `npm run build` creates optimized client and server bundles
- **Server**: Compiled to `dist/index.js` with esbuild
- **Client**: Static files served from `dist/public`
- **Database**: PostgreSQL with connection pooling

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment mode (development/production)

## Note to Investors

This project is currently in a prototype stage and relies on the OpenAI API for its core functionality. To fully test and demonstrate the capabilities of this application, access to API credits is essential. We welcome any support in this area to help us move the project forward.

## Changelog
- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
# ResumAI
