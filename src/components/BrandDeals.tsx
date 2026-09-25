import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  ArrowRight,
  Sparkles,
  FileCheck,
  Building,
} from 'lucide-react';
import { BrandDeal, PersonaProfile } from '../types/influencer';

interface BrandDealsProps {
  deals: BrandDeal[];
  currentPersona: PersonaProfile;
  onAddNewDeal: (deal: BrandDeal) => void;
  onShootForBrand: (deal: BrandDeal) => void;
}

export const BrandDeals: React.FC<BrandDealsProps> = ({
  deals,
  currentPersona,
  onAddNewDeal,
  onShootForBrand,
}) => {
  const [dealList, setDealList] = useState<BrandDeal[]>(deals);
  const [selectedDeal, setSelectedDeal] = useState<BrandDeal>(deals[0]);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Deal Form
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState<BrandDeal['category']>('Lifestyle');
  const [budget, setBudget] = useState('₺2.000');
  const [deliverables, setDeliverables] = useState('1x Samimi Feed Karesi, 2x Story');
  const [deadline, setDeadline] = useState('15 Ekim 2026');
  const [brief, setBrief] = useState('');

  // Total Pipeline calculations
  const totalPipeline = dealList.reduce((acc, d) => acc + d.rawBudget, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const raw = parseInt(budget.replace(/\D/g, '')) || 2000;
    const newDeal: BrandDeal = {
      id: `deal-${Date.now()}`,
      brandName,
      category,
      logoText: brandName.split(' ')[0].toUpperCase(),
      deliverables,
      budget,
      rawBudget: raw,
      deadline,
      status: 'Teklif',
      brief: brief || 'Yerel butik marka için samimi ve doğal deneyim paylaşımı.',
    };

    const updated = [newDeal, ...dealList];
    setDealList(updated);
    onAddNewDeal(newDeal);
    setSelectedDeal(newDeal);
    setShowNewModal(false);

    // reset
    setBrandName('');
    setBrief('');
  };

  const getStatusColor = (status: BrandDeal['status']) => {
    switch (status) {
      case 'Teklif':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Hazırlanıyor':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Onayda':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Yayınlandı':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Revenue Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Butik & Yerel Marka İşbirlikleri
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {currentPersona.name} için mahalle kahvecileri, bağımsız yayınevleri ve seramik atölyeleriyle samimi ortaklıklar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni İşbirliği Ekle</span>
        </button>
      </div>

      {/* Revenue Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-400">
            Aktif İşbirliği Hacmi
          </span>
          <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            ₺{totalPipeline.toLocaleString('tr-TR')}
          </p>
          <span className="text-[10px] text-neutral-500">
            {dealList.length} adet yerel butik anlaşması
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-400">
            Ortalama Paylaşım Ücreti
          </span>
          <p className="text-2xl font-bold text-white font-mono tabular-nums">
            ₺2.200
          </p>
          <span className="text-[10px] text-neutral-500">
            {currentPersona.stats.engagementRate} organik samimi etkileşim
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono uppercase text-neutral-400">
            Takipçi Güven Endeksi
          </span>
          <p className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
            %98 Samimi
          </p>
          <span className="text-[10px] text-neutral-500">
            Yalnızca gerçekten sevilen ürünler
          </span>
        </div>
      </div>

      {/* 2-Column: Deal List on Left, Detail & Studio Dispatch on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Deal Table/List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-semibold text-white font-display">
            Sözleşme Listesi
          </h3>

          <div className="space-y-2">
            {dealList.map((deal) => {
              const isSelected = selectedDeal.id === deal.id;
              return (
                <div
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-neutral-800/80 border-rose-500/80 shadow-md'
                      : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center font-display font-black text-xs text-white shrink-0">
                      {deal.logoText.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {deal.brandName}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getStatusColor(
                            deal.status
                          )}`}
                        >
                          {deal.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {deal.deliverables}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-sm font-bold text-white font-mono">
                      {deal.budget}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {deal.deadline}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Deal Detail & Action Box (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                {selectedDeal.category}
              </span>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                {selectedDeal.brandName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-emerald-400 font-mono">
                {selectedDeal.budget}
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono">
                Son Tarih: {selectedDeal.deadline}
              </span>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-1.5 text-xs">
            <span className="text-neutral-400 font-medium">Taahhüt Edilen İçerik:</span>
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-white/5 text-neutral-200 font-mono">
              {selectedDeal.deliverables}
            </div>
          </div>

          {/* Creative Brief */}
          <div className="space-y-1.5 text-xs">
            <span className="text-neutral-400 font-medium">Kreatif Brief & İstenen Konsept:</span>
            <div className="p-3.5 rounded-lg bg-neutral-950 border border-white/5 text-neutral-300 leading-relaxed text-xs">
              {selectedDeal.brief}
            </div>
          </div>

          {/* Action: Shoot in Studio for this Brand */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => onShootForBrand(selectedDeal)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bu Marka İçin Stüdyoda Çekim Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-neutral-500">
              Stüdyo paneline markanın konseptine uygun mekan ve kıyafet otomatik yüklenir.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: New Brand Deal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">
              Yeni Sponsorluk Anlaşması Kaydet
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300">Marka / Butik Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Köz Kahve, Doku Çanta, Kadıköy Sahafı"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as BrandDeal['category'])
                    }
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Lifestyle">Yaşam & Kahve</option>
                    <option value="Fashion">Vintage & Giyim</option>
                    <option value="Beauty">Doğal Bakım</option>
                    <option value="Tech">Fotoğraf & Zanaat</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300">Bütçe (₺)</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300">İçerik Çıktıları</label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300">Kreatif Brief / İstekler</label>
                <textarea
                  rows={3}
                  placeholder="Örn: Filtre kahve içerken samimi bir tavsiye karesi, kediyle doğal an..."
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
