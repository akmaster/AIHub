import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  CornerDownRight,
  Globe,
  PieChart,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { FanComment, PersonaProfile } from '../types/influencer';

interface AnalyticsCommunityProps {
  currentPersona: PersonaProfile;
  initialComments: FanComment[];
}

export const AnalyticsCommunity: React.FC<AnalyticsCommunityProps> = ({
  currentPersona,
  initialComments,
}) => {
  const [comments, setComments] = useState<FanComment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingReplyId, setLoadingReplyId] = useState<string | null>(null);

  const handleGenerateReply = async (comment: FanComment) => {
    setLoadingReplyId(comment.id);
    try {
      const res = await fetch('/api/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: comment.text,
          personaName: currentPersona.name,
          personaTone: currentPersona.voiceTone,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) => (c.id === comment.id ? { ...c, reply: data.reply } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReplyId(null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: FanComment = {
      id: `c-${Date.now()}`,
      username: 'moda_tutkunu_istanbul',
      userAvatarSeed: 'fan',
      text: newCommentText,
      timeAgo: 'Yeni',
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-display">
          Topluluk Simülatörü & Kitle Analitiği
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          {currentPersona.name} kitlesiyle etkileşim kurun, takipçi yorumlarını yapay zeka ile karakterin kendi sesiyle yanıtlayın.
        </p>
      </div>

      {/* Demographic & Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase">
            Toplam Takipçi
          </span>
          <p className="text-2xl font-bold text-white font-mono tabular-nums">
            {currentPersona.stats.followers}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono">
            +185 bu ay (organik çevre)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase">
            Etkileşim Oranı
          </span>
          <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {currentPersona.stats.engagementRate}
          </p>
          <span className="text-[10px] text-neutral-400">
            Sektör ortalaması %2.1
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase">
            Takipçi Duygu Analizi
          </span>
          <p className="text-2xl font-bold text-indigo-300 font-mono tabular-nums">
            %94 Pozitif
          </p>
          <span className="text-[10px] text-neutral-400">
            Yüksek marka sadakati
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/70 border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase">
            Ana Yaş Aralığı
          </span>
          <p className="text-2xl font-bold text-rose-300 font-mono tabular-nums">
            18-29 Yaş
          </p>
          <span className="text-[10px] text-neutral-400">
            %82 Z & Y jenerasyonu
          </span>
        </div>
      </div>

      {/* 2-Column: Community Feed (Left) & Audience Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Fan Comments Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-display">
              Canlı Takipçi Yorumları & Karakter Yanıtları
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              {comments.length} Yorum
            </span>
          </div>

          {/* Test Comment Box */}
          <form
            onSubmit={handleAddComment}
            className="p-3.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Karakteri test etmek için bir takipçi sorusu yazın..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              Gönder
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-neutral-900/70 border border-white/5 space-y-3"
              >
                {/* User Comment */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-mono text-neutral-300">
                      {comment.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-200">
                        @{comment.username}
                      </span>
                      <span className="text-[10px] text-neutral-500 ml-2 font-mono">
                        {comment.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 pl-9 leading-relaxed">
                  {comment.text}
                </p>

                {/* Persona's AI Reply */}
                {comment.reply ? (
                  <div className="ml-9 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-300">
                      <CornerDownRight className="w-3 h-3 text-rose-400" />
                      <span>{currentPersona.name} Yanıtladı</span>
                      <span className="text-[10px] text-neutral-400 font-mono font-normal">
                        · AI Persona Voice
                      </span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed pl-4">
                      {comment.reply}
                    </p>
                  </div>
                ) : (
                  <div className="pl-9">
                    <button
                      type="button"
                      disabled={loadingReplyId === comment.id}
                      onClick={() => handleGenerateReply(comment)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[11px] font-medium text-indigo-200 flex items-center gap-1.5 transition-colors"
                    >
                      {loadingReplyId === comment.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Karakter Düşünüyor...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-300" />
                          <span>Karakterin Sesiyle Yanıtla</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demographics & Geographics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Locations */}
          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span>En Çok Takip Edilen Şehirler</span>
            </h4>

            <div className="space-y-3">
              {[
                { city: 'İstanbul (Kadıköy/Moda)', pct: 48 },
                { city: 'İzmir (Alsancak/Urla)', pct: 22 },
                { city: 'Ankara (Çankaya)', pct: 15 },
                { city: 'Eskişehir', pct: 10 },
                { city: 'Antalya', pct: 5 },
              ].map((loc, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-300">{loc.city}</span>
                    <span className="text-white font-bold">%{loc.pct}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                      style={{ width: `${loc.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender & Age Breakdown */}
          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-white/10 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Cinsiyet & İlgi Alanı Dağılımı</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-neutral-950 border border-white/5">
                <span className="block text-lg font-bold text-white font-mono">
                  %68
                </span>
                <span className="text-[11px] text-neutral-400">Kadın</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-white/5">
                <span className="block text-lg font-bold text-white font-mono">
                  %32
                </span>
                <span className="text-[11px] text-neutral-400">Erkek</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="text-neutral-400">En Çok İlgilenilen Temalar:</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[11px]">
                  #KahveVeKitap (%45)
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[11px]">
                  #İkinciElModa (%32)
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[11px]">
                  #SakinYaşam & Kedi (%23)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
