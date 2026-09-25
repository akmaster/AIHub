---
name: virtual-influencer-hub
description: Sanal influencer kimlik tasarımı, yüz tutarlılık DNA'sı, yapay zeka fotoğraf stüdyosu, Instagram feed planlayıcı, marka işbirlikleri ve topluluk analitiği platformu geliştirme rehberi ve sistem mimarisi.
---

# AuraPersona: Sanal Influencer Yönetim Merkezi & AI Stüdyo Mimarisi (SKILL.md)

Bu kılavuz, bağımsız bir sanal influencer (Virtual Influencer) ajans yönetim platformunun sıfırdan eksiksiz olarak kodlanması için gerekli veri modellerini, prompt mühendisliği kurallarını, yüz tutarlılık motorunu, backend API rotalarını ve frontend UI mimarisini tanımlar.

---

## 1. Genel Bakış ve Temel Felsefe

Geleneksel görsel üretim araçlarında karşılaşılan en büyük problem **karakter tutarsızlığıdır** (her üretimde farklı bir yüz çıkması). Bu platformun temel inovasyonu, **Consistency Lock (Yüz ve Karakter DNA Kilidi)** mekanizması ile sosyal medya yöneticilerinin tek tıkla tutarlı editoryal moda çekimleri yapmasını, 9-Grid Instagram ızgarasında estetik planlama yapmasını ve marka işbirliklerini monetize etmesini sağlamaktır.

---

## 2. Teknoloji Yığını (Tech Stack)

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React (ikon seti).
- **Backend:** Node.js, Express, TSX.
- **Yapay Zeka Modelleri:**
  - **Metin & Strateji:** `@google/genai` SDK ile `models/gemini-3.8-flash` (Viral caption, persona DNA optimizasyonu, takipçi yorumu simülasyonu).
  - **Fotoğraf & Görsel Üretim:** `Pollinations AI Engine` / `Gemini Image Generation` ile en-boy oranına göre optimize edilmiş prompt boru hattı.
- **Tipografi:** Başlıklar için `Syne` (display face), gövde için `Plus Jakarta Sans`, teknik metinler için `JetBrains Mono`.
- **Tema:** Dark mode luxury aesthetic (`#0B0D13` arka plan, `#E2E8F0` tipografi, rose & indigo gradyan aksanlar).

---

## 3. Tip Tanımları (TypeScript Schema)

```typescript
export type AspectRatioType = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface PersonaProfile {
  id: string;
  name: string;
  handle: string;
  niche: string;
  tagline: string;
  bio: string;
  age: string;
  location: string;
  avatarSeed: string;
  avatarUrl?: string;
  visualLock: string; // Karakterin yüz/fiziksel tutarlılık promptu
  voiceTone: string;  // Konuşma ve yanıt üslubu
  targetAudience: string;
  signatureStyle: string;
  stats: {
    followers: string;
    followersCount: number;
    engagementRate: string;
    postsCount: number;
    monthlyEarnings: string;
  };
  highlights: { title: string; icon: string }[];
}

export interface GeneratedPhoto {
  id: string;
  personaId: string;
  title: string;
  url: string;
  aspectRatio: AspectRatioType;
  prompt: string;
  environment: string;
  outfit: string;
  cameraPreset: string;
  lighting: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  isFavorite?: boolean;
  caption?: string;
  hashtags?: string[];
  scheduledDate?: string;
  brandTag?: string;
}

export interface BrandDeal {
  id: string;
  brandName: string;
  category: 'Fashion' | 'Tech' | 'Beauty' | 'Automotive' | 'Lifestyle';
  logoText: string;
  deliverables: string;
  budget: string;
  rawBudget: number;
  deadline: string;
  status: 'Teklif' | 'Hazırlanıyor' | 'Onayda' | 'Yayınlandı';
  brief: string;
}

export interface FanComment {
  id: string;
  username: string;
  userAvatarSeed: string;
  text: string;
  timeAgo: string;
  reply?: string;
}
```

---

## 4. Karakter Yüz DNA Kilidi (Consistency Anchor) Formülü

Her sanal influencer oluşturulduğunda değişmez bir `visualLock` prompt bloğu oluşturulmalıdır. Bu blok şu 6 bileşeni içermelidir:
1. **Yaş ve Etnik/Bölgesel Hatlar:** `23-year-old virtual woman with warm almond hazel eyes`
2. **Saç Kesimi ve Rengi:** `shoulder-length blunt cut espresso brown hair`
3. **Ten Dokusu ve Karakteristik İşaretler:** `natural glowing porcelain skin tone, subtle freckles across nose bridge`
4. **Bakış ve Yüz İfadesi:** `confident relaxed gaze, calm editorial poise`
5. **İmza Aksesuar:** `minimalist delicate jewelry`
6. **Kalite Direktifleri:** `hyperrealistic editorial photography, photorealistic skin texture, 8k resolution, shot on 35mm lens`

**Örnek Birleştirilmiş Üretim Promptu:**
```
[visualLock], [outfit.prompt], [pose.prompt], [environment.prompt], [lighting.prompt], [cameraPreset.prompt]
```

---

## 5. Çekim Parametreleri Kütüphanesi

### A. Mekan & Arka Plan (Environments)
- **Milan Moda Haftası:** `historic cobblestone street in Milan during Fashion Week, Haussmann architecture, golden hour sunlight`
- **Paris Kafe:** `outdoor marble table at a quiet Parisian corner cafe, brass accents, soft bokeh`
- **Tokyo Siber Gece:** `atmospheric Tokyo alleyway at night, reflections on wet pavement, ambient neon sign glows`
- **Minimalist Penthouse:** `luxury glass penthouse living room, skyline view, warm amber sunset glow`
- **Ege Yat Güvertesi:** `teak wood deck of a luxury sailing yacht cruising crystal turquoise Mediterranean waters`
- **Sonsuz Beyaz Stüdyo:** `high-fashion minimalist photo studio with infinite white cyclorama, clean soft shadows`

### B. Kombin & Stil (Outfits)
- **Oversized Kaşmir Blazer:** `tailored oversized charcoal gray cashmere blazer, fluid cream silk trousers`
- **Siber Sokak Giyimi:** `iridescent matte black cropped technical bomber jacket, utility cargo pants`
- **Gece Elbisesi:** `architectural floor-length black velvet gown with clean asymmetric neckline`
- **Yazlık Keten:** `breezy unbuttoned ecru linen shirt over ribbed knit top, sand linen shorts`

### C. Kamera, Lens & Işık (Optics & Lighting)
- **Leica 35mm f/1.4:** Belgesel / sokak stili dokusu, analog film greni
- **Hasselblad 85mm f/1.8:** Sığ alan derinliği, kremsi arka plan bulanıklığı (bokeh)
- **90'lar Doğrudan Flaş:** Yüksek kontrastlı parti & retro editoryal moda
- **Altın Saat (Golden Hour):** Sıcak ters ışık, saç hatlarını aydınlatan rim-light

---

## 6. Backend API Rota Mimarisi

### 1. POST `/api/generate-photo`
- **İşlev:** Parametreleri birleştirir, en-boy oranına göre piksel boyutlarını hesaplar ve görseli üretir.
- **En-Boy Haritası:**
  - `1:1`: 1024x1024
  - `3:4`: 768x1024
  - `4:3`: 1024x768
  - `9:16`: 576x1024
  - `16:9`: 1024x576
- **Görsel Üretici Uç Noktası:**
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true`
- **Dönüş:** `{ success: true, imageUrl: string, prompt: string, seed: number }`

### 2. POST `/api/generate-caption`
- **Model:** `models/gemini-3.8-flash`
- **Sistem Promptu:** Karakterin nişine ve tonuna uygun, Türkçe Z-kuşağı/moda dilinde Instagram caption'ı, kanca cümlesi (hook), etkileşim sorusu (CTA) ve 5-7 adet trend hashtag üretir. Sponsorlu ise `#işbirliği` zorunlu tutulur.
- **JSON Şeması:**
  ```json
  {
    "caption": "Metin...",
    "hook": "Kanca cümlesi...",
    "cta": "Yorum sorusu...",
    "hashtags": ["#tag1", "#tag2"]
  }
  ```

### 3. POST `/api/generate-persona`
- **Model:** `models/gemini-3.8-flash`
- **İşlev:** Verilen isim, niş ve vibe girdilerine göre eksiksiz persona kimlik dosyası (Bio, hedef kitle analizi, visualLock promptu, ses tonu) hazırlar.

### 4. POST `/api/simulate-reply`
- **Model:** `models/gemini-3.8-flash`
- **İşlev:** Takipçi yorumuna sanal influencerın kendi ses tonu ve mizacıyla samimi 1-2 cümlelik yanıt üretir.

---

## 7. Frontend Modülleri ve Ekranlar

1. **Fotoğraf Stüdyosu (`PhotoStudio`):**
   - 2 sütunlu düzen: Sol tarafta mekan, kıyafet, duruş, lens ve en-boy oranı kontrolleri; sağ tarafta canlı önizleme sahnesi, PNG indirme ve tek tıkla feed'e aktarma butonları.
   - Alt kısımda influencer'ın geçmiş çekimler galerisi ve lightbox modalı.

2. **Persona DNA & Kimlik Stüdyosu (`PersonaDNA`):**
   - Çoklu influencer sekmesi (influencer değiştirme veya yeni oluşturma).
   - Profil kartı, takipçi ve tahmini aylık kazanç metrikleri.
   - `visualLock` düzenleme alanı ve Gemini ile "AI ile Optimize Et" butonu.

3. **Görsel Feed Planlayıcı (`FeedPlanner`):**
   - Mobil Instagram simülatörü (9-Grid ızgara, bio, story highlight halkaları).
   - Seçili gönderiye yapay zeka ile otomatik açıklama ve hashtag yazdırma sihirbazı.
   - Tarih ve saat bazlı gönderi zamanlama girişi.

4. **Marka İşbirlikleri & Sponsorluk Masası (`BrandDeals`):**
   - Aktif kampanya hacmi (₺ bütçe pipeline'ı).
   - Prada, Sony, Sephora, Porsche vb. marka anlaşmaları tablosu.
   - "Bu Marka İçin Stüdyoda Çekim Başlat" butonu (markanın briefindeki kıyafet ve mekan ayarlarını stüdyoya otomatik yükler).

5. **Topluluk & Analiz (`AnalyticsCommunity`):**
   - Canlı takipçi yorumları akışı.
   - Karakterin kendi sesiyle yapay zeka destekli anında yanıt üretimi.
   - Şehir (İstanbul, Milan, Paris), yaş (%82 Z&Y) ve cinsiyet dağılım grafikleri.

6. **Resmi Medya Kiti (`MediaKitModal`):**
   - Markalara sunulmaya hazır tek sayfalık PDF/yazdırma uyumlu medya kiti.
   - Post başı resmi fiyat tarifesi (Feed Post, Story serisi, Reels, Çeyreklik Elçilik).

---

## 8. Hata Yönetimi ve Dayanıklılık (Resilience Rules)

- **Kota ve 429 Koruması:** Ücretsiz katman API sınırlamalarına takılmamak için görsel üretiminde harici bağımsız AI görsel motoru kullanılmalı; metin üretiminde (Gemini 3.8 Flash) 503/429 durumlarında önceden hazırlanmış yüksek kaliteli şablonlara (fallback) sessizce geçilmelidir.
- **Görsel Fallback:** Herhangi bir görsel yüklenemediğinde kırık resim simgesi yerine şık editoryal kart ve ortam gradyanı devreye girmelidir.
- **İndirme Mekanizması:** Harici URL'ler `fetch` -> `blob` -> `URL.createObjectURL` yöntemiyle doğrudan `.png` olarak kullanıcının cihazına kaydedilmelidir.
