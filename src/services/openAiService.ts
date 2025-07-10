// services/openaiService.ts
import OpenAI from 'openai';
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources/index.mjs';
import { UserMessage, DocumentInput, KeywordExtractionResponse } from '@/types/openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Vérifie si un objet est un AsyncIterable
   */
  private isAsyncIterable<T>(obj: unknown): obj is AsyncIterable<T> {
    return obj != null && typeof (obj as any)[Symbol.asyncIterator] === 'function';
  }

  /**
   * Appel générique à OpenAI
   */
  async callOpenAI(messages: UserMessage[], stream: boolean = false): Promise<AsyncIterable<ChatCompletionChunk> | ChatCompletion> {
    return this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      stream,
      temperature: 0.3,
      max_tokens: 1000,
    });
  }

  /**
   * Création des messages pour OpenAI
   */
  createMessages(userRequest: string, systemPrompt: string): UserMessage[] {
    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userRequest },
    ];
  }

  /**
   * Extraction de mots-clés spécifiquement pour les documents juridiques
   */
  async extractLegalKeywords(documents: DocumentInput[], context?: string): Promise<KeywordExtractionResponse> {
    const systemPrompt = `
      Vous êtes un expert en analyse juridique française. 
      Votre tâche est d'extraire les mots-clés juridiques les plus pertinents des documents fournis.
      Répondez uniquement en JSON valide selon le format spécifié.
    `;

    const userPrompt = `
      Analysez les documents juridiques suivants et extrayez les mots-clés juridiques les plus pertinents.
      
      Contexte: ${context || 'Analyse juridique générale'}
      
      Documents à analyser:
      ${documents.map((doc, index) => `
        Document ${index + 1}: ${doc.name}
        Contenu: ${doc.content.substring(0, 2000)}${doc.content.length > 2000 ? '...' : ''}
      `).join('\n')}
      
      Instructions:
      - Identifiez le domaine juridique principal (ex: "Droit du travail", "Droit commercial", etc.)
      - Extrayez 5-15 mots-clés juridiques pertinents en français
      - Évaluez votre niveau de confiance (0-1)
      - Privilégiez les termes techniques juridiques
      
      Format de réponse JSON obligatoire:
      {
        "keywords": ["terme1", "terme2", "terme3"],
        "domain": "domaine juridique identifié",
        "confidence": 0.85
      }
    `;

    const messages = this.createMessages(userPrompt, systemPrompt);
    
    try {
      const response = await this.callOpenAI(messages, false) as ChatCompletion;
      const result = response.choices[0]?.message?.content;
      
      if (!result) {
        throw new Error('Aucune réponse reçue d\'OpenAI');
      }

      const parsedResult = JSON.parse(result) as KeywordExtractionResponse;
      
      // Validation et nettoyage
      return {
        keywords: parsedResult.keywords
          ?.filter(keyword => typeof keyword === 'string' && keyword.trim().length > 0)
          ?.map(keyword => keyword.trim())
          ?.slice(0, 15) || [],
        domain: parsedResult.domain || 'Analyse juridique générale',
        confidence: Math.min(Math.max(parsedResult.confidence || 0.7, 0), 1)
      };

    } catch (error: any) {
      console.error('Erreur lors de l\'extraction de mots-clés:', error);
      throw new Error(`Erreur OpenAI: ${error.message}`);
    }
  }

  /**
   * Analyse de sentiment d'un document juridique
   */
  async analyzeLegalSentiment(content: string): Promise<{
    sentiment: 'positif' | 'neutre' | 'négatif';
    confidence: number;
    risks: string[];
  }> {
    const systemPrompt = `
      Vous êtes un expert en analyse de documents juridiques.
      Analysez le sentiment et les risques potentiels du document fourni.
    `;

    const userPrompt = `
      Analysez le document suivant et évaluez:
      1. Le sentiment général (positif, neutre, négatif)
      2. Les risques juridiques potentiels
      3. Votre niveau de confiance
      
      Document: ${content.substring(0, 3000)}
      
      Répondez en JSON:
      {
        "sentiment": "positif|neutre|négatif",
        "confidence": 0.85,
        "risks": ["risque1", "risque2"]
      }
    `;

    const messages = this.createMessages(userPrompt, systemPrompt);
    
    try {
      const response = await this.callOpenAI(messages, false) as ChatCompletion;
      const result = response.choices[0]?.message?.content;
      
      if (!result) {
        throw new Error('Aucune réponse reçue d\'OpenAI');
      }

      return JSON.parse(result);

    } catch (error: any) {
      console.error('Erreur lors de l\'analyse de sentiment:', error);
      throw new Error(`Erreur analyse sentiment: ${error.message}`);
    }
  }

  /**
   * Gestion du streaming de réponse
   */
  async streamResponse(
    response: AsyncIterable<ChatCompletionChunk> | ChatCompletion,
    onChunk?: (content: string) => void
  ): Promise<string> {
    let result = '';

    if (this.isAsyncIterable<ChatCompletionChunk>(response)) {
      // Cas d'un flux
      for await (const part of response) {
        const content = part.choices[0]?.delta?.content;
        if (content) {
          result += content;
          onChunk?.(content);
        }
      }
    } else {
      // Cas d'une réponse complète
      const content = response.choices[0]?.message?.content;
      if (content) {
        result = content;
        onChunk?.(content);
      }
    }

    return result;
  }
}

// Instance singleton pour l'utilisation dans l'application
export const openaiService = new OpenAIService();