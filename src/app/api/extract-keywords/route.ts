// app/api/extract-keywords/route.ts (APP ROUTER)
import { NextRequest, NextResponse } from 'next/server';

interface DocumentInput {
  name: string;
  content: string;
}

interface KeywordExtractionRequest {
  documents: DocumentInput[];
  context?: string;
}

interface KeywordExtractionResponse {
  keywords: string[];
  domain: string;
  confidence: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DÉBUT API CALL (App Router) ===');
    
    const body: KeywordExtractionRequest = await request.json();
    console.log('Body reçu:', body);

    const { documents, context } = body;

    // Validation des données
    if (!documents || !Array.isArray(documents)) {
      console.log('❌ Documents manquants ou invalides');
      return NextResponse.json(
        { error: 'Documents requis', details: 'Le champ documents doit être un tableau' },
        { status: 400 }
      );
    }

    if (documents.length === 0) {
      console.log('❌ Aucun document fourni');
      return NextResponse.json(
        { error: 'Aucun document fourni', details: 'Au moins un document est requis' },
        { status: 400 }
      );
    }

    console.log(`📄 ${documents.length} document(s) reçu(s)`);
    console.log('🔑 Clé OpenAI présente:', !!process.env.OPENAI_API_KEY);

    // Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ Clé OpenAI manquante');
      return NextResponse.json(
        { error: 'Configuration manquante', details: 'Clé API OpenAI non configurée' },
        { status: 500 }
      );
    }

    // Import dynamique d'OpenAI
    const { default: OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Construire le prompt
    const documentsText = documents.map((doc, index) => 
      `Document ${index + 1}: ${doc.name}\nContenu: ${doc.content}`
    ).join('\n\n');

    const prompt = `
Analysez les documents juridiques suivants et extrayez les mots-clés juridiques les plus pertinents.

Contexte: ${context || 'Analyse juridique générale'}

Documents:
${documentsText}

Instructions:
- Identifiez le domaine juridique principal
- Extrayez 5-15 mots-clés juridiques en français
- Évaluez votre confiance (0-1)
- Répondez UNIQUEMENT en JSON valide

Format obligatoire:
{
  "keywords": ["terme1", "terme2", "terme3"],
  "domain": "domaine juridique",
  "confidence": 0.85
}
`;

    console.log('🤖 Appel OpenAI en cours...');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'Vous êtes un expert juridique français. Répondez uniquement en JSON valide.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = response.choices[0]?.message?.content;
    console.log('📤 Réponse OpenAI brute:', result);

    if (!result) {
      throw new Error('Aucune réponse d\'OpenAI');
    }

    try {
      const parsedResult = JSON.parse(result);
      console.log('✅ JSON parsé avec succès:', parsedResult);
      
      // Validation et nettoyage
      const cleanedResult: KeywordExtractionResponse = {
        keywords: Array.isArray(parsedResult.keywords) 
          ? parsedResult.keywords.filter(k => typeof k === 'string').slice(0, 15)
          : ['analyse', 'document'],
        domain: parsedResult.domain || 'Analyse générale',
        confidence: Math.min(Math.max(parsedResult.confidence || 0.7, 0), 1)
      };

      console.log('✅ Résultat final:', cleanedResult);
      return NextResponse.json(cleanedResult);

    } catch (parseError) {
      console.log('⚠️ Erreur de parsing JSON, utilisation du fallback');
      
      // Fallback si JSON invalide
      const fallbackResult: KeywordExtractionResponse = {
        keywords: ['analyse', 'document', 'juridique'],
        domain: 'Analyse générale',
        confidence: 0.6
      };

      return NextResponse.json(fallbackResult);
    }

  } catch (error: any) {
    console.error('❌ Erreur API:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'extraction', details: error.message || 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

// Optionnel: gérer d'autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', details: 'Cette API n\'accepte que POST' },
    { status: 405 }
  );
}