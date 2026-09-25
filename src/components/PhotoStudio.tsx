import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  Sliders,
  Copy,
  Check,
  Download,
  Share2,
  Calendar,
  Layers,
  Wand2,
  Sun,
  Palette,
  Maximize2,
  Lock,
  RefreshCw,
  Eye,
  Heart,
  Grid,
  Columns3,
} from 'lucide-react';
import {
  PersonaProfile,
  GeneratedPhoto,
  AspectRatioType,
} from '../types/influencer';
import {
  ENVIRONMENTS,
  OUTFITS,
  CAMERAS,
  LIGHTINGS,
  POSES,
} from '../data/mockData';
import { PhotoRenderer } from './PhotoRenderer';
import { AIStyleSelector, StyleConfig } from './AIStyleSelector';
import {
  AESTHETIC_FILTERS,
  CAMERA_LENSES,
  LIGHTING_QUALITIES,
  DAILY_MOODS,
} from '../data/stylePresets';

interface PhotoStudioProps {
  currentPersona: PersonaProfile;
  photos: GeneratedPhoto[];
  onPhotoGenerated: (newPhoto: GeneratedPhoto) => void;
  onPhotosGenerated?: (newPhotos: GeneratedPhoto[]) => void;
  onSendToFeed: (photo: GeneratedPhoto) => void;
  onOpenCaptionGenerator: (photo: GeneratedPhoto) => void;
}

export const PhotoStudio: React.FC<PhotoStudioProps> = ({
  currentPersona,
  photos,
  onPhotoGenerated,
  onPhotosGenerated,
  onSendToFeed,
  onOpenCaptionGenerator,
}) => {
  // Preset selections
  const [selectedEnv, setSelectedEnv] = useState(ENVIRONMENTS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(OUTFITS[0]);
  const [selectedPose, setSelectedPose] = useState(POSES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('3:4');
  const [customDetail, setCustomDetail] = useState('');
  const [includeConsistencyLock, setIncludeConsistencyLock] = useState(true);

  // Triple Angle Consistent Shoot State
  const [lastGeneratedSeries, setLastGeneratedSeries] = useState<GeneratedPhoto[] | null>(null);
  const [selectedSeriesAngleIndex, setSelectedSeriesAngleIndex] = useState<number>(0);
  const [seriesViewMode, setSeriesViewMode] = useState<'triple' | 'single'>('triple');
  const [isComparingSeries, setIsComparingSeries] = useState(false);

  // AI Visual Style & Aesthetic Configuration
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    filter: AESTHETIC_FILTERS[0],
    lens: CAMERA_LENSES[0],
    lighting: LIGHTING_QUALITIES[0],
    mood: DAILY_MOODS[0],
    grainLevel: 'subtle',
    colorTemp: 'warm',
    bokehLevel: 'balanced',
  });

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activePreviewPhoto, setActivePreviewPhoto] = useState<GeneratedPhoto | null>(
    photos[0] || null
  );
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<GeneratedPhoto | null>(null);

  // Dynamic Prompt Construction with AI Visual Style & Aesthetic Modifiers
  const grainPrompt =
    styleConfig.grainLevel === 'vintage'
      ? 'visible heavy analog film grain'
      : styleConfig.grainLevel === 'subtle'
        ? 'subtle gentle organic film grain'
        : 'clean noise-free sensor';

  const tempPrompt =
    styleConfig.colorTemp === 'warm'
      ? 'warm comforting golden amber color palette'
      : styleConfig.colorTemp === 'cool'
        ? 'cool atmospheric overcast tones'
        : 'neutral true-to-life color balance';

  const bokehPrompt =
    styleConfig.bokehLevel === 'deep'
      ? 'shallow depth of field, creamy smooth background bokeh'
      : styleConfig.bokehLevel === 'subtle'
        ? 'crisp environmental deep focus'
        : 'natural aperture depth of field';

  const constructedPrompt = `${includeConsistencyLock ? currentPersona.visualLock + ', ' : ''}${selectedOutfit.prompt}, ${selectedPose.prompt}, ${selectedEnv.prompt}, ${styleConfig.filter.promptModifier}, ${styleConfig.lens.promptModifier}, ${styleConfig.lighting.promptModifier}, ${styleConfig.mood.promptModifier}, ${grainPrompt}, ${tempPrompt}, ${bokehPrompt}${customDetail ? `, ${customDetail}` : ''}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(constructedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep('Karakter DNA ve yüz oranları kilitleniyor...');

    try {
      setTimeout(() => {
        setGenerationStep('Sahne, aydınlatma ve optik lens ayarlanıyor...');
      }, 500);

      let imageUrl = '';
      try {
        const response = await fetch('/api/generate-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: constructedPrompt,
            aspectRatio,
            personaName: currentPersona.name,
            environment: selectedEnv.name,
            outfit: selectedOutfit.name,
            cameraPreset: `${styleConfig.lens.name} (${styleConfig.filter.badge})`,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          imageUrl = data.imageUrl || '';
        }
      } catch (fetchErr) {
        console.warn('Backend endpoint note, utilizing client generative resolver:', fetchErr);
      }

      // Guaranteed fallback image URL if endpoint is unreachable
      if (!imageUrl) {
        const dims = {
          '1:1': { w: 1024, h: 1024 },
          '3:4': { w: 768, h: 1024 },
          '4:3': { w: 1024, h: 768 },
          '9:16': { w: 576, h: 1024 },
          '16:9': { w: 1024, h: 576 },
        }[aspectRatio] || { w: 1024, h: 1024 };

        const seed = Math.floor(Math.random() * 900000) + 100000;
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          `candid authentic everyday photography of real person ${currentPersona.name}, ${constructedPrompt}, unposed, natural genuine smile, realistic skin texture, warm natural daylight, cozy lifestyle snapshot`
        )}?width=${dims.w}&height=${dims.h}&seed=${seed}&nologo=true`;
      }

      const newPhotoId = `photo-${Date.now()}`;
      const newPhoto: GeneratedPhoto = {
        id: newPhotoId,
        personaId: currentPersona.id,
        title: `${selectedEnv.name.split('(')[0]} - ${selectedOutfit.name.split('&')[0]}`,
        url: imageUrl,
        aspectRatio,
        prompt: constructedPrompt,
        environment: selectedEnv.name,
        outfit: selectedOutfit.name,
        cameraPreset: `${styleConfig.lens.name} (${styleConfig.filter.badge})`,
        lighting: `${styleConfig.lighting.name} · ${styleConfig.lighting.temperature}`,
        createdAt: 'Şimdi',
        likes: Math.floor(Math.random() * 380) + 220,
        commentsCount: Math.floor(Math.random() * 28) + 14,
        isFavorite: true,
      };

      onPhotoGenerated(newPhoto);
      setActivePreviewPhoto(newPhoto);
    } catch (error) {
      console.error('Generation process note:', error);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // 3 Farklı Açıdan Sürekli Seri Çekim (Aynı Kadın & Aynı Kıyafet)
  const handleGenerateTripleSeries = async () => {
    setIsGenerating(true);
    setGenerationStep('Karakter DNA ve kıyafet dokusu kilitleniyor...');

    try {
      setTimeout(() => {
        setGenerationStep('Açı 1/3: Geniş Çevre Planı (Wide 24mm) çekiliyor...');
      }, 500);

      setTimeout(() => {
        setGenerationStep('Açı 2/3: Samimi Orta Plan Portre (Medium 50mm) aynı kıyafetle işleniyor...');
      }, 1500);

      setTimeout(() => {
        setGenerationStep('Açı 3/3: Yakın Profil & Sinematik Detay (Close-Up 85mm) tamamlanıyor...');
      }, 2500);

      let seriesPhotos: GeneratedPhoto[] = [];

      try {
        const response = await fetch('/api/generate-photo-series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personaName: currentPersona.name,
            personaId: currentPersona.id,
            visualLock: currentPersona.visualLock,
            environment: selectedEnv.name,
            outfit: selectedOutfit.name,
            cameraPreset: `${styleConfig.lens.name} (${styleConfig.filter.badge})`,
            lighting: `${styleConfig.lighting.name} · ${styleConfig.lighting.temperature}`,
            aspectRatio,
            customDetail,
            basePrompt: constructedPrompt,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            seriesPhotos = data.photos.map((p: any) => ({
              ...p,
              personaId: currentPersona.id,
            }));
          }
        }
      } catch (fetchErr) {
        console.warn('Series API note, using client multi-angle generative fallback:', fetchErr);
      }

      // Client-side fallback if server endpoint is unreachable
      if (!seriesPhotos.length) {
        const dims = {
          '1:1': { w: 1024, h: 1024 },
          '3:4': { w: 768, h: 1024 },
          '4:3': { w: 1024, h: 768 },
          '9:16': { w: 576, h: 1024 },
          '16:9': { w: 1024, h: 576 },
        }[aspectRatio] || { w: 768, h: 1024 };

        const baseSeed = Math.floor(Math.random() * 800000) + 100000;
        const seriesId = `series-${Date.now()}`;

        const configs = [
          {
            type: 'wide' as const,
            label: 'Geniş Çevre Planı (Wide)',
            mod: 'full body environmental wide angle shot, capturing the model walking naturally in the scene with complete outfit from head to toe, atmospheric background scenery, shot on 24mm wide angle lens',
            offset: 0,
          },
          {
            type: 'medium' as const,
            label: 'Samimi Orta Plan (Medium)',
            mod: 'medium shot from waist up, candid three-quarter turn towards the camera with a gentle authentic smile, clear jacket and top outfit texture, genuine eye-contact, shot on 50mm eye-level prime lens',
            offset: 1,
          },
          {
            type: 'closeup' as const,
            label: 'Yakın Profil & Detay (Close-Up)',
            mod: 'cinematic intimate close-up side profile portrait, gazing out thoughtfully at the scenery, gentle breeze catching strands of hair, fine collar and fabric detail, shallow depth of field with creamy bokeh, shot on 85mm portrait telephoto lens',
            offset: 2,
          },
        ];

        seriesPhotos = configs.map((cfg) => {
          const seed = baseSeed + cfg.offset;
          const prompt = `${includeConsistencyLock ? currentPersona.visualLock + ', ' : ''}${selectedOutfit.prompt}, ${selectedEnv.prompt}, ${cfg.mod}, ${styleConfig.filter.promptModifier}, ${styleConfig.lighting.promptModifier}, candid natural everyday lifestyle photography, authentic skin texture, unposed real person${customDetail ? ', ' + customDetail : ''}`;

          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            prompt
          )}?width=${dims.w}&height=${dims.h}&seed=${seed}&nologo=true`;

          return {
            id: `photo-${Date.now()}-${cfg.type}`,
            personaId: currentPersona.id,
            title: `${selectedEnv.name.split('(')[0]} (${cfg.label.split('(')[0].trim()})`,
            url,
            aspectRatio,
            prompt,
            environment: selectedEnv.name,
            outfit: selectedOutfit.name,
            cameraPreset: `${styleConfig.lens.name} (${styleConfig.filter.badge})`,
            lighting: `${styleConfig.lighting.name} · ${styleConfig.lighting.temperature}`,
            createdAt: 'Şimdi',
            likes: Math.floor(Math.random() * 320) + 260,
            commentsCount: Math.floor(Math.random() * 25) + 15,
            isFavorite: true,
            angleType: cfg.type,
            angleLabel: cfg.label,
            seriesId,
          };
        });
      }

      if (onPhotosGenerated) {
        onPhotosGenerated(seriesPhotos);
      } else {
        seriesPhotos.forEach((p) => onPhotoGenerated(p));
      }

      setLastGeneratedSeries(seriesPhotos);
      setSelectedSeriesAngleIndex(0);
      setActivePreviewPhoto(seriesPhotos[0]);
      setSeriesViewMode('triple');
    } catch (error) {
      console.error('Series generation error:', error);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDownloadAllSeries = async () => {
    if (!lastGeneratedSeries) return;
    for (const photo of lastGeneratedSeries) {
      await downloadImageAsPng(photo);
      await new Promise((r) => setTimeout(r, 450));
    }
  };

  const handleSendEntireSeriesToFeed = () => {
    if (!lastGeneratedSeries || lastGeneratedSeries.length === 0) return;
    lastGeneratedSeries.forEach((photo) => onSendToFeed(photo));
  };

  const downloadImageAsPng = async (photo: GeneratedPhoto) => {
    if (photo.url) {
      try {
        const response = await fetch(photo.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${currentPersona.name.toLowerCase().replace(/\s+/g, '_')}_${photo.id}.png`;
        link.href = blobUrl;
        link.click();
        URL.revokeObjectURL(blobUrl);
        return;
      } catch (err) {
        // Direct link download fallback
        const link = document.createElement('a');
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.download = `${currentPersona.name.toLowerCase().replace(/\s+/g, '_')}_${photo.id}.png`;
        link.href = photo.url;
        link.click();
        return;
      }
    }

    // High quality canvas export
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = aspectRatio === '1:1' ? 1200 : aspectRatio === '9:16' ? 2133 : 1600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1E1B24');
      grad.addColorStop(0.5, '#13131A');
      grad.addColorStop(1, '#0B0D13');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial light
      const rad = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.3,
        50,
        canvas.width * 0.7,
        canvas.height * 0.3,
        canvas.width * 0.8
      );
      rad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
      rad.addColorStop(1, 'transparent');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Watermark & title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(currentPersona.name.toUpperCase(), 70, 110);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '24px monospace';
      ctx.fillText(`${photo.environment} · ${photo.cameraPreset}`, 70, 160);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '32px sans-serif';
      ctx.fillText(photo.title, 70, canvas.height - 120);

      ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
      ctx.font = '22px monospace';
      ctx.fillText(currentPersona.handle, 70, canvas.height - 70);

      const link = document.createElement('a');
      link.download = `${currentPersona.name.toLowerCase().replace(/\s+/g, '_')}_${photo.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header Bar & Persona Lock Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-neutral-900/60 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 p-0.5 shrink-0 overflow-hidden">
            {currentPersona.avatarUrl ? (
              <img
                src={currentPersona.avatarUrl}
                alt={currentPersona.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-display font-bold text-white text-base">
                {currentPersona.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">
                {currentPersona.name}
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {currentPersona.handle}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span>{currentPersona.niche}</span>
              <span>·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3 inline" /> Yüz DNA Kilidi Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Quick Consistency Toggle */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none bg-neutral-950 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
            <input
              type="checkbox"
              checked={includeConsistencyLock}
              onChange={(e) => setIncludeConsistencyLock(e.target.checked)}
              className="accent-rose-500 rounded"
            />
            <span className="font-medium">Karakter Tutarlılık Kilidi</span>
          </label>
        </div>
      </div>

      {/* Main Studio Workspace: 2 Column Layout (Left: Controls, Right: Live Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scene & Aesthetic Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Environment / Mekan Seçimi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                01. Çekim Mekanı & Arka Plan
              </label>
              <span className="text-[11px] text-neutral-500">
                {selectedEnv.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ENVIRONMENTS.map((env) => {
                const isSelected = selectedEnv.id === env.id;
                return (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => setSelectedEnv(env)}
                    className={`p-3 text-left rounded-lg text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/80 text-white shadow-sm'
                        : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <span className="line-clamp-2">{env.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Outfit / Kombin & Stil */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                02. Kıyafet & Kombin
              </label>
              <span className="text-[11px] text-neutral-500">
                {selectedOutfit.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {OUTFITS.map((outfit) => {
                const isSelected = selectedOutfit.id === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => setSelectedOutfit(outfit)}
                    className={`p-3 text-left rounded-lg text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/80 text-white'
                        : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <span className="line-clamp-2">{outfit.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pose & Duruş */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                03. Model Duruşu & Açı
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POSES.map((pose) => {
                const isSelected = selectedPose.id === pose.id;
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => setSelectedPose(pose)}
                    className={`p-2.5 text-left rounded-lg text-xs font-medium transition-all border truncate ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/80 text-white'
                        : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    {pose.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. AI Görsel Stil & Estetik Seçici (Lenses, Lighting, Aesthetic Filters & Mood) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>04. AI Görsel Stil & Estetik Kılavuzu</span>
              <span className="text-[11px] text-neutral-500 font-mono">
                {styleConfig.lens.focalLength} · {styleConfig.filter.badge}
              </span>
            </label>
            <AIStyleSelector
              currentConfig={styleConfig}
              onChangeConfig={setStyleConfig}
              environmentName={selectedEnv.name}
              outfitName={selectedOutfit.name}
              personaName={currentPersona.name}
            />
          </div>

          {/* 5. Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              05. Kadraj Oranı
            </label>
            <div className="flex items-center gap-2">
              {(
                [
                  { id: '1:1', label: '1:1 (Kare Post)' },
                  { id: '3:4', label: '3:4 (Dikey Portre)' },
                  { id: '4:3', label: '4:3 (Yatay Klasik)' },
                  { id: '9:16', label: '9:16 (Story / Reel)' },
                  { id: '16:9', label: '16:9 (Sinematik)' },
                ] as const
              ).map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    aspectRatio === ratio.id
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Custom Detail Add-on */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Özel Detay veya Marka İsteği (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Elinde gümüş espresso fincanı tutuyor, arka planda hafif yağmur damlaları..."
              value={customDetail}
              onChange={(e) => setCustomDetail(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* 7. Live Prompt Preview */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-mono flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Oluşturulan Yapay Zeka Promptu</span>
              </span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-neutral-300 leading-relaxed max-h-24 overflow-y-auto pr-1">
              {constructedPrompt}
            </p>
          </div>

          {/* Shoot Actions: Multi-Angle Consistent Shoot vs Single Shot */}
          <div className="space-y-3 pt-1">
            {/* Primary Action: 3 Angles with Same Woman & Same Outfit */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateTripleSeries}
              className={`w-full p-4 rounded-2xl font-display text-left transition-all shadow-xl relative overflow-hidden group ${
                isGenerating
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white border border-rose-400/30 hover:shadow-rose-500/25 active:scale-[0.99]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        3 Farklı Açıdan Çek
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-mono text-white uppercase font-bold tracking-wider">
                        Aynı Kadın & Aynı Kıyafet
                      </span>
                    </div>
                    <p className="text-[11px] text-white/90 mt-0.5">
                      Karakter, yüz oranları ve kıyafet kilitlenir; 1 geniş çevre, 1 samimi orta plan ve 1 yakın profil açı üretir.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 shrink-0 font-mono text-xs bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
                  <span>3 Kare</span>
                  <span>→</span>
                </div>
              </div>

              {/* Angle Sequence Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-white/20 text-[10px] font-mono text-white/90">
                <span className="px-2 py-0.5 rounded bg-black/30 font-semibold">1. Geniş Çevre (Wide 24mm)</span>
                <span className="text-white/40">·</span>
                <span className="px-2 py-0.5 rounded bg-black/30 font-semibold">2. Samimi Orta Plan (Medium 50mm)</span>
                <span className="text-white/40">·</span>
                <span className="px-2 py-0.5 rounded bg-black/30 font-semibold">3. Yakın Profil & Detay (Close-Up 85mm)</span>
              </div>
            </button>

            {/* Secondary Action: Single Standalone Shot */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-neutral-900 border-white/5 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-white/10 hover:border-white/20 text-neutral-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-neutral-400" />
              <span>Tekil Standart Kare Çek (Seçili Poz)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Viewport & Photo Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white font-display">
                {lastGeneratedSeries && lastGeneratedSeries.length > 0
                  ? "Stüdyo Önizlemesi · 3'lü Açı Serisi"
                  : "Stüdyo Önizlemesi & Son Çekim"}
              </h3>
              {lastGeneratedSeries && lastGeneratedSeries.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  3 Açı Senkronize
                </span>
              ) : activePreviewPhoto?.angleLabel ? (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                  {activePreviewPhoto.angleLabel}
                </span>
              ) : null}
            </div>

            {lastGeneratedSeries && lastGeneratedSeries.length > 0 ? (
              <div className="flex items-center gap-1 p-0.5 bg-neutral-900 border border-white/10 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSeriesViewMode('triple')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                    seriesViewMode === 'triple'
                      ? 'bg-rose-500 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="3 Açıyı Yan Yana Gör (Triptych)"
                >
                  <Columns3 className="w-3 h-3" />
                  <span>3 Açıyı Yan Yana Gör</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeriesViewMode('single')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                    seriesViewMode === 'single'
                      ? 'bg-rose-500 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Tekil Açı Büyüteç Modu"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Tekil Büyüteç</span>
                </button>
              </div>
            ) : activePreviewPhoto ? (
              <span className="text-xs font-mono text-neutral-400">
                {activePreviewPhoto.aspectRatio} · {activePreviewPhoto.createdAt}
              </span>
            ) : null}
          </div>

          {/* Main Visual Display Area (Dual Mode: Triple Triptych or Single Enlarged) */}
          <div className="relative">
            {/* Generating Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 rounded-2xl bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30 min-h-[380px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
                  <Camera className="w-7 h-7 text-rose-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <p className="text-sm font-semibold text-white font-display">
                    3 Farklı Açıdan Sürekli Seri Çekim
                  </p>
                  <p className="text-xs font-mono text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                    {generationStep}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Karakter yüz oranları, ten dokusu ve kombini bozulmadan senkronize üretiliyor
                  </p>
                </div>
              </div>
            )}

            {/* View Mode 1: 3 Açıyı Yan Yana Gör (Triptych Synchronized Grid) */}
            {seriesViewMode === 'triple' && lastGeneratedSeries && lastGeneratedSeries.length > 0 ? (
              <div className="space-y-3">
                {/* Series Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-rose-950/40 border border-rose-500/30 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {currentPersona.name} · {selectedEnv.name.split('(')[0]}
                      </p>
                      <p className="text-[10px] text-rose-200/80">
                        Aynı kadın & aynı kıyafet (Geniş 24mm · Orta 50mm · Yakın 85mm)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsComparingSeries(true)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-rose-300 text-[11px] font-mono border border-white/10 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>3 Açıyı Karşılaştır</span>
                  </button>
                </div>

                {/* The 3 Synchronized Angle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {lastGeneratedSeries.map((sPhoto, sIdx) => {
                    const angleInfo =
                      sPhoto.angleType === 'wide'
                        ? {
                            label: '1. Açı: Geniş Plan',
                            badge: '24mm Wide',
                            color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                            desc: 'Boydan Çevre & Mekan',
                          }
                        : sPhoto.angleType === 'medium'
                        ? {
                            label: '2. Açı: Samimi Orta',
                            badge: '50mm Prime',
                            color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                            desc: 'Bel/Göğüs & Kombin Dokusu',
                          }
                        : {
                            label: '3. Açı: Yakın Profil',
                            badge: '85mm Portrait',
                            color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                            desc: 'Yüz, Saç & Kremamsı Bokeh',
                          };

                    return (
                      <div
                        key={sPhoto.id || sIdx}
                        className="group rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-rose-500/50 transition-all flex flex-col shadow-lg"
                      >
                        {/* Card Header with Angle Badge */}
                        <div className="p-2 bg-neutral-950 border-b border-white/10 flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${angleInfo.color}`}>
                            {angleInfo.label}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-400">
                            {angleInfo.badge}
                          </span>
                        </div>

                        {/* Card Image */}
                        <div
                          className="relative aspect-[3/4] bg-neutral-950 overflow-hidden cursor-pointer"
                          onClick={() => {
                            setActivePreviewPhoto(sPhoto);
                            setSelectedSeriesAngleIndex(sIdx);
                            setSeriesViewMode('single');
                          }}
                        >
                          {sPhoto.url ? (
                            <img
                              src={sPhoto.url}
                              alt={sPhoto.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
                              Yükleniyor...
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePreviewPhoto(sPhoto);
                                setSelectedSeriesAngleIndex(sIdx);
                                setSeriesViewMode('single');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-white text-xs font-medium flex items-center gap-1 shadow backdrop-blur-sm transition-colors"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Büyüt</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImageAsPng(sPhoto);
                              }}
                              className="p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-white text-xs shadow backdrop-blur-sm transition-colors"
                              title="PNG İndir"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-2 bg-neutral-950 text-left border-t border-white/5 space-y-0.5">
                          <p className="text-[10px] font-medium text-white truncate">
                            {angleInfo.desc}
                          </p>
                          <div className="flex items-center justify-between text-[9px] text-neutral-400">
                            <span className="truncate max-w-[100px]">{sPhoto.outfit.split('&')[0]}</span>
                            <button
                              type="button"
                              onClick={() => downloadImageAsPng(sPhoto)}
                              className="hover:text-rose-400 flex items-center gap-0.5 font-mono"
                            >
                              <Download className="w-2.5 h-2.5" />
                              İndir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bulk Actions Bar */}
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 shadow-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendEntireSeriesToFeed}
                      className="py-2 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Grid className="w-3.5 h-3.5 text-indigo-400" />
                      <span>3 Açıyı Feed'e Gönder (Carousel)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadAllSeries}
                      className="py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors border border-white/10"
                    >
                      <Download className="w-3.5 h-3.5 text-rose-400" />
                      <span>Tümünü İndir (3x PNG)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsComparingSeries(true)}
                    className="py-2 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-rose-500/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tam Ekran 3'lü Görünüm</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode 2: Tekil Büyük Açı Görünümü */
              <div className="space-y-3">
                {/* If a series exists, show angle switcher strip on top */}
                {lastGeneratedSeries && lastGeneratedSeries.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900/90 rounded-xl border border-white/10">
                    {lastGeneratedSeries.map((sPhoto, sIdx) => {
                      const isCurrent = activePreviewPhoto?.id === sPhoto.id;
                      const label =
                        sPhoto.angleType === 'wide'
                          ? '1. Geniş (24mm)'
                          : sPhoto.angleType === 'medium'
                          ? '2. Orta (50mm)'
                          : '3. Yakın (85mm)';

                      return (
                        <button
                          key={sPhoto.id || sIdx}
                          type="button"
                          onClick={() => {
                            setSelectedSeriesAngleIndex(sIdx);
                            setActivePreviewPhoto(sPhoto);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                            isCurrent
                              ? 'bg-rose-500 text-white font-bold shadow'
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Large Preview Canvas */}
                {activePreviewPhoto ? (
                  <PhotoRenderer
                    url={activePreviewPhoto.url}
                    title={activePreviewPhoto.title}
                    personaName={currentPersona.name}
                    environment={activePreviewPhoto.environment}
                    outfit={activePreviewPhoto.outfit}
                    cameraPreset={activePreviewPhoto.cameraPreset}
                    lighting={activePreviewPhoto.lighting}
                    aspectRatio={activePreviewPhoto.aspectRatio}
                    className="w-full shadow-2xl"
                    onExpand={() => setSelectedGalleryPhoto(activePreviewPhoto)}
                  />
                ) : (
                  <div className="aspect-[3/4] w-full rounded-xl bg-neutral-900 border border-dashed border-white/15 flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                    <Camera className="w-10 h-10 mb-3 stroke-1 text-neutral-600" />
                    <p className="text-xs font-medium text-neutral-400">
                      Henüz fotoğraf üretilmedi
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                      Soldaki panelden mekan ve kombin seçerek ilk stüdyo çekimini başlatın.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Toolbar for Active Photo */}
          {activePreviewPhoto && (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => downloadImageAsPng(activePreviewPhoto)}
                className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
                title="Yüksek Çözünürlük PNG İndir"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>İndir (PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => onSendToFeed(activePreviewPhoto)}
                className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
                title="Instagram Feed Sırasına Ekle"
              >
                <Grid className="w-3.5 h-3.5 text-indigo-400" />
                <span>Feed'e Ekle</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCaptionGenerator(activePreviewPhoto)}
                className="py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
                title="Yapay Zeka Açıklama & Hashtag Üret"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Açıklama Yaz</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Persona Photo Gallery & History */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              {currentPersona.name} Fotoğraf Galerisi ({photos.length})
            </h3>
            <p className="text-xs text-neutral-400">
              Bu influencer için üretilen tüm geçmiş çekimler ve stüdyo kayıtları
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo) => {
            const isSelected = activePreviewPhoto?.id === photo.id;
            return (
              <div
                key={photo.id}
                onClick={() => {
                  setActivePreviewPhoto(photo);
                  if (photo.seriesId) {
                    const matching = photos.filter((p) => p.seriesId === photo.seriesId);
                    if (matching.length > 0) {
                      const order: Record<string, number> = { wide: 0, medium: 1, closeup: 2, standard: 3 };
                      const sorted = [...matching].sort(
                        (a, b) =>
                          (order[a.angleType || 'wide'] || 0) -
                          (order[b.angleType || 'wide'] || 0)
                      );
                      setLastGeneratedSeries(sorted);
                      const matchingIdx = sorted.findIndex((p) => p.id === photo.id);
                      setSelectedSeriesAngleIndex(matchingIdx >= 0 ? matchingIdx : 0);
                      setSeriesViewMode('triple');
                    }
                  }
                }}
                className={`cursor-pointer rounded-xl overflow-hidden transition-all group relative ${
                  isSelected ? 'ring-2 ring-rose-500 scale-[1.02]' : 'opacity-85 hover:opacity-100'
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
                {photo.angleLabel && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-rose-300 border border-rose-500/30 backdrop-blur-sm shadow z-10">
                    {photo.angleType === 'wide' ? 'Geniş' : photo.angleType === 'medium' ? 'Orta' : 'Yakın'}
                  </span>
                )}
                <div className="p-1.5 bg-neutral-950 text-left">
                  <p className="text-[11px] font-medium text-white truncate">
                    {photo.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {photo.createdAt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedGalleryPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryPhoto(null)}
        >
          <div
            className="max-w-2xl w-full bg-neutral-900 rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {selectedGalleryPhoto.title}
                </h4>
                <p className="text-xs text-neutral-400 font-mono">
                  {selectedGalleryPhoto.cameraPreset} · {selectedGalleryPhoto.lighting}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryPhoto(null)}
                className="text-neutral-400 hover:text-white text-xs px-2.5 py-1 rounded bg-neutral-800"
              >
                Kapat
              </button>
            </div>

            <div className="p-4 max-h-[70vh] flex items-center justify-center">
              <PhotoRenderer
                url={selectedGalleryPhoto.url}
                title={selectedGalleryPhoto.title}
                personaName={currentPersona.name}
                environment={selectedGalleryPhoto.environment}
                outfit={selectedGalleryPhoto.outfit}
                cameraPreset={selectedGalleryPhoto.cameraPreset}
                lighting={selectedGalleryPhoto.lighting}
                aspectRatio={selectedGalleryPhoto.aspectRatio}
                className="w-full max-h-[60vh] object-contain"
                showMetaOverlay={false}
              />
            </div>

            <div className="p-4 bg-neutral-950 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-neutral-400 font-mono">
                {selectedGalleryPhoto.environment}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadImageAsPng(selectedGalleryPhoto)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>İndir</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSendToFeed(selectedGalleryPhoto);
                    setSelectedGalleryPhoto(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs text-white font-medium"
                >
                  Feed'e Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Angle Fullscreen Side-by-Side Comparison Modal */}
      {isComparingSeries && lastGeneratedSeries && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-y-auto"
          onClick={() => setIsComparingSeries(false)}
        >
          <div
            className="max-w-6xl w-full mx-auto bg-neutral-900 border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    3 Açılı Senkronize Seri Çekim Karşılaştırması
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {currentPersona.name} · {selectedEnv.name.split('(')[0]} · {selectedOutfit.name.split('&')[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllSeries}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>3 Açıyı İndir (3x PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsComparingSeries(false)}
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 3 Full Images Side-by-Side */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-950">
              {lastGeneratedSeries.map((photo, idx) => (
                <div key={photo.id || idx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-rose-300">
                      {idx === 0
                        ? '1. Geniş Çevre Planı (24mm)'
                        : idx === 1
                        ? '2. Samimi Orta Plan (50mm)'
                        : '3. Yakın Profil (85mm)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadImageAsPng(photo)}
                      className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                    >
                      <Download className="w-3 h-3 text-rose-400" />
                      PNG
                    </button>
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg">
                    {photo.url && (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 px-1 truncate">
                    {photo.cameraPreset} · {photo.lighting}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div className="p-3 bg-neutral-900 border-t border-white/10 text-center text-xs text-neutral-400">
              ✨ Yüz oranları, saç yapısı ve kıyafet kumaş dokusu 3 farklı kamera açısından kilitlenmiştir.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
