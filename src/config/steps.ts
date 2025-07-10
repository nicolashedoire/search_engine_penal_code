import { Brain, FileText, Search, Upload, Target } from "lucide-react";

export const stepsConfig = [
  {
    id: 'nature',
    title: 'Nature du besoin',
    subtitle: 'Définir votre demande',
    icon: Target,
    description: 'Sélectionnez le domaine juridique de votre demande pour une analyse ciblée et optimisée'
  },
  {
    id: 'upload',
    title: 'Documents',
    subtitle: 'Déposer vos fichiers',
    icon: Upload,
    description: 'Téléchargez vos documents juridiques (PDF, Word, images) pour une analyse complète'
  },
  {
    id: 'analysis',
    title: 'Analyse',
    subtitle: 'IA en action',
    icon: Brain,
    description: 'Notre IA examine vos documents et extrait les mots-clés juridiques pertinents'
  },
  {
    id: 'search',
    title: 'Recherche',
    subtitle: 'Articles pertinents',
    icon: Search,
    description: 'Explorez notre base juridique avec les termes extraits automatiquement'
  },
  {
    id: 'results',
    title: 'Résultats',
    subtitle: 'Rapport final',
    icon: FileText,
    description: 'Consultez les articles pertinents et nos recommandations personnalisées'
  }
]