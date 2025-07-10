// types/openai.ts

export interface DocumentInput {
    name: string;
    content: string;
    file?: File;
    text?: string;
  }
  
  export interface KeywordExtractionRequest {
    documents: DocumentInput[];
    context?: string;
  }
  
  export interface KeywordExtractionResponse {
    keywords: string[];
    domain: string;
    confidence: number;
    error?: string;
  }
  
  export interface OpenAIError {
    error: string;
    details?: string;
  }
  
  export interface UserMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  
  export interface AnalysisResult {
    domain: string;
    keywords: string[];
    documents: string[];
    confidence: number;
    extractedKeywords?: string[];
  }
  
  export interface StepData {
    documents: DocumentInput[];
    searchTerms: string;
    analysis: AnalysisResult | null;
    results: any[];
  }