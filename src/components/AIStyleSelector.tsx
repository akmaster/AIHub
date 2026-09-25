import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Camera,
  Sun,
  Flame,
  Palette,
  Film,
  Aperture,
  Check,
  Wand2,
  Coffee,
  Footprints,
  Laptop,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AestheticFilter,
  CameraLensPreset,
  LightingQualityPreset,
  DailyMoodPreset,
  AESTHETIC_FILTERS,
  CAMERA_LENSES,
  LIGHTING_QUALITIES,
  DAILY_MOODS,
} from '../data/stylePresets';

export interface StyleConfig {
  filter: AestheticFilter;
  lens: CameraLensPreset;
  lighting: LightingQualityPreset;
  mood: DailyMoodPreset;
  grainLevel: 'none' | 'subtle' | 'vintage';
  colorTemp: 'cool' | 'neutral' | 'warm';
  bokehLevel: 'subtle' | 'balanced' | 'deep';
}

interface AIStyleSelectorProps {
  currentConfig: StyleConfig;
  onChangeConfig: (newConfig: StyleConfig) => void;
  environmentName: string;
  outfitName: string;
  personaName: string;
}

export const AIStyleSelector: React.FC<AIStyleSelectorProps> = ({
  currentConfig,
  onChangeConfig,
  environmentName,
  outfitName,
  personaName,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'filter' | 'lens' | 'lighting' | 'finetune'>('filter');
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [autoMatchMessage, setAutoMatchMessage] = useState<string | null>(null);

  // Smart AI Auto Matcher based on active scene context
  const handleSmartAutoMatch = () => {
    setIsAiMatching(true);
    setAutoMatchMessage('Mekan ve kıyafet analizi yapılıyor...');

    setTimeout(() => {
      let recommendedFilter = AESTHETIC_FILTERS[0];
      let recommendedLens = CAMERA_LENSES[0];
      let recommendedLighting = LIGHTING_QUALITIES[0];
      let recommendedMood = DAILY_MOODS[0];

      const envLower = environmentName.toLowerCase();
      const outfitLower = outfitName.toLowerCase();

      if (envLower.includes('kahve') || envLower.includes('cafe')) {
        recommendedFilter = AESTHETIC_FILTERS.find((f) => f.id === 'analog-35mm') || AESTHETIC_FILTERS[0];
        recommendedLens = CAMERA_LENSES.find((l) => l.id === 'lens-35mm') || CAMERA_LENSES[0];
        recommendedLighting = LIGHTING_QUALITIES.find((l) => l.id === 'light-cafe-tungsten') || LIGHTING_QUALITIES[0];
        recommendedMood = DAILY_MOODS.find((m) => m.id === 'mood-coffee') || DAILY_MOODS[0];
      } else if (envLower.includes('yağmur') || envLower.includes('sokak')) {
        recommendedFilter = AESTHETIC_FILTERS.find((f) => f.id === 'rainy-mood') || AESTHETIC_FILTERS[4];
        recommendedLens = CAMERA_LENSES.find((l) => l.id === 'lens-35mm') || CAMERA_LENSES[0];
        recommendedLighting = LIGHTING_QUALITIES.find((l) => l.id === 'light-cloudy-diffuse') || LIGHTING_QUALITIES[2];
        recommendedMood = DAILY_MOODS.find((m) => m.id === 'mood-walk') || DAILY_MOODS[1];
      } else if (envLower.includes('ev') || envLower.includes('masa') || envLower.includes('mutfak')) {
        recommendedFilter = AESTHETIC_FILTERS.find((f) => f.id === 'nordic-cozy') || AESTHETIC_FILTERS[3];
        recommendedLens = CAMERA_LENSES.find((l) => l.id === 'lens-50mm') || CAMERA_LENSES[1];
        recommendedLighting = LIGHTING_QUALITIES.find((l) => l.id === 'light-window') || LIGHTING_QUALITIES[0];
        recommendedMood = DAILY_MOODS.find((m) => m.id === 'mood-work-design') || DAILY_MOODS[3];
      } else if (envLower.includes('sahil') || envLower.includes('gün batımı') || envLower.includes('vapur')) {
        recommendedFilter = AESTHETIC_FILTERS.find((f) => f.id === 'golden-hour') || AESTHETIC_FILTERS[5];
        recommendedLens = CAMERA_LENSES.find((l) => l.id === 'lens-24mm') || CAMERA_LENSES[2];
        recommendedLighting = LIGHTING_QUALITIES.find((l) => l.id === 'light-golden-backlit') || LIGHTING_QUALITIES[3];
        recommendedMood = DAILY_MOODS.find((m) => m.id === 'mood-walk') || DAILY_MOODS[1];
      } else {
        recommendedFilter = AESTHETIC_FILTERS.find((f) => f.id === 'iphone-candid') || AESTHETIC_FILTERS[1];
        recommendedLens = CAMERA_LENSES.find((l) => l.id === 'lens-iphone') || CAMERA_LENSES[4];
        recommendedLighting = LIGHTING_QUALITIES.find((l) => l.id === 'light-window') || LIGHTING_QUALITIES[0];
        recommendedMood = DAILY_MOODS.find((m) => m.id === 'mood-lazy-sunday') || DAILY_MOODS[2];
      }

      onChangeConfig({
        ...currentConfig,
        filter: recommendedFilter,
        lens: recommendedLens,
        lighting: recommendedLighting,
        mood: recommendedMood,
        grainLevel: recommendedFilter.id === 'analog-35mm' ? 'subtle' : 'none',
        colorTemp: recommendedLighting.id.includes('tungsten') || recommendedLighting.id.includes('golden') ? 'warm' : 'neutral',
        bokehLevel: recommendedLens.aperture === 'f/1.4' ? 'deep' : 'balanced',
      });

      setIsAiMatching(false);
      setAutoMatchMessage(`"${environmentName.split('(')[0]}" sahnesi için ideal "${recommendedFilter.name}" stili seçildi!`);
      setTimeout(() => setAutoMatchMessage(null), 3500);
    }, 450);
  };

  const getMoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'Footprints':
        return <Footprints className="w-3.5 h-3.5" />;
      case 'Laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      default:
        return <Sun className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-indigo-500/20 text-rose-400 border border-rose-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                AI Görsel Stil & Estetik Seçici
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono border border-rose-500/20">
                Studio Signature v2
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {personaName} için fotoğrafik lens dokusu, film emülsiyonu ve ışık sıcaklığı belirleyin.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isAiMatching}
            onClick={handleSmartAutoMatch}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAiMatching ? 'animate-spin' : 'text-indigo-300'}`} />
            <span>{isAiMatching ? 'Stil Eşleniyor...' : 'AI ile Otomatik Eşle'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            title={isExpanded ? 'Gizle' : 'Genişlet'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Auto Match Notification Banner */}
      {autoMatchMessage && (
        <div className="px-3.5 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{autoMatchMessage}</span>
        </div>
      )}

      {/* Active Selection Summary Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-neutral-500 uppercase">Aktif Profil:</span>
        <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-xs font-medium text-white flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: currentConfig.filter.colorHex }}
          />
          <span className="text-neutral-400">Filtre:</span>
          <span className="text-white font-semibold">{currentConfig.filter.badge}</span>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-xs font-medium text-neutral-300 flex items-center gap-1.5">
          <Camera className="w-3 h-3 text-rose-400" />
          <span className="text-neutral-400">Lens:</span>
          <span>{currentConfig.lens.focalLength} {currentConfig.lens.aperture}</span>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-xs font-medium text-neutral-300 flex items-center gap-1.5">
          <Sun className="w-3 h-3 text-amber-400" />
          <span className="text-neutral-400">Işık:</span>
          <span>{currentConfig.lighting.temperature}</span>
        </span>

        <span className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-xs font-medium text-neutral-300 flex items-center gap-1.5">
          {getMoodIcon(currentConfig.mood.iconName)}
          <span className="text-neutral-400">Ruh:</span>
          <span>{currentConfig.mood.label}</span>
        </span>
      </div>

      {isExpanded && (
        <div className="space-y-5 pt-2">
          {/* Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {[
              { id: 'filter', label: 'Estetik Filtreler', icon: Film },
              { id: 'lens', label: 'Kamera & Lens', icon: Aperture },
              { id: 'lighting', label: 'Işık & Ton', icon: Sun },
              { id: 'finetune', label: 'İnce Ayar & Mood', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Aesthetic Filters Grid */}
          {activeTab === 'filter' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {AESTHETIC_FILTERS.map((f) => {
                const isSelected = currentConfig.filter.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => onChangeConfig({ ...currentConfig, filter: f })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-neutral-900 border-white/30 ring-1 ring-white/30 shadow-lg'
                        : 'bg-neutral-950/70 border-white/5 hover:border-white/15 hover:bg-neutral-900/60'
                    }`}
                  >
                    {/* Top color bar indicator */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 transition-opacity"
                      style={{ backgroundColor: f.colorHex, opacity: isSelected ? 1 : 0.4 }}
                    />

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-white font-display group-hover:text-rose-300 transition-colors">
                        {f.name}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {f.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] font-mono text-neutral-300 border border-white/5">
                        {f.badge}
                      </span>
                      {f.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] text-neutral-500 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Camera Lenses Grid */}
          {activeTab === 'lens' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CAMERA_LENSES.map((l) => {
                const isSelected = currentConfig.lens.id === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => onChangeConfig({ ...currentConfig, lens: l })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500/70 shadow-sm'
                        : 'bg-neutral-950/70 border-white/5 hover:border-white/15 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Aperture className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-xs font-bold text-white">
                          {l.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-rose-300 px-2 py-0.5 rounded bg-neutral-900 border border-white/10">
                        {l.aperture}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      🎯 <span className="text-neutral-300">{l.bestFor}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Lighting & Mood Grid */}
          {activeTab === 'lighting' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LIGHTING_QUALITIES.map((l) => {
                const isSelected = currentConfig.lighting.id === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => onChangeConfig({ ...currentConfig, lighting: l })}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/70 shadow-sm'
                        : 'bg-neutral-950/70 border-white/5 hover:border-white/15 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-white">
                          {l.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-300">
                        {l.temperature}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      ✨ Atmosfer: <span className="text-neutral-300">{l.vibe}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Fine-Tuning & Mood */}
          {activeTab === 'finetune' && (
            <div className="space-y-4">
              {/* Daily Mood Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Günün Ruh Hali & Anı (Daily Mood)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DAILY_MOODS.map((m) => {
                    const isSelected = currentConfig.mood.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onChangeConfig({ ...currentConfig, mood: m })}
                        className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border transition-all ${
                          isSelected
                            ? 'bg-white text-black font-semibold border-white shadow-sm'
                            : 'bg-neutral-950 border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800'
                        }`}
                      >
                        {getMoodIcon(m.iconName)}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders / Toggles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Film Grain */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase">
                    Analog Film Greni
                  </label>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    {[
                      { id: 'none', label: 'Yok' },
                      { id: 'subtle', label: 'Hafif' },
                      { id: 'vintage', label: 'Vintage' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onChangeConfig({
                            ...currentConfig,
                            grainLevel: opt.id as any,
                          })
                        }
                        className={`py-1 rounded text-center font-medium transition-colors ${
                          currentConfig.grainLevel === opt.id
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Temp */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase">
                    Renk Sıcaklığı
                  </label>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    {[
                      { id: 'cool', label: 'Soğuk' },
                      { id: 'neutral', label: 'Nötr' },
                      { id: 'warm', label: 'Sıcak' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onChangeConfig({
                            ...currentConfig,
                            colorTemp: opt.id as any,
                          })
                        }
                        className={`py-1 rounded text-center font-medium transition-colors ${
                          currentConfig.colorTemp === opt.id
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bokeh / DoF */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase">
                    Arka Plan Fluluğu (Bokeh)
                  </label>
                  <div className="grid grid-cols-3 gap-1 text-[11px]">
                    {[
                      { id: 'subtle', label: 'Net' },
                      { id: 'balanced', label: 'Dengeli' },
                      { id: 'deep', label: 'Yoğun' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          onChangeConfig({
                            ...currentConfig,
                            bokehLevel: opt.id as any,
                          })
                        }
                        className={`py-1 rounded text-center font-medium transition-colors ${
                          currentConfig.bokehLevel === opt.id
                            ? 'bg-indigo-500 text-white font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
