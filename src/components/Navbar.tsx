import React from 'react';
import { Sparkles, FileText, Camera } from 'lucide-react';

export type ActiveTab = 'studio' | 'persona' | 'feed' | 'brands' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMediaKit: () => void;
  onQuickShoot: () => void;
  currentPersonaName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMediaKit,
  onQuickShoot,
  currentPersonaName,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'studio', label: 'Fotoğraf Stüdyosu' },
    { id: 'persona', label: 'Persona & DNA' },
    { id: 'feed', label: 'Feed Planlayıcı' },
    { id: 'brands', label: 'Marka İşbirlikleri' },
    { id: 'analytics', label: 'Topluluk & Analiz' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D13]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark in display face */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-xl font-bold tracking-tight text-white font-display hover:text-rose-300 transition-colors"
        >
          AuraPersona
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links (single line) */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-400">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-sm ${
                isActive
                  ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-500'
                  : 'hover:text-neutral-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMediaKit}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-white/10 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5 text-rose-400" />
          <span>Medya Kiti</span>
        </button>

        <button
          type="button"
          onClick={onQuickShoot}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-indigo-600 rounded-lg hover:from-rose-600 hover:to-indigo-700 shadow-sm transition-all whitespace-nowrap"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>+ Yeni Fotoğraf</span>
        </button>
      </div>
    </header>
  );
};
