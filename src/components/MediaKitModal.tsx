import React from 'react';
import {
  FileText,
  Download,
  Share2,
  Check,
  X,
  Sparkles,
  Award,
  DollarSign,
  Globe,
  Printer,
} from 'lucide-react';
import { PersonaProfile } from '../types/influencer';

interface MediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaProfile;
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({
  isOpen,
  onClose,
  persona,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-white/20 rounded-3xl max-w-3xl w-full p-8 space-y-8 my-8 shadow-2xl relative text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Kit Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-white/10 pb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 p-1 shrink-0 overflow-hidden">
            {persona.avatarUrl ? (
              <img
                src={persona.avatarUrl}
                alt={persona.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-display font-extrabold text-3xl text-white">
                {persona.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-white">
                {persona.name}
              </h2>
              <span className="text-sm font-mono text-rose-400">
                {persona.handle}
              </span>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                Resmi Sanal Temsilcilik
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              {persona.niche} · {persona.location}
            </p>
            <p className="text-xs text-neutral-400 max-w-xl">
              {persona.bio}
            </p>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-neutral-950 border border-white/5 text-center">
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Gerçek Takipçi
            </span>
            <p className="text-2xl font-bold text-white font-mono mt-1">
              {persona.stats.followers}
            </p>
            <span className="text-[10px] text-neutral-500">Organik & Aktif Kitle</span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Etkileşim Oranı
            </span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {persona.stats.engagementRate}
            </p>
            <span className="text-[10px] text-neutral-500">Yüksek bağ & güven</span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Aylık Gösterim
            </span>
            <p className="text-2xl font-bold text-white font-mono mt-1">
              28.5K
            </p>
            <span className="text-[10px] text-neutral-500">Hikaye & Gönderi Erişimi</span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Hedef Kitle Yaşı
            </span>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
              18-28
            </p>
            <span className="text-[10px] text-neutral-500">Öğrenci & Genç Çalışan</span>
          </div>
        </div>

        {/* Commercial Rate Card (Fiyat Tarifesi) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Butik & Yerel Marka Dostu İşbirliği Tarifesi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  1x Samimi Feed Fotoğrafı & İnceleme
                </span>
                <span className="text-[11px] text-neutral-400">
                  Doğal ortamında, zorlama olmadan dürüst deneyim karesi
                </span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-400 shrink-0 ml-3">
                ₺2.500
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  2x Doğal Hikaye (Story & Link)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Günlük rutin içinde arkadaş tavsiyesi formatında paylaşım
                </span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-400 shrink-0 ml-3">
                ₺1.200
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  1x Samimi Reels / Video & Deneyim
                </span>
                <span className="text-[11px] text-neutral-400">
                  Kullanım aşamalarını veya dükkan ziyaretini gösteren vlog
                </span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-400 shrink-0 ml-3">
                ₺3.500
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  Yerel Marka Dostluğu (3 Ay)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Aylık düzenli hikaye ve gönderi, çekiliş ortaklığı
                </span>
              </div>
              <span className="font-mono font-bold text-base text-emerald-400 shrink-0 ml-3">
                ₺8.000
              </span>
            </div>
          </div>
        </div>

        {/* Past Partners */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">
            Önceki Samimi Butik İşbirlikleri
          </span>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300 font-mono">
            {['KÖZ KAHVE', 'TOPRAK & ÇAMUR SERAMİK', 'DOKU BEZ ÇANTA', 'KIYI YAYINEVİ', 'KADIKÖY SAHAFI'].map((brand, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs text-neutral-500 font-mono">
            Son Güncelleme: Eylül 2026 · AI Studio Verified
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
