import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { PhotoStudio } from './components/PhotoStudio';
import { PersonaDNA } from './components/PersonaDNA';
import { FeedPlanner } from './components/FeedPlanner';
import { BrandDeals } from './components/BrandDeals';
import { AnalyticsCommunity } from './components/AnalyticsCommunity';
import { MediaKitModal } from './components/MediaKitModal';
import {
  INITIAL_PERSONAS,
  INITIAL_PHOTOS,
  INITIAL_BRAND_DEALS,
  INITIAL_COMMENTS,
} from './data/mockData';
import {
  PersonaProfile,
  GeneratedPhoto,
  BrandDeal,
  FanComment,
} from './types/influencer';
import { Check, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [personas, setPersonas] = useState<PersonaProfile[]>(INITIAL_PERSONAS);
  const [currentPersona, setCurrentPersona] = useState<PersonaProfile>(
    INITIAL_PERSONAS[0]
  );
  const [photos, setPhotos] = useState<GeneratedPhoto[]>(INITIAL_PHOTOS);
  const [deals, setDeals] = useState<BrandDeal[]>(INITIAL_BRAND_DEALS);
  const [comments, setComments] = useState<FanComment[]>(INITIAL_COMMENTS);
  const [isMediaKitOpen, setIsMediaKitOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Photo handlers
  const handlePhotoGenerated = (newPhoto: GeneratedPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
    showToast(`"${newPhoto.title}" stüdyoda başarıyla üretildi!`);
  };

  const handlePhotosGenerated = (newPhotos: GeneratedPhoto[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
    showToast(`3 farklı açıdan seri çekim (${newPhotos.length} fotoğraf) başarıyla üretildi!`);
  };

  const handleSendToFeed = (photo: GeneratedPhoto) => {
    setActiveTab('feed');
    showToast(`"${photo.title}" Instagram feed planlayıcıya yerleştirildi.`);
  };

  const handleOpenCaptionGenerator = (photo: GeneratedPhoto) => {
    setActiveTab('feed');
  };

  // Brand Deal Shoot Action
  const handleShootForBrand = (deal: BrandDeal) => {
    setActiveTab('studio');
    showToast(`${deal.brandName} için özel stüdyo parametreleri yüklendi.`);
  };

  // Persona handlers
  const handleUpdatePersona = (updated: PersonaProfile) => {
    setCurrentPersona(updated);
    setPersonas((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`${updated.name} profili ve DNA kilidi güncellendi.`);
  };

  const handleCreateNewPersona = (newPersona: PersonaProfile) => {
    setPersonas((prev) => [...prev, newPersona]);
    setCurrentPersona(newPersona);
    setActiveTab('studio');
    showToast(`Yeni sanal influencer "${newPersona.name}" stüdyoya aktarıldı.`);
  };

  const handleUpdatePhoto = (updatedPhoto: GeneratedPhoto) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0D13] text-[#E2E8F0] flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMediaKit={() => setIsMediaKitOpen(true)}
        onQuickShoot={() => setActiveTab('studio')}
        currentPersonaName={currentPersona.name}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-rose-500/40 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: AI Photo Studio */}
        {activeTab === 'studio' && (
          <PhotoStudio
            currentPersona={currentPersona}
            photos={photos.filter((p) => p.personaId === currentPersona.id || !p.personaId)}
            onPhotoGenerated={handlePhotoGenerated}
            onPhotosGenerated={handlePhotosGenerated}
            onSendToFeed={handleSendToFeed}
            onOpenCaptionGenerator={handleOpenCaptionGenerator}
          />
        )}

        {/* Tab 2: Persona & DNA */}
        {activeTab === 'persona' && (
          <PersonaDNA
            personas={personas}
            currentPersona={currentPersona}
            onSelectPersona={(p) => setCurrentPersona(p)}
            onUpdatePersona={handleUpdatePersona}
            onCreateNewPersona={handleCreateNewPersona}
          />
        )}

        {/* Tab 3: Visual Feed & Post Planner */}
        {activeTab === 'feed' && (
          <FeedPlanner
            currentPersona={currentPersona}
            photos={photos.filter((p) => p.personaId === currentPersona.id || !p.personaId)}
            onUpdatePhoto={handleUpdatePhoto}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {/* Tab 4: Brand Deals & Monetization */}
        {activeTab === 'brands' && (
          <BrandDeals
            deals={deals}
            currentPersona={currentPersona}
            onAddNewDeal={(deal) => {
              setDeals((prev) => [deal, ...prev]);
              showToast(`${deal.brandName} anlaşması kaydedildi.`);
            }}
            onShootForBrand={handleShootForBrand}
          />
        )}

        {/* Tab 5: Community & Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsCommunity
            currentPersona={currentPersona}
            initialComments={comments}
          />
        )}
      </main>

      {/* Influencer Media Kit & Rate Card Modal */}
      <MediaKitModal
        isOpen={isMediaKitOpen}
        onClose={() => setIsMediaKitOpen(false)}
        persona={currentPersona}
      />
    </div>
  );
}
