import React from 'react';
import { Upload } from 'lucide-react';
import DocumentAnalyzer from '@/components/DocumentAnalyzer';

interface UploadStepProps {
  description: string;
  onFilesChange: (files: any[]) => void;
  onAnalysisComplete: (analysis: any) => void;
  onStepComplete: (step: string) => void;
  // Nouvelle prop pour recevoir les documents existants
  existingDocuments?: any[];
}

export const UploadStep: React.FC<UploadStepProps> = ({
  description,
  onFilesChange,
  onAnalysisComplete,
  onStepComplete,
  existingDocuments = []
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Déposez vos documents</h2>
        <p className="text-gray-600">{description}</p>
        {existingDocuments.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {existingDocuments.length} document(s) déjà chargé(s)
          </p>
        )}
      </div>
      <DocumentAnalyzer
        onFilesChange={onFilesChange}
        onAnalysisComplete={onAnalysisComplete}
        onStepComplete={onStepComplete}
        maxFiles={3}
        acceptedFileTypes={['.pdf', '.png', '.jpg', '.txt']}
        initialDocuments={existingDocuments}
      />
    </div>
  );
};