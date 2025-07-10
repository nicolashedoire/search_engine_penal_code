// components/layout/Header.v2.tsx
import React from 'react';
import { Layers, Bell, BarChart3, Download } from 'lucide-react';

interface HeaderProps {
  showStats: boolean;
  onToggleStats: () => void;
  alertsCount?: number;
  onAlertsClick?: () => void;
  onExportClick?: () => void;
}

/**
 * Bouton d'action standardisé pour le header.
 */
const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-colors"
  >
    {children}
  </button>
);

/**
 * Version 2 du Header, avec une identité visuelle plus forte
 * et une disposition professionnelle.
 */
export const Header: React.FC<HeaderProps> = ({
  onToggleStats,
  onAlertsClick,
  onExportClick,
  alertsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Section Gauche : Logo et Nom de l'application */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Nexus AI {/* ✨ Nouveau nom */}
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
              BETA
            </span>
          </div>

          {/* Section Droite : Actions de l'utilisateur */}
          <div className="flex items-center gap-2">
            <ActionButton onClick={onToggleStats}>
              <BarChart3 size={16} />
              Statistiques
            </ActionButton>
            
            <ActionButton onClick={onAlertsClick}>
              <div className="relative">
                <Bell size={16} />
                {alertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {alertsCount}
                  </span>
                )}
              </div>
              Alertes
            </ActionButton>

            <div className="h-6 w-px bg-slate-200 mx-2" aria-hidden="true" />

            <ActionButton onClick={onExportClick}>
              <Download size={16} />
              Export
            </ActionButton>
          </div>

        </div>
      </div>
    </header>
  );
};