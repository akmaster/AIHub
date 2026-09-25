# 🎬 3 Açılı Senkronize Çekim & Çoklu Görünüm Güncellemesi (TRIPLE_ANGLE_VIEWER_UPDATE.md)

Bu doküman, sanal influencer stüdyosunda tek tıkla üretilen **3 farklı kamera açısının (Geniş Çevre Planı 24mm, Samimi Orta Plan 50mm, Yakın Profil 85mm)** ekranda yalnızca sonuncusunun görünmesi problemini ortadan kaldıran ve sistemi **Dual-Mode (3'lü Yan Yana Triptych Vitrini & Tekil Açı Büyüteç Modu)** mimarisine kavuşturan güncellemenin eksiksiz özetidir.

---

## 🔍 Yaşanan Problem & Kök Neden Analizi (Root Cause Analysis)

1. **Önceki Durum:**
   - 3 açı sırayla üretiliyordu (`Açı 1/3: Geniş`, `Açı 2/3: Orta`, `Açı 3/3: Yakın`).
   - Önizleme paneli yalnızca tek bir büyük fotoğraf (`activePreviewPhoto`) render edecek şekilde tasarlanmıştı.
   - Seri çekim tamamlandığında büyük önizleme alanında yalnızca en son tamamlanan kare (veya ilk kare) kalıyor, diğer 2 kare sayfanın altında küçük resimler olarak kayboluyordu. Kullanıcı diğer açıları aynı anda göremiyordu ("sadece sonuncuyu görebiliyorum" geri bildirimi).
   - Galeriden veya feed'den fotoğrafa tıklandığında yalnızca tıklanan tekil kare seçiliyor, serinin diğer açıları ekrana gelmiyordu.

2. **Çözülen Yeni Mimari:**
   - **Otomatik 3'lü Triptych Vitrini (`seriesViewMode: 'triple'`):** Seri çekim bittiği an, önizleme alanı tek resim yerine 3 sütunlu geniş vitrine dönüşür. 3 açı aynı anda, eşit büyüklükte, açı rozetleri ve lens bilgileriyle (%100 görünür) yan yana dizilir.
   - **Çift Modlu Görünüm Seçici (Dual-Mode Switcher):**
     - `[ 3 Açıyı Yan Yana Gör (Triptych) ]`: 3 açıyı aynı anda karşılaştırma imkanı.
     - `[ Tekil Büyüteç ]`: Seçili açıyı dev ekranda detaylı inceleme modu (üstteki 1-2-3 sekme çubuğu ile anında açılar arası geçiş).
   - **Akıllı Galeri İlişkilendirmesi (`seriesId` Lookup):** Galeride veya geçmiş çekimlerde bir seriye ait herhangi bir fotoğrafa tıklandığında, sistem kardeş açıları otomatik bulur, sıralar (`wide` -> `medium` -> `closeup`) ve 3'lü vitrini anında açar.
   - **Instagram Carousel Desteği (`FeedPlanner`):** 3 açı feed'e gönderildiğinde Instagram kaydırmalı çoklu gönderi (Carousel post) olarak gruplanır ve slaytlar arasında gezilebilir.
   - **Tam Ekran Karşılaştırma Modalı:** Yüz simetrisini, ten dokusunu ve kıyafet kumaş detaylarını ultra yüksek çözünürlükte yan yana denetleme imkanı.

---

## 🛠️ Yapılan Kod ve Bileşen Değişiklikleri

### 1. `src/components/PhotoStudio.tsx`
- **Yeni State Yönetimi:**
  ```typescript
  const [seriesViewMode, setSeriesViewMode] = useState<'triple' | 'single'>('triple');
  const [isComparingSeries, setIsComparingSeries] = useState<boolean>(false);
  ```
- **Seri Üretimi Sonrası Otomatik 3'lü Mod Tetikleme:**
  ```typescript
  // handleGenerateTripleSeries tamamlandığında:
  setLastGeneratedSeries(seriesPhotos);
  setSelectedSeriesAngleIndex(0);
  setActivePreviewPhoto(seriesPhotos[0]);
  setSeriesViewMode('triple'); // 3 açıyı anında yan yana yerleştirir
  ```
- **3 Sütunlu Senkronize Vitrin (`grid-cols-1 sm:grid-cols-3`):**
  - **Açı 1 (Geniş Plan 24mm):** Mavi/İndigo rozet, boydan çevre ve mekan görünümü.
  - **Açı 2 (Samimi Orta Plan 50mm):** Pembe/Rose rozet, bel/göğüs ve kombin kumaş örgüsü.
  - **Açı 3 (Yakın Profil & Bokeh 85mm):** Amber/Altın rozet, yüz oranları, rüzgarda saç telleri ve kremamsı bokeh.
  - Her kart üzerinde doğrudan **"Büyüt"** ve **"PNG İndir"** butonları.
- **Tekil Modda 3'lü Açı Sekme Çubuğu:**
  - `[ 1. Açı: Geniş (24mm) ]` · `[ 2. Açı: Orta (50mm) ]` · `[ 3. Açı: Yakın (85mm) ]`
- **Galeriden Tıklamada 3 Açıyı Geri Getirme:**
  ```typescript
  onClick={() => {
    setActivePreviewPhoto(photo);
    if (photo.seriesId) {
      const matching = photos.filter((p) => p.seriesId === photo.seriesId);
      if (matching.length > 0) {
        const order: Record<string, number> = { wide: 0, medium: 1, closeup: 2, standard: 3 };
        const sorted = [...matching].sort((a, b) => (order[a.angleType || 'wide'] || 0) - (order[b.angleType || 'wide'] || 0));
        setLastGeneratedSeries(sorted);
        setSeriesViewMode('triple');
      }
    }
  }}
  ```

### 2. `src/components/FeedPlanner.tsx`
- **Carousel Post Denetleyicisi:**
  - 3'lü seriye ait bir fotoğraf tıklandığında `Instagram Kaydırmalı Seri (Carousel Post · 3 Açı)` paneli açılır.
  - Slaytlar (`1. Slayt`, `2. Slayt`, `3. Slayt`) arasında tıklayarak geçiş yapılabilir.
- **Instagram Izgarasında Carousel Rozeti:**
  - 9'lu profil ızgarasında seriye ait fotoğrafların köşesinde katmanlı Instagram Carousel simgesi (`Layers` ikonu ve sayaç) gösterilir.

### 3. `server.ts` & Mock Veriler (`src/data/mockData.ts`)
- `/api/generate-photo-series` endpoint'i `personaId` bilgisini de karşılayacak şekilde güncellendi.
- Başlangıç verilerine hazır **"Moda Sahili Gün Batımı (3 Açı Serisi)"** eklendi; böylece uygulama ilk açıldığında dahi 3'lü vitrin canlı olarak test edilebilir.

---

## 📋 Kullanım Adımları

1. **Stüdyoya Girin:**
   - Mekan ve kıyafet seçiminizi yapın.
2. **Çekimi Başlatın:**
   - **"3 Farklı Açıdan Çek (Aynı Kadın & Aynı Kıyafet)"** butonuna tıklayın.
3. **Senkronize Vitrinde Görün:**
   - Çekim tamamlandığında ekran artık tek bir kare yerine **aynı anda 3 açıyı yan yana** açar:
     - Sol: `1. Geniş Açı (24mm)`
     - Orta: `2. Samimi Orta Plan (50mm)`
     - Sağ: `3. Yakın Profil (85mm)`
4. **Hızlı Aksiyonlar:**
   - **"3 Açıyı Feed'e Gönder"**: Tek tıkla Instagram Carousel formatında planlayıcıya gönderir.
   - **"Tümünü İndir (3x PNG)"**: 3 açıyı birden kayıpsız formatta indirir.
   - **"Tam Ekran Karşılaştır"**: 3 kareyi tam ekranda yan yana açarak yüz simetrisi ve detay incelemesi sunar.
   - **"Görünüm Seçici"**: Triptych ve Tekil modlar arasında tek tıkla geçiş sağlar.
