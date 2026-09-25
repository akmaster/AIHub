---
name: virtual-influencer-studio
description: Complete architecture, prompt engineering, data contracts, and implementation guide for building an Everyday Relatable Virtual Influencer Studio & Management Hub with React, TypeScript, Express, and Gemini API.
version: 2.0.0
tags: [virtual-influencer, gemini-api, image-generation, react, full-stack, typescript, tailwindcss, content-calendar]
---

# Everyday Virtual Influencer Studio & Management Platform (SKILL.md)

Bu skill yönergesi; herhangi bir yapay zekaya (LLM / Agent / Cursor / Claude / ChatGPT / DeepSeek vb.) verildiğinde, sıfırdan **"Doğal & Samimi Günlük Yaşam Sanal Influencer Yönetim Merkezi"** web uygulamasını hiçbir eksik olmadan, endüstri standardı mimariyle kodlayabilmesi için gereken tüm felsefeyi, veri modellerini, prompt mühendisliği algoritmalarını, arayüz bileşenlerini ve API uç noktalarını tanımlar.

---

## 1. Temel Konsept & Felsefe (Domain Philosophy)

- **Karakter Kimliği:** Aşırı cilalı, zengin, podyum mankeni veya süper lüks jet-set figürü DEĞİL; Kadıköy, Moda veya Cihangir sokaklarında yaşayan, 22-26 yaşlarında, üniversite okuyan veya genç çalışan, sıradan bir hayat süren **doğal mikro-influencer (3.000 - 6.000 takipçi)**.
- **Görsel Estetik:** Aşırı pürüzsüz yapay zeka derisi ("plastic AI slop") veya stüdyo moda çekimi yerine; doğal gün ışığı, 35mm analog film dokusu, iPhone anlık samimi kareleri, salaş trikolar, ikinci el kitapçılar, vapur güvertesi, kediyle çalışma masası ve pencere kenarı filtre kahveleri.
- **İşbirliği Ölçeği:** Milyonluk küresel holdingler yerine mahalle 3. nesil kahvecileri (₺2.000 - ₺2.500), butik seramik atölyeleri, bağımsız yayınevleri ve bez çanta üreticileri ile samimi, dürüst ortaklıklar.
- **İçerik Zamanlaması:** Paylaşımlar için en yüksek organik etkileşim saatlerine dayanan haftalık içerik takvimi ve samimi, arkadaşça açıklamalar.

---

## 2. Sistem Mimarisi & Teknoloji Yığını

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4.
- **Tipografi:** 
  - Başlıklar / Wordmark: `Syne` (modern display font)
  - Gövde / Metinler: `Plus Jakarta Sans` (temiz, okunabilir sans-serif)
  - Kod / Metrikler: `JetBrains Mono` (monospace)
- **İkon Seti:** `lucide-react`.
- **Backend:** Node.js + Express.js (`server.ts`) ile full-stack mimari. Vite geliştirme ortamında `vite.middlewares` ile Express içine bağlanır (`"dev": "tsx server.ts"`).
- **Yapay Zeka Entegrasyonları:**
  - Metin & Zeka Motoru: `@google/genai` (Model: `gemini-3.8-flash` - Açıklama üretimi, Karakter DNA analizi, Takipçi yanıt simülasyonu).
  - Görsel Çıktı Motoru: Generative AI endpoint'i (`image.pollinations.ai` veya `gemini-3.1-flash-lite-image`/`imagen-3.0`) + yüksek çözünürlüklü gerçekçi fallback mekanizması (429 kota aşımında sıfır kesinti).

---

## 3. Temel Veri Modelleri (TypeScript Types)

### 3.1. Influencer & İçerik Veri Modelleri (`src/types/influencer.ts`)
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
  visualLock: string; // Karakterin yüz/saç/ten oranlarını sabitleyen prompt kilidi
  voiceTone: string;  // "Samimi, mütevazı, içten, günlük arkadaşça konuşma dili"
  targetAudience: string;
  signatureStyle: string;
  stats: {
    followers: string;      // Örn: '4.8K'
    followersCount: number; // 4820
    engagementRate: string; // '%7.8'
    postsCount: number;
    monthlyEarnings: string;// '₺7.500'
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
  likes: number;          // 250 - 650 arası gerçekçi mikro rakamlar
  commentsCount: number;  // 15 - 50 arası samimi yorumlar
  isFavorite: boolean;
  caption?: string;
  hashtags?: string[];
  scheduledDate?: string; // Format: 'YYYY-MM-DD HH:mm' (Örn: '2026-09-25 11:30')
  brandTag?: string;      // Örn: 'Köz Kahve', 'Toprak Seramik'
}

export interface BrandDeal {
  id: string;
  brandName: string;
  category: 'Fashion' | 'Tech' | 'Beauty' | 'Lifestyle';
  logoText: string;
  deliverables: string;   // '1x Samimi Feed Karesi, 2x Story'
  budget: string;         // '₺2.500'
  rawBudget: number;      // 2500
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

### 3.2. Stil Seçici & Takvim Modelleri (`src/data/stylePresets.ts`)
```typescript
export interface AestheticFilter {
  id: string;
  name: string;
  badge: string;
  description: string;
  colorHex: string;
  promptModifier: string;
  tags: string[];
}

export interface CameraLensPreset {
  id: string;
  name: string;
  focalLength: string;
  aperture: string;
  bestFor: string;
  promptModifier: string;
}

export interface LightingQualityPreset {
  id: string;
  name: string;
  temperature: string;
  vibe: string;
  promptModifier: string;
}

export interface DailyMoodPreset {
  id: string;
  label: string;
  iconName: string;
  promptModifier: string;
}

export interface StyleConfig {
  filter: AestheticFilter;
  lens: CameraLensPreset;
  lighting: LightingQualityPreset;
  mood: DailyMoodPreset;
  grainLevel: 'none' | 'subtle' | 'vintage';
  colorTemp: 'cool' | 'neutral' | 'warm';
  bokehLevel: 'subtle' | 'balanced' | 'deep';
}
```

---

## 4. Altı Temel Modül & İş Mantığı (Core Functional Modules)

### Modül 1: AI Fotoğraf Stüdyosu (Photo Studio & Style Engine)
1. **Görsel DNA & Tutarlılık Kilidi (Consistency Anchor):**
   - Karakterin fiziksel yüz/saç/ten tarifi (`visualLock`), üretilen her fotoğrafın başına otomatik enjekte edilir.
   - *Örnek:* `"24-year-old approachable, natural everyday Turkish person named Ece, warm hazel eyes, messy wavy dark brown shoulder-length bob hair, natural radiant unmade skin, casual warm genuine smile..."`
2. **AI Görsel Stil & Estetik Seçici (Visual Style & Aesthetic Engine):**
   - **Estetik Filtreler:** 
     - *Kadıköy 35mm Analog Film* (Kodak Portra sıcaklığı, organik film greni)
     - *Filtresiz Doğal iPhone Anı* (Raw unposed, gerçekçi mobil açı)
     - *Fujifilm Classic Chrome* (Muted sakin yeşiller, dergi estetiği)
     - *Nordik Cozy & Toprak* (Krem/bej tonları, hygge sakinliği)
     - *Yağmurlu Sonbahar Melankolisi* (Islak yansımalar, sonbahar yaprakları)
     - *Altın Saat Sıcak Işıltı* (Kehribar rim light, saç parıltısı)
   - **Kamera Lensleri:** 35mm f/1.4, 50mm f/1.8, 24mm f/2.8, 85mm f/1.8, iPhone 15 Pro (24mm mobil).
   - **Işık Kalitesi & Sıcaklık:** Tül perde sabah ışığı (5000K), Kafe sıcak akkor ampul (2700K), Bulutlu gökyüzü yumuşak ışığı (5800K), Akşamüstü ters ışık (3000K).
   - **İnce Ayar & Mood:** Analog Film Greni (Yok/Hafif/Vintage), Renk Sıcaklığı (Soğuk/Nötr/Sıcak), Fluluk (Net/Dengeli/Yoğun Bokeh), Günlük Ruh Hali rozetleri.
   - **AI ile Otomatik Eşle (Smart Auto-Match):** Seçilen mekan ve kıyafete göre en uygun lens, ışık ve filtre kombinasyonunu tek tıkla otomatik eşleyen yapay zeka algoritması.
3. **3 Farklı Açıdan Sürekli Seri Çekim & Dual-Mode Triptych Vitrini (Multi-Angle Consistency Shoot):**
   - Karakter yüzü, saç tipi, ten tonu ve üzerindeki kıyafet (kumaş, kesim ve renk) kesinlikle değişmeden ve bozulmadan aynı mekan/ışık altında 3 farklı fotoğrafik perspektiften senkronize üretilir:
     - **Açı 1: Geniş Çevre Planı (Wide Angle 24mm):** Boydan / belden kadraj, mekanın ambiyansı ve tam kombin görünümü.
     - **Açı 2: Samimi Orta Plan Portre (Medium 50mm):** Göğüs hizası, yürürken arkaya dönüp gülümseme ve kıyafet doku detayı.
     - **Açı 3: Sinematik Profil & Yakın Detay (Close-Up 85mm):** Yüz ifadesi, rüzgarda saç telleri, gün batımına bakış ve kremamsı bokeh.
   - **Dual-Mode Vitrin Mimarisi (`seriesViewMode: 'triple' | 'single'`):**
     - Seri çekim tamamlandığında ekranda yalnızca son kare yerine, doğrudan **3 Açıyı Yan Yana Gör (Triptych Vitrini)** açılır. 3 açı aynı anda ekranda yüksek çözünürlükte, açı ve lens rozetleriyle görüntülenir.
     - Dileyen kullanıcı **"Tekil Büyüteç Modu"**na geçerek üstteki 1-2-3 sekme çubuğuyla istediği açıyı dev boyutta inceleyebilir.
     - **"Tam Ekran Karşılaştır"** modalı ile 3 açı tam ekran modal lightbox üzerinde yan yana kıyaslanabilir.
     - Galerideki herhangi bir seriye ait fotoğrafa tıklandığında `seriesId` ile 3 açı otomatik tespit edilip triptych vitrinine yüklenir.
   - Deterministic seed offsetleme (`baseSeed`, `baseSeed+1`, `baseSeed+2`) ile yüz ve kıyafet tutarlılığı en üst düzeye çıkarılır.
   - Üretilen 3 kare tek tıkla Instagram çoklu kaydırmalı (Carousel) post olarak Feed Planlayıcıya aktarılabilir veya topluca 3x PNG olarak indirilebilir.
4. **Mekan & Kıyafet Presetleri:**
   - Mahalle kahvecisinde pencere kenarı, Sahaflar Çarşısı, kedi uyurken ev çalışma masası, Moda Sahili Kadıköy (akşam yürüyüşü & deniz), Moda sahil çimleri, Kadıköy vapur güvertesi, yağmurlu sonbahar sokakları, metro yolculuğu.
5. **Çıktı & Aksiyonlar:**
   - Görseli HTML5 Canvas ile filigranlı/orijinal PNG olarak doğrudan indirme.
   - Çekilen fotoğrafı tek tıkla **Feed Planlayıcıya Gönderme** veya **Açıklama Sihirbazına Açma**.

### Modül 2: Persona & DNA Kimlik Merkezi (Persona DNA Hub)
1. **Çoklu Persona Profilleri:**
   - `Ece Deniz` (24 yaş, Kadıköy, Grafik Tasarımcı, Kitap & Kahve, 4.8K takipçi, ₺7.500/ay).
   - `Can Yalçın` (26 yaş, Moda, Şehir Plancısı, 35mm Fotoğraf & Bisiklet, 3.2K takipçi, ₺4.800/ay).
   - `Zeynep Doğa` (23 yaş, Üsküdar, Biyoloji Öğrencisi, Ev Bitkileri, 6.1K takipçi, ₺8.200/ay).
   - "Yeni Persona Ekle" sihirbazı.
2. **Kimlik & DNA Düzenleyici:** İsim, kullanıcı adı, biyografi, ses tonu, imza stil kuralları, hedef kitle ve görsel kilit metnini anında güncelleme.
3. **Gemini ile Optimize Et:** `POST /api/generate-persona` çağrısıyla karakterin arka plan hikayesini ve görsel promptunu yapay zeka ile zenginleştirme.

### Modül 3: Görsel Feed Planlayıcı & Haftalık İçerik Takvimi (Visual Feed & Calendar)
1. **İkili Görünüm Anahtarı (Grid / Calendar Switcher):**
   - **9-Grid Instagram Önizlemesi:** Profil resmi, hikaye halkaları, kullanıcı adı, doğrulanmış rozet, gönderi/takipçi sayaçları, kare grid hücreleri, hover beğeni/yorum sayaçları.
   - **Haftalık İçerik Takvimi (Weekly Content Calendar):**
     - Pazartesi’den Pazar’a 7 günlük tam zamanlı yayın akışı şeması.
     - **Bugün Vurgusu:** İçinde bulunulan gün (Cuma, 25 Eylül) özel canlı rozet ve renk tonuyla gösterilir.
     - **Pik Etkileşim Saati:** Her gün için takipçilerin en aktif olduğu ideal paylaşım saati (Pazartesi 12:30, Çarşamba 18:00, Cuma 11:30 vb.).
     - **Gönderi Kartları:** Yayın saati rozeti, görsel önizlemesi, marka işbirliği etiketi (`#KözKahve`), beğeni/yorum tahminleri.
     - **Hızlı Saat & Gün Değiştirme (Reschedule Modalı):** Gönderinin yayın tarihini ve saatini saniyeler içinde güncelleme.
     - **Boş Günlere Gönderi Atama ("Bu Güne Gönderi Ekle"):** Kütüphanedeki fotoğrafları seçerek veya stüdyodan yeni çekim yaparak güne bağlama.
2. **AI Açıklama & Hashtag Sihirbazı:**
   - Ses tonu seçenekleri: *"Samimi & Günlük Hayat"*, *"Mütevazı & Düşünceli"*, *"Hafif Esprili & Doğal"*, *"Sakin & Dingin"*.
   - Marka işbirliği etiketi (#işbirliği) opsiyonu.
   - Gemini 3.8 Flash kullanarak doğal Türkçe açıklama metni, dikkat çekici giriş cümlesi (hook), takipçilere yönelik samimi soru (CTA) ve ilgili hashtagler üretir.
   - Tek tıkla "Panoya Kopyala" ve yayın zamanlayıcısına kaydetme.

### Modül 4: Butik & Yerel Marka İşbirlikleri (Brand Deals Hub)
1. **İşbirliği Takip Tablosu:**
   - Anlaşma durumları: `Teklif`, `Hazırlanıyor`, `Onayda`, `Yayınlandı`.
   - Gerçekçi yerel bütçeler: `₺1.400` - `₺2.500`.
   - Çıktılar: Örn. `1x Samimi Feed Karesi, 2x Doğal Story`.
2. **"Bu Marka İçin Stüdyoda Çekim Başlat":** Tek tıkla stüdyo modülüne yönlendirip markanın ürün kategorisine uygun mekanı ve kıyafeti hazır seçer.
3. **Yeni İşbirliği Ekleme Modalı:** Bütçe, marka adı, kategori ve brief ile yeni anlaşma kaydı.

### Modül 5: Topluluk & Etkileşim Simülatörü (Analytics & Community)
1. **Canlı Takipçi Yorumları Akışı:** Takipçilerden gelen samimi sorular (örn: *"Ece kazağın nereden acaba?"*, *"Bu kahvecinin adı ne?"*).
2. **AI Karakter Yanıtı:** *"Karakterin Sesiyle Yanıtla"* tıklandığında, karakterin tanımlı ses tonuna ve kimliğine göre doğal, içten Türkçe yanıt üretir.
3. **Kitle & Demografi Grafikleri:** En çok takip edilen semt/şehirler (Kadıköy, Moda, Urla, Çankaya), yaş dağılımı (%82 Z ve Y kuşağı), cinsiyet oranı ve takipçi duygu analizi (%94 pozitif).

### Modül 6: Resmi Medya Kiti & Fiyat Tarifesi (Media Kit Exporter)
1. **Mikro-Influencer Fiyat Listesi:**
   - 1x Samimi Feed Fotoğrafı & İnceleme: `₺2.500`
   - 2x Doğal Hikaye (Story & Link): `₺1.200`
   - 1x Samimi Reels / Video & Deneyim: `₺3.500`
   - Yerel Marka Dostluğu (3 Aylık Düzenli Ortaklık): `₺8.000`
2. **Yazdır / PDF Olarak Kaydet:** Tarayıcının yazdırma (`window.print()`) desteğiyle ajanslara ve kafelere sunulmaya hazır temiz medya kiti çıktısı.

---

## 5. Prompt Mühendisliği & Matematiksel Formül

Tüm görsel üretiminde modelin yapay veya plastik ("plastic doll") görünmesini engelleyen katmanlı prompt formülü:

```text
[Constructed Prompt] = 
  {includeConsistencyLock ? persona.visualLock + ', ' : ''}
  + {selectedOutfit.prompt} + ', '
  + {selectedPose.prompt} + ', '
  + {selectedEnv.prompt} + ', '
  + {styleConfig.filter.promptModifier} + ', '
  + {styleConfig.lens.promptModifier} + ', '
  + {styleConfig.lighting.promptModifier} + ', '
  + {styleConfig.mood.promptModifier} + ', '
  + {grainPrompt} + ', '
  + {tempPrompt} + ', '
  + {bokehPrompt}
  + {customDetail ? ', ' + customDetail : ''}
```

### Kesin Kurallar:
- **Yasaklı Terimler:** Asla `"plastic skin"`, `"vogue hyperglam"`, `"flawless doll skin"`, `"photoshop beauty retouch"` kullanılmaz.
- **Zorunlu Doğallık Terimleri:** `"authentic natural everyday lifestyle photography"`, `"candid real person portrait"`, `"realistic natural unedited skin texture"`, `"unposed snapshot"`, `"warm natural daylight"`, `"shot on 35mm natural lens"`, `"true-to-life realism"`.

---

## 6. Backend API Spesifikasyonları (`server.ts`)

### 6.1. `POST /api/generate-photo`
- **İstek Gövdesi:**
  ```json
  {
    "prompt": "string",
    "aspectRatio": "1:1 | 3:4 | 4:3 | 9:16 | 16:9",
    "personaName": "Ece Deniz",
    "environment": "Mahalle Kahvecisi",
    "outfit": "Oversized Yün Kazak",
    "cameraPreset": "35mm f/1.4 (Kadıköy 35mm Analog)"
  }
  ```
- **Mantık:** 
  - En-boy oranı boyut eşlemesi (`1:1` -> `1024x1024`, `3:4` -> `768x1024`, `9:16` -> `576x1024`).
  - Doğal insan yaşamı prompt takviyesi ile `image.pollinations.ai` URL üretimi.
  - Quota 429 hatası oluşturmadan saniyeler içinde yüksek çözünürlüklü görsel URL'i dönüşü.
- **Yanıt:**
  ```json
  {
    "success": true,
    "imageUrl": "https://...",
    "prompt": "enhanced prompt...",
    "seed": 123456
  }
  ```

### 6.2. `POST /api/generate-photo-series` (3 Açılı Sürekli Seri Çekim)
- **Amaç:** Aynı karakter ve aynı kıyafet bozulmadan 1 geniş çevre, 1 samimi orta plan ve 1 yakın profil açı üretmek.
- **İstek Gövdesi:**
  ```json
  {
    "personaName": "Ece Deniz",
    "visualLock": "24-year-old approachable, natural everyday Turkish person named Ece, warm hazel eyes, messy wavy dark brown shoulder-length bob hair, natural radiant unmade skin, casual warm genuine smile...",
    "environment": "Moda Sahili Kadıköy (Akşam Yürüyüşü & Deniz)",
    "outfit": "İkinci El Deri Ceket & Beyaz Tişört",
    "cameraPreset": "35mm f/1.4 (Kadıköy 35mm Analog)",
    "lighting": "Akşamüstü Ters Işık · 3000K",
    "aspectRatio": "3:4",
    "customDetail": "deniz esintisi, hafif rüzgar",
    "basePrompt": "..."
  }
  ```
- **Açı Kompozisyon Formülleri & Seed Offsetleme:**
  - `Açı 1 (Wide)`: `baseSeed + 0` | `"full-length environmental wide angle shot, capturing the model walking naturally in the scene with full body and complete outfit visible, atmospheric background scenery, shot on 24mm wide angle lens"`
  - `Açı 2 (Medium)`: `baseSeed + 1` | `"medium shot from waist up, candid three-quarter turn towards the camera with a gentle authentic smile, detailed view of the jacket and top outfit texture, genuine eye-contact, shot on 50mm eye-level prime lens"`
  - `Açı 3 (Close-Up)`: `baseSeed + 2` | `"cinematic intimate close-up side profile portrait, gazing out thoughtfully at the scenery, gentle breeze catching strands of hair, fine collar and fabric detail, shallow depth of field with creamy bokeh, shot on 85mm portrait telephoto lens"`
- **Yanıt Gövdesi:**
  ```json
  {
    "success": true,
    "seriesId": "series-1740000000000",
    "baseSeed": 458921,
    "photos": [
      {
        "id": "photo-...-wide",
        "title": "Moda Sahili (Geniş Çevre Planı)",
        "url": "https://...",
        "aspectRatio": "3:4",
        "prompt": "...",
        "environment": "Moda Sahili Kadıköy (Akşam Yürüyüşü & Deniz)",
        "outfit": "İkinci El Deri Ceket & Beyaz Tişört",
        "angleType": "wide",
        "angleLabel": "Geniş Çevre Planı (Wide)",
        "seriesId": "series-..."
      },
      { "id": "...-medium", "angleType": "medium", ... },
      { "id": "...-closeup", "angleType": "closeup", ... }
    ],
    "note": "Aynı kadın ve aynı kıyafetle 3 farklı açıdan seri çekim tamamlandı."
  }
  ```

### 6.3. `POST /api/generate-caption`
- **İstek Gövdesi:**
  ```json
  {
    "personaName": "Ece Deniz",
    "niche": "Günlük Yaşam & Kahve",
    "tone": "Samimi & Günlük Hayat",
    "context": "Pazar kahvesi ve kitap okuma",
    "language": "tr",
    "sponsorBrand": "Köz Kahve"
  }
  ```
- **Model:** `gemini-3.8-flash`
- **System Instruction:**
  ```text
  You are a relatable, down-to-earth everyday young person (${personaName}) living a normal, cozy life in Istanbul.
  You are NOT a celebrity or luxury model. You have around 4,800 real friends/followers who love your simple, authentic everyday lifestyle.
  Tone: ${tone} (Natural, candid, warm, slightly playful, friendly everyday conversational Turkish).
  Task: Write a short, authentic social media caption with cozy emojis for: "${context}".
  If in collaboration with ${sponsorBrand}, mention it naturally like recommending to a friend.
  Respond STRICTLY in JSON: { "caption", "hook", "cta", "hashtags", "voiceAnalysis" }
  ```

### 6.3. `POST /api/generate-persona`
- **Girdi:** `{ "name": "string", "niche": "string", "vibe": "string" }`
- **Model:** `gemini-3.8-flash`
- **Çıktı JSON:** `{ "name", "handle", "bio", "age", "visualLock", "voiceTone", "targetAudience", "signatureAesthetic" }`

### 6.4. `POST /api/simulate-reply`
- **Girdi:** `{ "comment": "string", "personaName": "string", "personaTone": "string" }`
- **Model:** `gemini-3.8-flash`
- **Mantık:** Takipçiye arkadaşça, 1 cümlelik, samimi ve sıcak Türkçe yanıt üretir.

---

## 7. Dosya Ağacı & Bileşen Yapısı

```
/
├── server.ts                       # Express + Gemini API + Vite middleware
├── package.json                    # Bağımlılıklar (react 19, @google/genai, lucide-react)
├── index.html                      # HTML5 kabuğu + Syne / Plus Jakarta Sans fontları
├── metadata.json                   # AI Studio applet tanımlayıcısı
├── SKILL.md                        # Ana sistem mimarisi, prompt formülü ve geliştirici kılavuzu
├── SUMMER_BEACH_SCENES.md          # 50+ Doğal Yaz, Plaj, Ege/Akdeniz Koyu ve Sahil Kasabası Sahnesi
├── src/
│   ├── main.tsx                    # React kök başlatıcı
│   ├── App.tsx                     # Ana sekme yönetimi, global state, toast ve modallar
│   ├── index.css                   # Tailwind v4 importları ve font aileleri
│   ├── types/
│   │   └── influencer.ts           # PersonaProfile, GeneratedPhoto, BrandDeal, FanComment
│   ├── data/
│   │   ├── mockData.ts             # Ece Deniz, Can Yalçın, Zeynep Doğa başlangıç verileri
│   │   └── stylePresets.ts         # Lensler, Estetik Filtreler, Işık Kalitesi, Günlük Mood
│   └── components/
│       ├── Navbar.tsx              # Üst navigasyon barı (Sekmeler, Medya Kiti, Hızlı Çekim)
│       ├── PhotoStudio.tsx         # AI Stüdyo + Canvas/PNG export + Prompt önizleme
│       ├── AIStyleSelector.tsx     # Filtreler, lensler, ışık, ince ayarlar ve AI Otomatik Eşleme
│       ├── PhotoRenderer.tsx       # Yumuşak yükleme, en-boy oranı koruma ve görsel render
│       ├── FeedPlanner.tsx         # 9-Grid önizleme + Takvim geçişi + AI Açıklama Sihirbazı
│       ├── WeeklyCalendarView.tsx  # 7 Günlük Haftalık İçerik Takvimi, Pik Saatler & Reschedule
│       ├── PersonaDNA.tsx          # Karakter kartı, Tutarlılık kilidi & Gemini optimizasyonu
│       ├── BrandDeals.tsx          # Butik anlaşmalar panosu & Stüdyoya çekim yönlendirme
│       ├── AnalyticsCommunity.tsx  # Takipçi yorumları, AI Karakter yanıtı ve demografi
│       └── MediaKitModal.tsx       # Yazdırılabilir / PDF resmi mikro-influencer medya kiti
```

---

## 8. Adım Adım Kurulum & Çalıştırma (Run Commands)

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın (Node Express + Vite entegre)
npm run dev

# 3. TypeScript ve derleme kontrolü
npx tsc --noEmit
npm run build
```

Bu skill belgesi; projenin tüm mantığını, görsel felsefesini, arayüz bileşenlerini ve yapay zeka prompt mühendisliği kurallarını eksiksiz içerir. Herhangi bir kodlama yapay zekası bu belgeyi okuduğunda projeyi baştan sona tek seferde sorunsuz olarak inşa edebilir.
