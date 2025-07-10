// components/steps/NatureDemandStep.v2.tsx
import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Home, Car, Heart, Building, Gavel, FileText, Users,
  Lightbulb, Target, CheckCircle2, Info
} from 'lucide-react';

// --- TYPES (inchangés) ---
interface NatureDemande {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  keywords: string[];
}

interface NatureDemandStepProps {
  description: string;
  onNatureSelect: (nature: NatureDemande, customDescription?: string) => void;
  selectedNature?: NatureDemande | null;
  customDescription?: string;
}


// --- DONNÉES (légèrement simplifiées, on enlève "examples" qui surchargeait) ---
const naturesDemandeOptions: NatureDemande[] = [
  { id: 'travail', title: 'Droit du travail', description: 'Litiges liés aux contrats, licenciements, salaires, harcèlement...', icon: <Briefcase size={24} />, color: 'text-blue-500', keywords: ['contrat travail', 'licenciement', 'préavis', 'salaire', 'congé', 'rupture conventionnelle'] },
  { id: 'immobilier', title: 'Droit immobilier', description: 'Concerne les achats, ventes, baux, copropriété, construction...', icon: <Home size={24} />, color: 'text-green-500', keywords: ['bail', 'loyer', 'vente immobilière', 'copropriété', 'vices cachés', 'servitude'] },
  { id: 'famille', title: 'Droit de la famille', description: 'Relatif au divorce, garde d\'enfants, succession, adoption...', icon: <Heart size={24} />, color: 'text-pink-500', keywords: ['divorce', 'garde enfants', 'pension alimentaire', 'succession', 'adoption'] },
  { id: 'automobile', title: 'Droit automobile', description: 'Pour les accidents, assurances, litiges sur un véhicule...', icon: <Car size={24} />, color: 'text-orange-500', keywords: ['accident', 'assurance auto', 'responsabilité', 'expertise', 'indemnisation'] },
  { id: 'commercial', title: 'Droit commercial', description: 'Pour les entreprises, contrats commerciaux, création de sociétés...', icon: <Building size={24} />, color: 'text-purple-500', keywords: ['société', 'contrat commercial', 'concurrence', 'bail commercial', 'cession fonds'] },
  { id: 'penal', title: 'Droit pénal', description: 'Concerne les infractions, contraventions, procédures pénales...', icon: <Gavel size={24} />, color: 'text-red-500', keywords: ['infraction', 'plainte', 'garde à vue', 'délit', 'contravention'] },
  { id: 'administratif', title: 'Droit administratif', description: 'Rapports avec l\'administration, permis, taxes, fonction publique...', icon: <FileText size={24} />, color: 'text-indigo-500', keywords: ['administration', 'permis construire', 'taxe', 'recours', 'fonction publique'] },
  { id: 'consommation', title: 'Consommation', description: 'Achats, garanties, crédits, litiges avec un vendeur...', icon: <Users size={24} />, color: 'text-teal-500', keywords: ['garantie', 'vice caché', 'rétractation', 'crédit', 'arnaque'] },
];

/**
 * Version 2 du composant de sélection de la nature de la demande.
 * L'objectif est de simplifier l'interface en utilisant un layout en 2 colonnes
 * pour une expérience utilisateur plus fluide et moins surchargée.
 */
export const NatureDemandStep: React.FC<NatureDemandStepProps> = ({
  description,
  onNatureSelect,
  // On utilise l'état interne pour gérer la sélection et la description
}) => {
  const [selected, setSelected] = useState<NatureDemande | null>(null);
  const [customDesc, setCustomDesc] = useState('');

  const handleSelectNature = (nature: NatureDemande) => {
    setSelected(nature);
  };

  const handleKeywordClick = (keyword: string) => {
    setCustomDesc(prev => prev ? `${prev} ${keyword}` : keyword);
  };

  const handleSubmit = () => {
    if (selected) {
      onNatureSelect(selected, customDesc);
    }
  };
  
  // Utilisation de useMemo pour ne recalculer que si nécessaire
  const selectedNatureDetails = useMemo(() => {
    return selected ? naturesDemandeOptions.find(n => n.id === selected.id) : null;
  }, [selected]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Quelle est la nature de votre besoin ?</h1>
        <p className="text-lg text-gray-600 mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* COLONNE 1: Grille de sélection */}
        <div className="grid grid-cols-2 gap-4">
          {naturesDemandeOptions.map((nature) => (
            <button
              key={nature.id}
              onClick={() => handleSelectNature(nature)}
              className={`relative group p-4 border rounded-xl text-center transition-all duration-200 ${
                selected?.id === nature.id 
                  ? 'bg-blue-50 border-blue-500 shadow-md' 
                  : 'bg-white hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              {selected?.id === nature.id && (
                <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
              )}
              <div className={`inline-block p-3 rounded-full bg-slate-100 mb-3 group-hover:bg-blue-100 transition-colors ${selected?.id === nature.id ? 'bg-blue-100' : ''}`}>
                <span className={nature.color}>{nature.icon}</span>
              </div>
              <p className="font-semibold text-gray-700">{nature.title}</p>
            </button>
          ))}
        </div>

        {/* COLONNE 2: Panneau de détails et d'action */}
        <div className="bg-slate-50 rounded-xl p-6 h-fit sticky top-6">
          {!selectedNatureDetails ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Info size={40} className="mb-4" />
              <h3 className="font-semibold text-lg">Sélectionnez une catégorie</h3>
              <p className="text-sm">Choisissez un domaine à gauche pour commencer à décrire votre situation.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-5 animate-fade-in">
              {/* Rappel de la sélection */}
              <div className="flex items-center space-x-3">
                 <span className={`${selectedNatureDetails.color} p-2 bg-white rounded-lg`}>{selectedNatureDetails.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedNatureDetails.title}</h3>
                  <p className="text-sm text-gray-600">{selectedNatureDetails.description}</p>
                </div>
              </div>
              
              {/* Zone de texte */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Décrivez votre situation (optionnel)
                </label>
                <textarea
                  id="description"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Ex: Je souhaite contester un licenciement pour faute grave..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows={4}
                  maxLength={500}
                />
                 <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <span><Lightbulb className="inline w-3 h-3 mr-1" />Une description précise aide l'IA.</span>
                  <span>{customDesc.length}/500</span>
                </div>
              </div>

              {/* Mots-clés interactifs */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Suggestions de mots-clés :</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNatureDetails.keywords.map(kw => (
                    <button 
                      key={kw} 
                      onClick={() => handleKeywordClick(kw)}
                      className="px-2 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton d'action */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Valider et continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};