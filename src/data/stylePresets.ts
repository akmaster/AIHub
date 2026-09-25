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

export const AESTHETIC_FILTERS: AestheticFilter[] = [
  {
    id: 'analog-35mm',
    name: 'Kadıköy 35mm Analog Film',
    badge: '35mm Film',
    description: 'Sıcak Kodak Portra 400 tonları, yumuşak organik gren, nostaljik nostalji',
    colorHex: '#F59E0B',
    promptModifier: 'shot on 35mm Kodak Portra 400 analog film stock, gentle organic warm film grain, natural rich color science, authentic nostalgic lifestyle photograph',
    tags: ['Nostaljik', 'Sıcak', 'Analog'],
  },
  {
    id: 'iphone-candid',
    name: 'Filtresiz Doğal iPhone Anı',
    badge: 'iPhone Raw',
    description: 'Gerçekçi cilt dokusu, unposed spontane açı, filtresiz sokak gerçekliği',
    colorHex: '#10B981',
    promptModifier: 'unedited raw iPhone snapshot, authentic unposed candid angle, natural unpolished skin texture, realistic everyday ambient light, candid mobile photography',
    tags: ['Doğal', 'Filtresiz', 'Spontane'],
  },
  {
    id: 'fuji-classic',
    name: 'Fujifilm Classic Chrome',
    badge: 'Fuji X100V',
    description: 'Yumuşak kontrast, dingin yeşil ve toprak tonları, bağımsız dergi havası',
    colorHex: '#3B82F6',
    promptModifier: 'Fujifilm Classic Chrome color profile, muted film saturation, subtle contrast, indie lifestyle magazine editorial, soft cinematic tones',
    tags: ['Dergi', 'Sakin', 'Vintage'],
  },
  {
    id: 'nordic-cozy',
    name: 'Nordik Cozy & Toprak',
    badge: 'Hygge Yaşam',
    description: 'Krem, bej ve adaçayı yeşili, yumuşak sabah dinginliği, hygge hissi',
    colorHex: '#8B5CF6',
    promptModifier: 'Nordic minimalist cozy palette, soft cream and warm beige tones, gentle diffuse shadow falloff, peaceful quiet lifestyle atmosphere',
    tags: ['Minimalist', 'Krem', 'Hygge'],
  },
  {
    id: 'rainy-mood',
    name: 'Yağmurlu Sonbahar Melankolisi',
    badge: 'Islak Şehir',
    description: 'Hafif sisli gökyüzü, ıslak parke taşı yansımaları, sonbahar yaprakları',
    colorHex: '#64748B',
    promptModifier: 'melancholic rainy autumn atmosphere, misty soft overcast sky, reflections on wet cobblestone pavement, cool moody tones with warm orange coffee shop glow',
    tags: ['Sonbahar', 'Yağmur', 'Muted'],
  },
  {
    id: 'golden-hour',
    name: 'Altın Saat Sıcak Işıltı',
    badge: 'Gün Batımı',
    description: 'Balkondan sızan ılık kehribar güneş ışığı, saç kenarlarında altın ışıltı',
    colorHex: '#EC4899',
    promptModifier: 'radiant late afternoon golden hour sunlight, warm amber rim lighting outlining hair, soft lens flare, cozy glowing sunset warmth',
    tags: ['Altın Saat', 'Işıltılı', 'Sıcak'],
  },
];

export const CAMERA_LENSES: CameraLensPreset[] = [
  {
    id: 'lens-35mm',
    name: '35mm f/1.4 (Sokak & Kafe Klasik)',
    focalLength: '35mm',
    aperture: 'f/1.4',
    bestFor: 'Çevreyle birlikte doğal model çekimi',
    promptModifier: 'shot on 35mm prime lens at f/1.4, environmental street portraiture, natural perspective with gentle background separation',
  },
  {
    id: 'lens-50mm',
    name: '50mm f/1.8 (Doğal İnsan Gözü)',
    focalLength: '50mm',
    aperture: 'f/1.8',
    bestFor: 'Dengeli samimi portreler',
    promptModifier: 'shot on 50mm nifty fifty prime lens at f/1.8, human eye field of view, crisp natural subject sharpness, creamy smooth bokeh',
  },
  {
    id: 'lens-24mm',
    name: '24mm f/2.8 (Geniş Açı Günlük)',
    focalLength: '24mm',
    aperture: 'f/2.8',
    bestFor: 'Masa, kitapçı ve kafe atmosferi',
    promptModifier: 'shot on 24mm wide angle lens, immersive lifestyle framing showing room and interior context, deep focus realism',
  },
  {
    id: 'lens-85mm',
    name: '85mm f/1.8 (Detay Yüz & Bakış)',
    focalLength: '85mm',
    aperture: 'f/1.8',
    bestFor: 'Duygusal yakın portre ve fincan detayı',
    promptModifier: 'shot on 85mm portrait telephoto lens at f/1.8, flattering compression, dreamy defocused background, tight intimate portrait',
  },
  {
    id: 'lens-iphone',
    name: 'iPhone 15 Ana Kamera (24mm Mobil)',
    focalLength: '24mm',
    aperture: 'f/1.78',
    bestFor: 'Filtresiz arkadaş çekimi samimiyeti',
    promptModifier: 'iPhone 15 Pro 24mm equivalent camera snapshot, natural mobile depth of field, authentic handheld everyday framing',
  },
];

export const LIGHTING_QUALITIES: LightingQualityPreset[] = [
  {
    id: 'light-window',
    name: 'Pencereden Sızan Tül Perde Işığı',
    temperature: '5000K Doğal',
    vibe: 'Yumuşak & Dingin',
    promptModifier: 'soft diffused morning daylight filtering gently through sheer linen window curtain, subtle wrap-around lighting on face',
  },
  {
    id: 'light-cafe-tungsten',
    name: 'Kafe Sıcak Akkor Ampul Işığı',
    temperature: '2700K Sıcak',
    vibe: 'Samimi & Nostaljik',
    promptModifier: 'cozy ambient indoor cafe incandescent lighting, warm 2700K amber glow casting gentle warm shadows, intimate coffee shop mood',
  },
  {
    id: 'light-cloudy-diffuse',
    name: 'Bulutlu Gökyüzü Yumuşak Işık',
    temperature: '5800K Nötr',
    vibe: 'Gölgesiz & Gerçekçi',
    promptModifier: 'overcast cloudy daylight, shadowless gentle illumination, true unedited skin tones, calm natural outdoor ambiance',
  },
  {
    id: 'light-golden-backlit',
    name: 'Akşamüstü Ters Işık & Saç Parıltısı',
    temperature: '3000K Kehribar',
    vibe: 'Büyüleyici & Sıcak',
    promptModifier: 'backlit by low warm golden hour sun, soft luminous amber halo around hair, warm cinematic natural contrast',
  },
];

export const DAILY_MOODS: DailyMoodPreset[] = [
  {
    id: 'mood-coffee',
    label: 'Kahve & Kitap Keyfi',
    iconName: 'Coffee',
    promptModifier: 'casual coffee and reading mood, peaceful candid moment, unposed quiet relaxation',
  },
  {
    id: 'mood-walk',
    label: 'Mahalle Yürüyüşü',
    iconName: 'Footprints',
    promptModifier: 'brisk casual walk through neighborhood, wind blowing slightly in hair, candid street stride',
  },
  {
    id: 'mood-lazy-sunday',
    label: 'Pazar Tembelliği',
    iconName: 'Sun',
    promptModifier: 'relaxed lazy sunday morning at home, cozy loungewear, soft bed or sofa, sleepy gentle smile',
  },
  {
    id: 'mood-work-design',
    label: 'Masa Başı & Çizim',
    iconName: 'Laptop',
    promptModifier: 'creative work focus, messy desk with notebook and coffee mug, focused gentle candid gaze',
  },
];
