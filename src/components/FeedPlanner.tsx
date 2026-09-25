import React, { useState } from 'react';
import {
  Grid,
  Heart,
  MessageCircle,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Send,
  Wand2,
  Clock,
  Trash2,
  Tag,
  Share2,
  Plus,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { PersonaProfile, GeneratedPhoto } from '../types/influencer';
import { PhotoRenderer } from './PhotoRenderer';
import { WeeklyCalendarView } from './WeeklyCalendarView';

interface FeedPlannerProps {
  currentPersona: PersonaProfile;
  photos: GeneratedPhoto[];
  onUpdatePhoto: (updated: GeneratedPhoto) => void;
  onNavigateToStudio: () => void;
}

export const FeedPlanner: React.FC<FeedPlannerProps> = ({
  currentPersona,
  photos,
  onUpdatePhoto,
  onNavigateToStudio,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<GeneratedPhoto | null>(
    photos[0] || null
  );

  // AI Caption state
  const [captionTone, setCaptionTone] = useState('Samimi & Günlük Hayat');
  const [captionContext, setCaptionContext] = useState('');
  const [sponsorBrand, setSponsorBrand] = useState('');
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [generatedCaptionResult, setGeneratedCaptionResult] = useState<{
    caption: string;
    hook: string;
    cta: string;
    hashtags: string[];
  } | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const handleGenerateCaption = async () => {
    if (!selectedPhoto) return;
    setIsGeneratingCaption(true);

    try {
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: currentPersona.name,
          niche: currentPersona.niche,
          tone: captionTone,
          context:
            captionContext ||
            `${selectedPhoto.title}, ${selectedPhoto.environment} mekanında çekildi, kombini: ${selectedPhoto.outfit}`,
          language,
          sponsorBrand,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setGeneratedCaptionResult(data.result);
        // Automatically attach to current photo
        const updated: GeneratedPhoto = {
          ...selectedPhoto,
          caption: data.result.caption,
          hashtags: data.result.hashtags,
          brandTag: sponsorBrand || selectedPhoto.brandTag,
        };
        onUpdatePhoto(updated);
        setSelectedPhoto(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleCopyCaption = () => {
    if (!selectedPhoto?.caption) return;
    const fullText = `${selectedPhoto.caption}\n\n${(selectedPhoto.hashtags || []).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const renderPostInspector = () => {
    if (!selectedPhoto) {
      return (
        <div className="p-12 text-center text-neutral-500 bg-neutral-900/40 rounded-2xl border border-white/10">
          <Grid className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
          <p className="text-xs">
            Açıklama düzenlemek veya yayın planlamak için feed veya takvimden bir fotoğraf seçin.
          </p>
        </div>
      );
    }

    const seriesSiblings = selectedPhoto.seriesId
      ? photos.filter((p) => p.seriesId === selectedPhoto.seriesId)
      : [];
    const sortedSeries = [...seriesSiblings].sort((a, b) => {
      const order: Record<string, number> = { wide: 0, medium: 1, closeup: 2, standard: 3 };
      return (order[a.angleType || 'wide'] || 0) - (order[b.angleType || 'wide'] || 0);
    });

    return (
      <div className="p-6 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-white/10">
              {selectedPhoto.url ? (
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                  Fotoğraf
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs text-neutral-400">
                {selectedPhoto.environment.split('(')[0]} · {selectedPhoto.outfit.split('&')[0]}
              </p>
            </div>
          </div>

          {selectedPhoto.brandTag && (
            <span className="px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-medium">
              Marka: #{selectedPhoto.brandTag}
            </span>
          )}
        </div>

        {/* Instagram Carousel (3 Angles Series) Slide Navigator */}
        {sortedSeries.length > 1 && (
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-rose-500/30 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span>Instagram Kaydırmalı Seri (Carousel Post · {sortedSeries.length} Açı)</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                Aktif: {selectedPhoto.angleLabel || 'Açı'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sortedSeries.map((sPhoto, sIdx) => {
                const isCurrentSlide = selectedPhoto.id === sPhoto.id;
                return (
                  <button
                    key={sPhoto.id}
                    type="button"
                    onClick={() => setSelectedPhoto(sPhoto)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                      isCurrentSlide
                        ? 'bg-rose-500/20 border-rose-500 ring-1 ring-rose-500/40 text-white'
                        : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <div className="w-9 h-11 rounded overflow-hidden bg-black shrink-0 border border-white/10">
                      {sPhoto.url && (
                        <img
                          src={sPhoto.url}
                          alt={sPhoto.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="truncate min-w-0">
                      <p className="text-[11px] font-bold truncate text-white">
                        {sIdx + 1}. Slayt
                      </p>
                      <p className="text-[9px] font-mono truncate text-rose-300">
                        {sPhoto.angleType === 'wide' ? 'Geniş (24mm)' : sPhoto.angleType === 'medium' ? 'Orta (50mm)' : 'Yakın (85mm)'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Caption Generator Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Yapay Zeka Açıklama & Hashtag Sihirbazı</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Ses Tonu</label>
              <select
                value={captionTone}
                onChange={(e) => setCaptionTone(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Samimi & Günlük Hayat">Samimi & Günlük Hayat (Arkadaşça)</option>
                <option value="Mütevazı & Düşünceli">Mütevazı & Düşünceli (Kahve/Kitap)</option>
                <option value="Hafif Esprili & Doğal">Hafif Esprili & Spontane</option>
                <option value="Sakin & Dingin">Sakin & Dingin (Hafta Sonu)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">Dil</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
                className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="tr">Türkçe (Doğal Günlük Dil)</option>
                <option value="en">English (Casual Friendly Tone)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">
              Özel İçerik Bağlamı veya Soru (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Yağmurlu pazar kahvesi, kedim Şila kucağımda uyurken..."
              value={captionContext}
              onChange={(e) => setCaptionContext(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">
              Sponsor / Butik İşbirliği (#işbirliği)
            </label>
            <input
              type="text"
              placeholder="Örn: Köz Kahve, Mahalle Seramikçisi, Bez Çanta..."
              value={sponsorBrand}
              onChange={(e) => setSponsorBrand(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500"
            />
          </div>

          <button
            type="button"
            disabled={isGeneratingCaption}
            onClick={handleGenerateCaption}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isGeneratingCaption ? (
              <span>Gemini ile Açıklama Yazılıyor...</span>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Karakterin Dilinde Açıklama Üret</span>
              </>
            )}
          </button>
        </div>

        {/* Current Caption & Editor */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-300">
              Gönderi Metni & Hashtagler
            </label>
            {selectedPhoto.caption && (
              <button
                type="button"
                onClick={handleCopyCaption}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedCaption ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Panoya Kopyala</span>
                  </>
                )}
              </button>
            )}
          </div>

          <textarea
            rows={4}
            value={selectedPhoto.caption || ''}
            onChange={(e) => {
              const updated = { ...selectedPhoto, caption: e.target.value };
              onUpdatePhoto(updated);
              setSelectedPhoto(updated);
            }}
            placeholder="Henüz açıklama eklenmedi. Yukarıdaki sihirbazı kullanarak saniyeler içinde yazdırabilirsiniz."
            className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-rose-500 leading-relaxed"
          />

          {/* Hashtag Cloud */}
          {selectedPhoto.hashtags && selectedPhoto.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPhoto.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Post Timing */}
        <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Yayın Planı & Zamanlaması:</span>
            <input
              type="text"
              placeholder="Örn: 2026-09-25 11:30"
              value={selectedPhoto.scheduledDate || ''}
              onChange={(e) => {
                const updated = {
                  ...selectedPhoto,
                  scheduledDate: e.target.value,
                };
                onUpdatePhoto(updated);
                setSelectedPhoto(updated);
              }}
              className="bg-neutral-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
            />
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Haftalık Takvimle Senkron
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Görsel Feed Planlayıcı & İçerik Takvimi
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Çekilen fotoğrafların profil ızgarasında ve haftalık yayın akışında nasıl duracağını planlayın.
          </p>
        </div>

        {/* View Mode Switcher & Add Shoot Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-rose-500 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>9-Grid Önizleme</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-rose-500 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Haftalık İçerik Takvimi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToStudio}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Stüdyodan Yeni Çekim Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'calendar' ? (
        <div className="space-y-8">
          <WeeklyCalendarView
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSelectPhoto={setSelectedPhoto}
            onUpdatePhoto={onUpdatePhoto}
            onNavigateToStudio={onNavigateToStudio}
            personaName={currentPersona.name}
          />

          {/* Active Post Caption Editor & Timing Inspector */}
          {selectedPhoto && (
            <div className="max-w-4xl mx-auto w-full pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Takvimden Seçili Gönderi Düzenleyicisi
                </h3>
              </div>
              {renderPostInspector()}
            </div>
          )}
        </div>
      ) : (
        /* 2-Column Layout: Left = Simulated Social Feed, Right = Post & Caption Engine */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Instagram Simulation Phone Frame (6 cols) */}
          <div className="lg:col-span-6 bg-neutral-950 border border-white/15 rounded-3xl p-5 shadow-2xl space-y-5 max-w-md mx-auto w-full">
            {/* Top Profile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white font-display tracking-tight">
                  {currentPersona.handle}
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 text-xs">
                <span className="font-mono text-[11px]">9-Grid Canlı</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shrink-0 overflow-hidden">
                {currentPersona.avatarUrl ? (
                  <img
                    src={currentPersona.avatarUrl}
                    alt={currentPersona.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-display font-bold text-lg text-white">
                    {currentPersona.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 grid grid-cols-3 text-center self-center">
                <div>
                  <span className="block text-sm font-bold text-white font-mono">
                    {photos.length}
                  </span>
                  <span className="text-[10px] text-neutral-400">gönderi</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-white font-mono">
                    {currentPersona.stats.followers}
                  </span>
                  <span className="text-[10px] text-neutral-400">takipçi</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-white font-mono">
                    482
                  </span>
                  <span className="text-[10px] text-neutral-400">takip</span>
                </div>
              </div>
            </div>

            {/* Bio text */}
            <div className="text-xs text-neutral-300 space-y-1">
              <p className="font-bold text-white">{currentPersona.name}</p>
              <p className="text-[11px] text-neutral-400">{currentPersona.niche}</p>
              <p className="whitespace-pre-line text-[11px] text-neutral-300 leading-relaxed">
                {currentPersona.bio}
              </p>
            </div>

            {/* Highlights Circles */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 border-b border-white/10">
              {currentPersona.highlights.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center text-xs text-neutral-300">
                    {h.title.slice(0, 3)}
                  </div>
                  <span className="text-[10px] text-neutral-400">{h.title}</span>
                </div>
              ))}
            </div>

            {/* The 9-Grid Photo Grid */}
            <div className="grid grid-cols-3 gap-1 bg-black p-0.5 rounded-xl overflow-hidden">
              {photos.map((photo) => {
                const isCurrent = selectedPhoto?.id === photo.id;
                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`aspect-square relative cursor-pointer group overflow-hidden bg-neutral-900 ${
                      isCurrent ? 'ring-2 ring-rose-500 z-10' : ''
                    }`}
                  >
                    <PhotoRenderer
                      url={photo.url}
                      title={photo.title}
                      personaName={currentPersona.name}
                      environment={photo.environment}
                      outfit={photo.outfit}
                      cameraPreset={photo.cameraPreset}
                      lighting={photo.lighting}
                      aspectRatio="1:1"
                      showMetaOverlay={false}
                    />

                    {/* Likes / Comments hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        {photo.likes >= 1000 ? `${(photo.likes / 1000).toFixed(1)}k` : photo.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        {photo.commentsCount}
                      </span>
                    </div>

                    {photo.seriesId && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono text-white flex items-center gap-1 border border-white/20 shadow">
                        <Layers className="w-2.5 h-2.5 text-rose-400" />
                        <span>{photo.angleType === 'wide' ? '1/3' : photo.angleType === 'medium' ? '2/3' : '3/3'}</span>
                      </div>
                    )}

                    {photo.scheduledDate && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Post Inspector & AI Caption Generator (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {renderPostInspector()}
          </div>
        </div>
      )}
    </div>
  );
};
