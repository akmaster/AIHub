import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { GeneratedPhoto } from '../types/influencer';

interface WeeklyCalendarViewProps {
  photos: GeneratedPhoto[];
  selectedPhoto: GeneratedPhoto | null;
  onSelectPhoto: (photo: GeneratedPhoto) => void;
  onUpdatePhoto: (updated: GeneratedPhoto) => void;
  onNavigateToStudio: () => void;
  personaName: string;
}

interface DayColumn {
  id: string;
  name: string;
  shortName: string;
  dateStr: string;
  dayNumber: number;
  isToday: boolean;
  bestHour: string;
}

const WEEK_DAYS: DayColumn[] = [
  { id: 'mon', name: 'Pazartesi', shortName: 'Pzt', dateStr: '2026-09-21', dayNumber: 21, isToday: false, bestHour: '12:30' },
  { id: 'tue', name: 'Salı', shortName: 'Sal', dateStr: '2026-09-22', dayNumber: 22, isToday: false, bestHour: '14:15' },
  { id: 'wed', name: 'Çarşamba', shortName: 'Çar', dateStr: '2026-09-23', dayNumber: 23, isToday: false, bestHour: '18:00' },
  { id: 'thu', name: 'Perşembe', shortName: 'Per', dateStr: '2026-09-24', dayNumber: 24, isToday: false, bestHour: '16:45' },
  { id: 'fri', name: 'Cuma', shortName: 'Cum', dateStr: '2026-09-25', dayNumber: 25, isToday: true, bestHour: '11:30' },
  { id: 'sat', name: 'Cumartesi', shortName: 'Cmt', dateStr: '2026-09-26', dayNumber: 26, isToday: false, bestHour: '15:00' },
  { id: 'sun', name: 'Pazar', shortName: 'Paz', dateStr: '2026-09-27', dayNumber: 27, isToday: false, bestHour: '10:45' },
];

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  photos,
  selectedPhoto,
  onSelectPhoto,
  onUpdatePhoto,
  onNavigateToStudio,
  personaName,
}) => {
  const [rescheduleModalPhoto, setRescheduleModalPhoto] = useState<GeneratedPhoto | null>(null);
  const [selectedDayTarget, setSelectedDayTarget] = useState<string>('2026-09-25');
  const [selectedTimeTarget, setSelectedTimeTarget] = useState<string>('11:30');
  const [showAssignPickerForDay, setShowAssignPickerForDay] = useState<DayColumn | null>(null);

  // Group photos by day matching the date string (or assignable fallback)
  const getPhotosForDay = (day: DayColumn) => {
    return photos.filter((p) => {
      if (!p.scheduledDate) return false;
      return p.scheduledDate.startsWith(day.dateStr);
    });
  };

  // Quick Reschedule Action
  const handleOpenReschedule = (photo: GeneratedPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setRescheduleModalPhoto(photo);
    if (photo.scheduledDate) {
      const parts = photo.scheduledDate.split(' ');
      setSelectedDayTarget(parts[0] || '2026-09-25');
      setSelectedTimeTarget(parts[1] || '12:00');
    } else {
      setSelectedDayTarget('2026-09-25');
      setSelectedTimeTarget('12:00');
    }
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalPhoto) return;

    const newScheduledDate = `${selectedDayTarget} ${selectedTimeTarget}`;
    const updated: GeneratedPhoto = {
      ...rescheduleModalPhoto,
      scheduledDate: newScheduledDate,
    };

    onUpdatePhoto(updated);
    if (selectedPhoto?.id === updated.id) {
      onSelectPhoto(updated);
    }
    setRescheduleModalPhoto(null);
  };

  const handleAssignPhotoToDay = (photo: GeneratedPhoto, day: DayColumn) => {
    const updated: GeneratedPhoto = {
      ...photo,
      scheduledDate: `${day.dateStr} ${day.bestHour}`,
    };
    onUpdatePhoto(updated);
    setShowAssignPickerForDay(null);
  };

  // Weekly Stats calculation
  const scheduledCount = photos.filter((p) => Boolean(p.scheduledDate)).length;
  const brandDealPosts = photos.filter((p) => Boolean(p.brandTag)).length;

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-indigo-500/20 text-rose-400 border border-rose-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">
                Haftalık İçerik & Yayın Akışı Takvimi
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                21 - 27 Eylül 2026
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {personaName} için en yüksek etkileşim saatlerine göre planlanan gönderiler.
            </p>
          </div>
        </div>

        {/* Weekly Stats Summary */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-xs flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-neutral-400">Planlanan:</span>
            <span className="font-bold text-white font-mono">{scheduledCount} Gönderi</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/5 text-xs flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-neutral-400">İşbirlikleri:</span>
            <span className="font-bold text-emerald-400 font-mono">{brandDealPosts} Anlaşma</span>
          </div>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {WEEK_DAYS.map((day) => {
          const dayPhotos = getPhotosForDay(day);

          return (
            <div
              key={day.id}
              className={`p-3.5 rounded-2xl border flex flex-col min-h-[380px] transition-all ${
                day.isToday
                  ? 'bg-neutral-900/90 border-rose-500/40 shadow-lg shadow-rose-950/10 ring-1 ring-rose-500/20'
                  : 'bg-neutral-950/70 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-display">
                      {day.name}
                    </span>
                    {day.isToday && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {day.dayNumber} Eylül
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono text-neutral-500 block">
                    Pik Saat
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-300">
                    {day.bestHour}
                  </span>
                </div>
              </div>

              {/* Day Posts List */}
              <div className="flex-1 py-3 space-y-2.5 overflow-y-auto max-h-[320px] pr-0.5">
                {dayPhotos.length > 0 ? (
                  dayPhotos.map((photo) => {
                    const isSelected = selectedPhoto?.id === photo.id;
                    const scheduledTime = photo.scheduledDate
                      ? photo.scheduledDate.split(' ')[1] || '12:00'
                      : '12:00';

                    return (
                      <div
                        key={photo.id}
                        onClick={() => onSelectPhoto(photo)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all relative group ${
                          isSelected
                            ? 'bg-neutral-900 border-rose-500 shadow-md ring-1 ring-rose-500/40'
                            : 'bg-neutral-900/60 border-white/5 hover:border-white/20 hover:bg-neutral-900'
                        }`}
                      >
                        {/* Time & Tag Banner */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{scheduledTime}</span>
                          </span>

                          {photo.brandTag ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium truncate max-w-[90px]">
                              #{photo.brandTag}
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              Organik
                            </span>
                          )}
                        </div>

                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-white/10 relative">
                            {photo.url ? (
                              <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">
                                Görsel
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate group-hover:text-rose-300 transition-colors">
                              {photo.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                              {photo.environment.split('(')[0]}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-1">
                              <span className="flex items-center gap-0.5">
                                <Heart className="w-2.5 h-2.5" />
                                {photo.likes}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MessageCircle className="w-2.5 h-2.5" />
                                {photo.commentsCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Quick Actions */}
                        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => handleOpenReschedule(photo, e)}
                            className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                          >
                            <Clock className="w-2.5 h-2.5 text-rose-400" />
                            <span>Saati Değiştir</span>
                          </button>
                          <span className="text-[10px] text-rose-400 font-mono font-medium">
                            Düzenle →
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-3 text-neutral-500 border border-dashed border-white/5 rounded-xl">
                    <p className="text-[11px]">Planlanmış gönderi yok</p>
                    <span className="text-[10px] text-neutral-600 mt-1">
                      Önerilen: {day.bestHour}
                    </span>
                  </div>
                )}
              </div>

              {/* Day Bottom Action */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAssignPickerForDay(day)}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[11px] font-medium text-neutral-300 hover:text-white border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3 h-3 text-rose-400" />
                  <span>Bu Güne Gönderi Ekle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Quick Reschedule Modal */}
      {rescheduleModalPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  Gönderi Saatini Ayarla
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalPhoto(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-medium">
              "{rescheduleModalPhoto.title}"
            </p>

            <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400">Yayınlanacağı Gün</label>
                <select
                  value={selectedDayTarget}
                  onChange={(e) => setSelectedDayTarget(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {WEEK_DAYS.map((d) => (
                    <option key={d.id} value={d.dateStr}>
                      {d.name} ({d.dayNumber} Eylül) - Önerilen: {d.bestHour}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400">Yayın Saati</label>
                <input
                  type="time"
                  value={selectedTimeTarget}
                  onChange={(e) => setSelectedTimeTarget(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalPhoto(null)}
                  className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors"
                >
                  Planı Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Photo from Library to Day */}
      {showAssignPickerForDay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  {showAssignPickerForDay.name} ({showAssignPickerForDay.dayNumber} Eylül) İçin Gönderi Seç
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Galerinizdeki mevcut fotoğraflardan birini seçin veya stüdyoda yenisini üretin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignPickerForDay(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos selection grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => handleAssignPhotoToDay(photo, showAssignPickerForDay)}
                  className="p-2 rounded-xl bg-neutral-950 border border-white/10 hover:border-rose-500 hover:bg-neutral-900 cursor-pointer transition-all group"
                >
                  <div className="aspect-square rounded-lg bg-neutral-900 overflow-hidden mb-1.5 relative">
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
                        Fotoğraf
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {photo.title}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {photo.scheduledDate ? `Zaten planlı: ${photo.scheduledDate.split(' ')[0]}` : 'Henüz planlanmadı'}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowAssignPickerForDay(null);
                  onNavigateToStudio();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Stüdyoda Yeni Çekim Başlat</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAssignPickerForDay(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
