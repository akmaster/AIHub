import React, { useRef } from 'react';
import { Camera, Sparkles, Sliders, Maximize2 } from 'lucide-react';
import { AspectRatioType } from '../types/influencer';

interface PhotoRendererProps {
  url?: string;
  title: string;
  personaName: string;
  environment?: string;
  outfit?: string;
  cameraPreset?: string;
  lighting?: string;
  aspectRatio: AspectRatioType;
  className?: string;
  showMetaOverlay?: boolean;
  onExpand?: () => void;
}

export const PhotoRenderer: React.FC<PhotoRendererProps> = ({
  url,
  title,
  personaName,
  environment = 'Milan Sokakları',
  outfit = 'Lüks Blazer',
  cameraPreset = '35mm F/1.4',
  lighting = 'Altın Saat',
  aspectRatio,
  className = '',
  showMetaOverlay = true,
  onExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Reset states when url changes
  React.useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [url]);

  // Aspect ratio classes
  const aspectClass = {
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '4:3': 'aspect-[4/3]',
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-[16/9]',
  }[aspectRatio] || 'aspect-square';

  // Environment-based artistic atmospheric background
  const getEnvironmentGradients = (env: string) => {
    if (env.toLowerCase().includes('tokyo') || env.toLowerCase().includes('siber') || env.toLowerCase().includes('neon')) {
      return {
        bg: 'from-[#12072B] via-[#090D2E] to-[#040612]',
        accent: 'from-pink-500/30 via-cyan-500/20 to-transparent',
        badge: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30',
        glow: '#E024A5',
      };
    }
    if (env.toLowerCase().includes('paris') || env.toLowerCase().includes('kafe')) {
      return {
        bg: 'from-[#211E1A] via-[#151311] to-[#0D0C0A]',
        accent: 'from-amber-600/25 via-stone-400/10 to-transparent',
        badge: 'bg-amber-500/10 text-amber-200 border-amber-500/30',
        glow: '#D97706',
      };
    }
    if (env.toLowerCase().includes('bodrum') || env.toLowerCase().includes('yat') || env.toLowerCase().includes('deniz')) {
      return {
        bg: 'from-[#072535] via-[#0A1826] to-[#040C14]',
        accent: 'from-teal-500/30 via-sky-500/20 to-transparent',
        badge: 'bg-teal-500/10 text-teal-200 border-teal-500/30',
        glow: '#0D9488',
      };
    }
    if (env.toLowerCase().includes('penthouse') || env.toLowerCase().includes('batımı')) {
      return {
        bg: 'from-[#2B1410] via-[#1B0F15] to-[#0A070D]',
        accent: 'from-rose-500/30 via-amber-500/20 to-transparent',
        badge: 'bg-rose-500/10 text-rose-200 border-rose-500/30',
        glow: '#F43F5E',
      };
    }
    // Default high-fashion Milan / studio
    return {
      bg: 'from-[#1E1B24] via-[#13131A] to-[#0B0D13]',
      accent: 'from-indigo-500/20 via-purple-500/15 to-transparent',
      badge: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/30',
      glow: '#818CF8',
    };
  };

  const styleTheme = getEnvironmentGradients(environment);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-neutral-900 border border-white/10 group select-none ${aspectClass} ${className}`}
    >
      {url && !hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <Camera className="w-8 h-8 text-neutral-700 animate-bounce" />
            </div>
          )}
          <img
            src={url}
            alt={title}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </>
      ) : (
        /* High-fashion Editorial Stylized Canvas Fallback */
        <div className={`relative w-full h-full bg-gradient-to-b ${styleTheme.bg} flex flex-col justify-between p-5 overflow-hidden`}>
          {/* Ambient lighting texture */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${styleTheme.accent} mix-blend-screen opacity-80`} />
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: styleTheme.glow }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-2xl opacity-20"
            style={{ backgroundColor: styleTheme.glow }}
          />

          {/* Film Grain & Editorial Texture lines */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Aesthetic silhouette & golden ratio framing */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
            <svg
              className="w-48 h-48 text-white/10 transition-transform duration-700 group-hover:scale-110"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              {/* Studio Golden Ratio Framing lines */}
              <circle cx="50" cy="50" r="38" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="50" cy="50" r="46" opacity="0.2" />
              {/* Chic portrait silhouette outline */}
              <path
                d="M50 22 C43 22 38 27 38 35 C38 42 43 47 50 47 C57 47 62 42 62 35 C62 27 57 22 50 22 Z"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M32 75 C32 58 40 52 50 52 C60 52 68 58 68 75 Z"
                fill="currentColor"
                opacity="0.12"
              />
              <path d="M50 14 L50 20 M50 80 L50 86 M14 50 L20 50 M80 50 L86 50" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>

          {/* Top Tag: Lens & Persona mark */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/70 tracking-wider">
                {personaName.toUpperCase()}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
                {aspectRatio}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
              <Camera className="w-3 h-3 text-rose-400" />
              <span>{cameraPreset.split('(')[0].trim()}</span>
            </div>
          </div>

          {/* Center Title & Styling Details */}
          <div className="relative z-10 mt-auto">
            <p className="text-xs font-mono text-white/40 tracking-wider mb-1 uppercase">
              {lighting}
            </p>
            <h4 className="text-base font-semibold text-white/95 tracking-tight font-display line-clamp-2">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-white/60">
              <span className="truncate max-w-[150px]">{environment}</span>
              <span className="text-white/30">·</span>
              <span className="truncate max-w-[130px]">{outfit.split('&')[0]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hover Scrim & Quick Action Controls */}
      {showMetaOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            {onExpand && (
              <button
                type="button"
                onClick={onExpand}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all"
                title="Büyük Görünüm"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1 text-left">
            <p className="text-[11px] font-mono text-rose-300 uppercase tracking-widest">
              {cameraPreset.split('(')[0]}
            </p>
            <h5 className="text-sm font-medium text-white line-clamp-1">{title}</h5>
            <p className="text-xs text-white/70 line-clamp-1">{environment} · {lighting}</p>
          </div>
        </div>
      )}
    </div>
  );
};
