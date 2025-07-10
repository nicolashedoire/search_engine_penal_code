// components/steps/ResultsStep.v2.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, AlertTriangle, Target, Search } from 'lucide-react';

// --- INTERFACE MISE À JOUR POUR UN VRAI RAPPORT ---
interface AttentionPoint {
  title: string;
  description: string;
  recommendation: string;
}

interface ResultsStepProps {
  // Les props peuvent être passées ici, mais pour la démo, nous utilisons des données en dur.
}

/**
 * Version 2 du composant de résultats.
 * Conçu comme un rapport d'analyse final, actionnable et à forte valeur ajoutée.
 */
export const ResultsStep: React.FC<ResultsStepProps> = () => {
  // --- DONNÉES EN DUR POUR UNE DÉMONSTRATION "SEXY" ---
  const articlesCount = 12;
  const confidenceScore = 92;
  const natureDemande = 'Droit du travail';
  const aiSummary = "L'analyse des documents révèle une situation de licenciement potentiellement litigieuse, avec des questions clés concernant le respect de la procédure de préavis et le calcul des indemnités. Plusieurs zones de risque nécessitent une attention immédiate pour prévenir un contentieux prud'homal coûteux.";
  
  const attentionPoints: AttentionPoint[] = [
    {
      title: 'Validité du motif de licenciement',
      description: "Le motif de 'faute simple' invoqué pourrait être requalifié par un tribunal si les preuves factuelles (e-mails, témoignages) sont jugées insuffisantes.",
      recommendation: "Compiler un dossier factuel détaillé pour étayer la faute. Évaluer le risque financier d'une contestation prud'homale.",
    },
    {
      title: 'Calcul des indemnités de rupture',
      description: "Le calcul des indemnités doit impérativement inclure toutes les primes et avantages variables des 12 derniers mois pour être conforme à la jurisprudence récente.",
      recommendation: "Auditer les fiches de paie et la convention collective applicable pour s'assurer de l'exactitude du calcul et éviter un redressement.",
    },
    {
      title: 'Respect de la procédure de préavis',
      description: "Toute erreur dans la notification (lettre recommandée) ou la durée du préavis peut entraîner des sanctions financières pour l'entreprise.",
      recommendation: "Confirmer les délais stipulés dans la convention collective, qui peuvent être plus longs que le délai légal standard, et vérifier la preuve de réception.",
    },
  ];

  const handleDownloadReport = () => {
    alert("Génération du rapport PDF en cours...");
    // Ici, vous pourriez utiliser une librairie comme jsPDF ou une API pour générer un vrai rapport.
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale : Le Rapport */}
        <div className="lg:col-span-2 space-y-8">
          {/* En-tête du rapport */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-indigo-600 font-semibold">Rapport Final</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">Synthèse de Votre Analyse</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">Voici les conclusions et recommandations stratégiques générées par l'IA Nexus à partir de vos documents.</p>
          </motion.div>

          {/* Résumé Exécutif */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-3">
              <FileText size={20} className="text-indigo-500"/>
              Résumé Exécutif par l'IA
            </h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {aiSummary}
            </p>
          </motion.div>
          
          {/* Points de Vigilance & Recommandations */}
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-amber-500" />
              {attentionPoints.length} Points de Vigilance & Recommandations
            </h3>
            <div className="space-y-4">
              {attentionPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + index * 0.15 } }}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-slate-800">{point.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{point.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3">
                    <Target size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Recommandation Stratégique</p>
                      <p className="text-sm text-slate-600">{point.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Latérale : Métriques & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h3 className="font-semibold text-slate-800 mb-2">Score de Confiance</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><motion.path initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${confidenceScore}, 100`}} transition={{ duration: 1, ease: "easeOut", delay: 0.5}} className="text-green-500" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-green-600">{confidenceScore}%</div>
            </div>
             <p className="text-sm text-slate-500 mt-2">Précision de l'analyse IA</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-semibold text-slate-800 mb-4">Prochaines Étapes</h3>
             <div className="space-y-3">
                <button 
                  onClick={handleDownloadReport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Download size={16} />
                  Télécharger le Rapport
                </button>
                 <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  <Search size={16} />
                  Explorer les {articlesCount} Articles
                </button>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};