/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import { Network } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';
import dynamic from 'next/dynamic';

// Configure le worker de pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// Enregistre les composants Chart.js
Chart.register(
  ArcElement,
  PieController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Import dynamique du Viewer pour SSR
const Viewer = dynamic(
  () => import('@react-pdf-viewer/core').then((mod) => mod.Viewer),
  { ssr: false }
);

// Types TypeScript
interface AnalysisResult {
  domain: string;
  keywords: string[];
  confidence: number;
  summary: string;
  concepts: {
    pie: { labels: string[]; values: number[] };
    bar: { labels: string[]; values: number[] };
    network: { nodes: any[]; edges: any[] };
  };
}

interface DocumentInfo {
  file: File;
  extractedText: string;
  ocrProgress: number;
  isProcessing: boolean;
  analysisResult?: AnalysisResult;
}

interface DocumentAnalyzerProps {
  onFilesChange?: (files: DocumentInfo[]) => void;
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
  onStepComplete?: (step: 'upload' | 'ocr' | 'analysis') => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  showResults?: boolean;
  className?: string;
  // Nouvelle prop pour recevoir des documents existants
  initialDocuments?: DocumentInfo[];
}

// Fonction OCR pour les PDF
async function ocrPdf(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const { data: { text } } = await Tesseract.recognize(
      canvas,
      'fra',
      { logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const overallProgress = ((pageNum - 1) / pdf.numPages + m.progress / pdf.numPages) * 100;
          onProgress(overallProgress);
        }
      }}
    );
    fullText += `\n\n--- Page ${pageNum} ---\n\n${text}`;
  }

  return fullText;
}

export default function DocumentAnalyzer({
  onFilesChange,
  onAnalysisComplete,
  onStepComplete,
  maxFiles = 5,
  acceptedFileTypes = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.bmp', '.tiff'],
  showResults = true,
  className = '',
  initialDocuments = []
}: DocumentAnalyzerProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>(initialDocuments);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [resultsVisible, setResultsVisible] = useState<boolean>(false);

  const [pieData, setPieData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [barData, setBarData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [networkData, setNetworkData] = useState<{ nodes: any[]; edges: any[] } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pieCanvasRef = useRef<HTMLCanvasElement>(null);
  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkContainerRef = useRef<HTMLDivElement>(null);

  const pieChartInstanceRef = useRef<Chart<'pie'> | null>(null);
  const barChartInstanceRef = useRef<Chart<'bar'> | null>(null);
  const networkInstanceRef = useRef<Network | null>(null);

  const layoutPluginInstance = defaultLayoutPlugin();

  // Restaurer les documents existants si fournis
  useEffect(() => {
    if (initialDocuments.length > 0) {
      setDocuments(initialDocuments);
      // Mettre à jour le texte avec le dernier document
      const lastDoc = initialDocuments[initialDocuments.length - 1];
      if (lastDoc.extractedText) {
        setText(lastDoc.extractedText);
        setCurrentFile(lastDoc.file);
      }
    }
  }, [initialDocuments]);

  // Notifier le parent des changements de fichiers
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(documents);
    }
    
    // Notifier l'étape upload si des fichiers sont présents
    if (documents.length > 0 && onStepComplete) {
      onStepComplete('upload');
    }
  }, [documents, onFilesChange, onStepComplete]);

  // Génère l'URL pour Viewer
  useEffect(() => {
    let objectUrl: string | null = null;
    if (currentFile) {
      objectUrl = URL.createObjectURL(currentFile);
      setFileURL(objectUrl);
    } else {
      setFileURL(null);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentFile]);

  // Met à jour les charts
  useEffect(() => {
    if (pieData && pieCanvasRef.current) {
      pieChartInstanceRef.current?.destroy();
      pieChartInstanceRef.current = new Chart(pieCanvasRef.current, {
        type: 'pie',
        data: { 
          labels: pieData.labels, 
          datasets: [{ 
            data: pieData.values,
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
          }] 
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
    if (barData && barCanvasRef.current) {
      barChartInstanceRef.current?.destroy();
      barChartInstanceRef.current = new Chart(barCanvasRef.current, {
        type: 'bar',
        data: {
          labels: barData.labels,
          datasets: [{ 
            label: 'Score', 
            data: barData.values, 
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8',
            borderWidth: 1
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    if (networkData && networkContainerRef.current) {
      networkInstanceRef.current?.destroy();
      const nodes = new DataSet(networkData.nodes);
      const edges = new DataSet(networkData.edges);
      networkInstanceRef.current = new Network(
        networkContainerRef.current,
        { nodes, edges },
        {
          physics: {
            enabled: true,
            stabilization: { iterations: 100 }
          }
        }
      );
    }
    return () => {
      pieChartInstanceRef.current?.destroy();
      barChartInstanceRef.current?.destroy();
      networkInstanceRef.current?.destroy();
      pieChartInstanceRef.current = null;
      barChartInstanceRef.current = null;
      networkInstanceRef.current = null;
    };
  }, [pieData, barData, networkData]);

  // Fonction pour mettre à jour le statut d'un document
  const updateDocumentStatus = (index: number, updates: Partial<DocumentInfo>) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, ...updates } : doc
    ));
  };

  // Détection drag'n'drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    // Traiter chaque fichier individuellement
    files.slice(0, maxFiles - documents.length).forEach(file => {
      processFile(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Traiter chaque fichier individuellement
    files.slice(0, maxFiles - documents.length).forEach(file => {
      processFile(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Traitement d'un fichier individuel
  const processFile = async (selectedFile: File) => {
    // Ajouter immédiatement le fichier à la liste avec statut "en cours"
    const newDocument: DocumentInfo = {
      file: selectedFile,
      extractedText: '',
      ocrProgress: 0,
      isProcessing: true
    };

    const documentIndex = documents.length;
    setDocuments(prev => [...prev, newDocument]);
    setCurrentFile(selectedFile);

    try {
      let extractedText = '';
      
      if (/\.(png|jpe?g|bmp|tiff)$/i.test(selectedFile.name)) {
        const { data } = await Tesseract.recognize(selectedFile, 'fra', { 
          logger: (m) => {
            if (m.status === 'recognizing text') {
              updateDocumentStatus(documentIndex, { ocrProgress: m.progress * 100 });
            }
          } 
        });
        extractedText = data.text;
      } else if (/\.pdf$/i.test(selectedFile.name)) {
        extractedText = await ocrPdf(selectedFile, (progress) => {
          updateDocumentStatus(documentIndex, { ocrProgress: progress });
        });
      } else if (/\.txt$/i.test(selectedFile.name)) {
        extractedText = await selectedFile.text();
        updateDocumentStatus(documentIndex, { ocrProgress: 100 });
      } else {
        throw new Error(`Type de fichier non supporté: ${selectedFile.type}`);
      }

      // Mettre à jour le document avec le texte extrait
      updateDocumentStatus(documentIndex, {
        extractedText,
        ocrProgress: 100,
        isProcessing: false
      });

      // Mettre à jour le texte affiché (dernier fichier traité)
      setText(extractedText);
      
      // Notifier l'étape OCR complétée
      if (onStepComplete) {
        onStepComplete('ocr');
      }

    } catch (err) {
      console.error('Erreur lors du traitement du fichier:', err);
      updateDocumentStatus(documentIndex, {
        extractedText: `Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        ocrProgress: 0,
        isProcessing: false
      });
    }
  };

  // Supprimer un document
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    // Si on supprime le fichier actuellement affiché, afficher le premier disponible
    if (documents.length > 1) {
      const remainingDocs = documents.filter((_, i) => i !== index);
      if (remainingDocs.length > 0) {
        setCurrentFile(remainingDocs[0].file);
        setText(remainingDocs[0].extractedText);
      }
    } else {
      setCurrentFile(null);
      setText('');
    }
  };

  // Sélectionner un document pour l'affichage
  const selectDocument = (index: number) => {
    const doc = documents[index];
    setCurrentFile(doc.file);
    setText(doc.extractedText);
  };

  // Analyse (API simulation)
  const analyze = async () => {
    if (documents.length === 0 && !text) {
      alert('Veuillez fournir un fichier ou du texte.');
      return;
    }
    
    // Marquer tous les documents comme en cours d'analyse
    setDocuments(prev => prev.map(doc => ({ ...doc, isProcessing: true })));
    setResultsVisible(false);

    try {
      // Simulation d'appel API
      await new Promise((r) => setTimeout(r, 2000));
      
      const analysisResult: AnalysisResult = {
        domain: 'Droit du travail',
        keywords: ['licenciement', 'contrat', 'préavis', 'indemnité'],
        confidence: 0.85,
        summary: 'Le document traite principalement de questions liées au droit du travail, notamment les procédures de licenciement et les obligations contractuelles.',
        concepts: {
          pie: { labels: ['Contrat', 'Licenciement', 'Préavis', 'Indemnités'], values: [35, 30, 20, 15] },
          bar: { labels: ['Contrat', 'Licenciement', 'Préavis', 'Indemnités'], values: [4.2, 3.8, 3.1, 2.5] },
          network: { 
            nodes: [
              { id: 1, label: 'Contrat', color: '#3b82f6' }, 
              { id: 2, label: 'Licenciement', color: '#ef4444' },
              { id: 3, label: 'Préavis', color: '#10b981' },
              { id: 4, label: 'Indemnités', color: '#f59e0b' }
            ], 
            edges: [
              { from: 1, to: 2, label: 'conduit à' },
              { from: 2, to: 3, label: 'implique' },
              { from: 2, to: 4, label: 'génère' }
            ] 
          },
        },
      };

      // Mettre à jour les données des graphiques
      setPieData(analysisResult.concepts.pie);
      setBarData(analysisResult.concepts.bar);
      setNetworkData(analysisResult.concepts.network);

      // Mettre à jour tous les documents avec le résultat d'analyse
      setDocuments(prev => prev.map(doc => ({ 
        ...doc, 
        analysisResult,
        isProcessing: false 
      })));

      setResultsVisible(true);

      // Notifier le parent de l'analyse complétée
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }

      if (onStepComplete) {
        onStepComplete('analysis');
      }

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setDocuments(prev => prev.map(doc => ({ ...doc, isProcessing: false })));
      alert('Erreur lors de l\'analyse. Veuillez réessayer.');
    }
  };

  const isPdf = currentFile?.type === 'application/pdf';
  const canAnalyze = documents.length > 0 || text.trim().length > 0;
  const isAnyProcessing = documents.some(doc => doc.isProcessing);

  return (
    <div className={`w-full max-w-6xl mx-auto p-4 ${className}`}>
      {/* Upload & OCR / Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Liste des documents uploadés */}
        {documents.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Documents chargés ({documents.length}/{maxFiles})</h3>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentFile === doc.file 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => selectDocument(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      doc.isProcessing 
                        ? 'bg-yellow-100' 
                        : doc.extractedText 
                          ? 'bg-green-100' 
                          : 'bg-gray-100'
                    }`}>
                      {doc.isProcessing ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
                      ) : (
                        <span className={`text-xs font-medium ${
                          doc.extractedText ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{doc.file.name}</div>
                      <div className="text-sm text-gray-500">
                        {(doc.file.size / 1024).toFixed(1)} Ko
                        {doc.isProcessing && (
                          <span className="ml-2 text-yellow-600">
                            • En cours... {doc.ocrProgress.toFixed(0)}%
                          </span>
                        )}
                        {!doc.isProcessing && doc.extractedText && (
                          <span className="ml-2 text-green-600">
                            • {doc.extractedText.length} caractères extraits
                          </span>
                        )}
                      </div>
                      {doc.isProcessing && (
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${doc.ocrProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(index);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
                    disabled={doc.isProcessing}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                documents.length >= maxFiles 
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                  : 'border-blue-400 hover:border-blue-600 bg-gray-50'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => documents.length < maxFiles && fileInputRef.current?.click()}
            >
              {documents.length >= maxFiles ? (
                <p className="text-gray-500">Limite de {maxFiles} fichiers atteinte</p>
              ) : (
                <p className="text-gray-500">
                  Cliquez ou déposez un fichier ({acceptedFileTypes.join(', ')})
                  <br />
                  <span className="text-xs">Vous pouvez sélectionner plusieurs fichiers</span>
                </p>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={acceptedFileTypes.join(',')}
                multiple={maxFiles > 1}
              />
            </div>
            <textarea
              rows={5}
              className="w-full border-gray-300 rounded-md p-3 mt-4"
              placeholder="Texte extrait / collé ici"
              value={text}
              onChange={(e) => { setText(e.target.value); setResultsVisible(false); }}
              disabled={isAnyProcessing}
            />
          </div>
          <div className="h-96 border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {isPdf && fileURL ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileURL} plugins={[layoutPluginInstance]} />
              </Worker>
            ) : fileURL && !isPdf ? (
              <img src={fileURL} alt="preview" className="max-w-full max-h-full" />
            ) : (
              <p className="text-gray-400">
                {documents.length > 0 
                  ? 'Cliquez sur un document pour le prévisualiser' 
                  : 'Aperçu PDF/Image'
                }
              </p>
            )}
          </div>
        </div>
        {/* <div className="flex mt-6 gap-4">
          <input
            type="text"
            className="flex-1 border-gray-300 rounded-md p-3"
            placeholder="Requête personnalisée (optionnel)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isAnyProcessing}
          />
          <button
            className={`bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors ${
              isAnyProcessing || !canAnalyze
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
            onClick={analyze}
            disabled={isAnyProcessing || !canAnalyze}
          >
            {isAnyProcessing ? 'Traitement en cours...' : 'Analyser'}
          </button>
        </div> */}
      </div>

      {showResults && resultsVisible && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Résultats de l'analyse</h2>
            <div className="text-sm text-gray-500">
              Confiance: <span className="font-medium text-green-600">85%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-900">Répartition des concepts</h3>
              <div className="h-64">
                <canvas ref={pieCanvasRef}></canvas>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-900">Scores de pertinence</h3>
              <div className="h-64">
                <canvas ref={barCanvasRef}></canvas>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-900">Réseau conceptuel</h3>
              <div ref={networkContainerRef} style={{ height: '250px', border: '1px solid #eee', borderRadius: '8px' }}></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4 text-gray-900">Résumé de l'analyse</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Domaine identifié:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Droit du travail</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Mots-clés principaux:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['licenciement', 'contrat', 'préavis', 'indemnité'].map(keyword => (
                      <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Résumé:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Le document traite principalement de questions liées au droit du travail, notamment les procédures de licenciement et les obligations contractuelles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}