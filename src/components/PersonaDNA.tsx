import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Lock,
  Save,
  Check,
  RefreshCw,
  Plus,
  Sliders,
  Flame,
  Globe,
  DollarSign,
  Heart,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { PersonaProfile } from '../types/influencer';

interface PersonaDNAProps {
  personas: PersonaProfile[];
  currentPersona: PersonaProfile;
  onSelectPersona: (p: PersonaProfile) => void;
  onUpdatePersona: (updated: PersonaProfile) => void;
  onCreateNewPersona: (newP: PersonaProfile) => void;
}

export const PersonaDNA: React.FC<PersonaDNAProps> = ({
  personas,
  currentPersona,
  onSelectPersona,
  onUpdatePersona,
  onCreateNewPersona,
}) => {
  const [formData, setFormData] = useState<PersonaProfile>(currentPersona);
  const [isSaved, setIsSaved] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaNiche, setNewPersonaNiche] = useState('');
  const [newPersonaVibe, setNewPersonaVibe] = useState('');

  // Sync if currentPersona changes from parent
  React.useEffect(() => {
    setFormData(currentPersona);
  }, [currentPersona]);

  const handleSave = () => {
    onUpdatePersona(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePolishWithAI = async () => {
    setIsPolishing(true);
    try {
      const res = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          niche: formData.niche,
          vibe: formData.signatureStyle,
        }),
      });
      const data = await res.json();
      if (data.persona) {
        setFormData((prev) => ({
          ...prev,
          visualLock: data.persona.visualLock || prev.visualLock,
          bio: data.persona.bio || prev.bio,
          voiceTone: data.persona.voiceTone || prev.voiceTone,
          targetAudience: data.persona.targetAudience || prev.targetAudience,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonaName.trim()) return;

    const newId = `persona-${Date.now()}`;
    const handle = `@${newPersonaName.toLowerCase().replace(/\s+/g, '')}.ai`;

    const newProfile: PersonaProfile = {
      id: newId,
      name: newPersonaName,
      handle,
      niche: newPersonaNiche || 'Günlük Yaşam & Mahalle Kültürü',
      tagline: 'Sıradan anlar, kahve molaları ve samimi notlar.',
      bio: `${newPersonaName}. Günlük anlar, küçük mutluluklar & tasarım. ☕🌿\n${newPersonaNiche || 'Mahalle hayatı'}\nİletişim: ${newPersonaName.toLowerCase().replace(/\s+/g, '')}.iletisim@gmail.com`,
      age: '24',
      location: 'İstanbul',
      avatarSeed: newPersonaName.toLowerCase(),
      visualLock: `24-year-old approachable, natural everyday Turkish person named ${newPersonaName}, friendly expressive eyes, natural candid hairstyle, unedited natural skin texture, comfortable relaxed casual everyday clothing, warm genuine smile`,
      voiceTone: 'Samimi, mütevazı, içten ve günlük konuşma dili.',
      targetAudience: '18-28 yaş öğrenciler, genç çalışanlar ve sakin hayatı sevenler.',
      signatureStyle: newPersonaVibe || 'Rahat pamuklu tişörtler, salaş hırkalar, spor ayakkabılar ve 35mm doğal tonlar.',
      stats: {
        followers: '3.4K',
        followersCount: 3400,
        engagementRate: '%7.5',
        postsCount: 42,
        monthlyEarnings: '₺4.500',
      },
      highlights: [
        { title: 'Günlük', icon: 'Sparkles' },
        { title: 'Kahveler', icon: 'Coffee' },
        { title: 'Notlar', icon: 'MessageSquare' },
      ],
    };

    onCreateNewPersona(newProfile);
    setShowCreateModal(false);
    setNewPersonaName('');
    setNewPersonaNiche('');
    setNewPersonaVibe('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Persona Switcher & Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Sanal Influencer DNA & Kimlik Stüdyosu
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Yapay zeka karakterinizin yüz tutarlılığı, biyografisi, ses tonu ve marka değerlerini yönetin.
          </p>
        </div>

        {/* Persona Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {personas.map((p) => {
            const isSelected = p.id === currentPersona.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPersona(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 border border-dashed border-white/20 text-neutral-300 hover:text-white hover:border-white/40 flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Persona Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Persona Overview & Detailed DNA Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Influencer Card & Live Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Virtual Profile Card */}
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-rose-500/10 pointer-events-none" />

            <div className="relative pt-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 p-1 shadow-xl overflow-hidden">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-display font-extrabold text-2xl text-white">
                    {formData.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-white font-display">
                  {formData.name}
                </h3>
                <p className="text-xs text-rose-400 font-mono mt-0.5">
                  {formData.handle}
                </p>
                <p className="text-xs text-neutral-400 mt-2 px-4 italic">
                  "{formData.tagline}"
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
              <div>
                <span className="block text-sm font-bold text-white font-mono tabular-nums">
                  {formData.stats.followers}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Takipçi
                </span>
              </div>
              <div>
                <span className="block text-sm font-bold text-emerald-400 font-mono tabular-nums">
                  {formData.stats.engagementRate}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Etkileşim
                </span>
              </div>
              <div>
                <span className="block text-sm font-bold text-white font-mono tabular-nums">
                  {formData.stats.postsCount}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Post
                </span>
              </div>
            </div>

            {/* Income / Monetization overview */}
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] text-neutral-400 font-mono uppercase">
                  Tahmini Aylık Sponsorluk Hacmi
                </p>
                <p className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {formData.stats.monthlyEarnings}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            {/* Audience summary */}
            <div className="text-left space-y-1.5 text-xs">
              <span className="text-neutral-400 font-medium">Hedef Kitle:</span>
              <p className="text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                {formData.targetAudience}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: DNA Parameters & Consistency Engine (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Consistency Lock Box (The Core AI Feature) */}
          <div className="p-5 rounded-2xl bg-neutral-900/90 border border-rose-500/30 relative space-y-3 shadow-lg shadow-rose-950/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Fiziksel Yüz & Görsel DNA Kilidi (Consistency Anchor)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Tüm çekimlerde karakterin aynı yüz, saç, göz ve ten dokusuna sahip olmasını sağlayan temel anahtar.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isPolishing}
                onClick={handlePolishWithAI}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center gap-1.5 transition-colors"
                title="Yapay zeka ile promptu zenginleştir"
              >
                {isPolishing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
                )}
                <span>AI ile Optimize Et</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={formData.visualLock}
              onChange={(e) =>
                setFormData({ ...formData, visualLock: e.target.value })
              }
              className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-rose-500 leading-relaxed"
              placeholder="Örn: 23-year-old virtual woman with warm almond hazel eyes, shoulder-length blunt cut espresso brown hair..."
            />
            <p className="text-[11px] text-neutral-400 flex items-center gap-1">
              <span>💡 İpucu:</span> Bu metin Stüdyo'da üreteceğiniz her yeni fotoğrafın başına otomatik eklenerek yüz tutarlılığını korur.
            </p>
          </div>

          {/* Form Fields: General Information */}
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-neutral-300 font-mono">
              Temel Bilgiler & Marka Kimliği
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Influencer Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Kullanıcı Adı (@handle)
                </label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Niş / Kategori
                </label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) =>
                    setFormData({ ...formData, niche: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Konum & Üs
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">
                Profil Biyografisi (Bio)
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full bg-neutral-950 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  Ses Tonu & Karakter Dili
                </label>
                <input
                  type="text"
                  value={formData.voiceTone}
                  onChange={(e) =>
                    setFormData({ ...formData, voiceTone: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-medium">
                  İmza Estetik & Stil Kuralları
                </label>
                <input
                  type="text"
                  value={formData.signatureStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, signatureStyle: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Kaydedildi!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Persona */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">
              Yeni Sanal Influencer Oluştur
            </h3>
            <p className="text-xs text-neutral-400">
              Yeni karakterinizin temel yönelimini belirleyin. Sistem otomatik olarak yüz DNA'sını ve stil kılavuzunu hazırlayacaktır.
            </p>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">İsim & Soyisim</label>
                <input
                  type="text"
                  placeholder="Örn: Leyla Aras"
                  value={newPersonaName}
                  onChange={(e) => setNewPersonaName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Niş / Alan</label>
                <input
                  type="text"
                  placeholder="Örn: Fitness & Sağlıklı Yaşam veya Lüks Otomotiv"
                  value={newPersonaNiche}
                  onChange={(e) => setNewPersonaNiche(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Görsel Stil / Vibe</label>
                <input
                  type="text"
                  placeholder="Örn: İskandinav minimalizmi, pastel tonlar ve sıcak stüdyo ışığı"
                  value={newPersonaVibe}
                  onChange={(e) => setNewPersonaVibe(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-neutral-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
                >
                  Oluştur ve Stüdyoya Aktar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
