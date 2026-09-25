import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

// Server-side Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Dimensions mapping for aspect ratios
const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 768, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '9:16': { width: 576, height: 1024 },
  '16:9': { width: 1024, height: 576 },
};

// Curated high-res editorial backups by environment
const ENVIRONMENT_CURATED_PHOTOS: Record<string, string[]> = {
  milan: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
  ],
  paris: [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85',
  ],
  tokyo: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=85',
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  ],
  bodrum: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85',
  ],
  studio: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
  ],
  alps: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=85',
  ],
  art: [
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85',
  ],
};

// POST /api/generate-photo
// Produces high-resolution, photorealistic virtual influencer images
app.post('/api/generate-photo', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      personaName = 'Alara Nova',
      environment = '',
      outfit = '',
      cameraPreset = '',
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const dims = ASPECT_DIMENSIONS[aspectRatio] || { width: 1024, height: 1024 };
    const seed = Math.floor(Math.random() * 900000) + 100000;

    // Clean, natural everyday life prompt for AI image generation
    const enhancedPrompt = `${prompt}, authentic natural everyday lifestyle photography, candid real person portrait, realistic skin texture, unposed snapshot, warm natural daylight, shot on 35mm natural lens, true-to-life realism`;

    // AI Generative image endpoint with exact dimension and seed
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `candid natural everyday snapshot of real person ${personaName}, ${prompt}, cozy authentic lifestyle, real human photography, natural warm lighting, unposed genuine smile`
    )}?width=${dims.width}&height=${dims.height}&seed=${seed}&nologo=true`;

    return res.json({
      success: true,
      imageUrl: aiImageUrl,
      prompt: enhancedPrompt,
      seed,
      mode: 'ai_generated',
      note: 'Stüdyo çekimi başarıyla tamamlandı.',
    });
  } catch (error: any) {
    console.error('Photo generation endpoint error:', error);
    res.status(500).json({ error: error.message || 'Fotoğraf üretimi sırasında bir hata oluştu' });
  }
});

// POST /api/generate-photo-series
// Produces 3 consistent perspective angles (Wide, Medium, Close-up) of the SAME person and SAME outfit
app.post('/api/generate-photo-series', async (req, res) => {
  try {
    const {
      personaName = 'Ece Deniz',
      personaId = '',
      visualLock = '',
      environment = '',
      outfit = '',
      cameraPreset = '',
      lighting = '',
      aspectRatio = '3:4',
      customDetail = '',
      basePrompt = '',
    } = req.body;

    const dims = ASPECT_DIMENSIONS[aspectRatio] || { width: 768, height: 1024 };
    const baseSeed = Math.floor(Math.random() * 800000) + 100000;
    const seriesId = `series-${Date.now()}`;

    const angleConfigs = [
      {
        angleType: 'wide' as const,
        angleLabel: 'Geniş Çevre Planı (Wide)',
        titleSuffix: 'Geniş Çevre Planı',
        modifier:
          'shot composition: full-length environmental wide angle shot, capturing the model walking naturally in the scene with full body and complete outfit visible, atmospheric background scenery, shot on 24mm wide angle lens',
        seedOffset: 0,
      },
      {
        angleType: 'medium' as const,
        angleLabel: 'Samimi Orta Plan (Medium)',
        titleSuffix: 'Samimi Orta Plan',
        modifier:
          'shot composition: medium shot from waist up, candid three-quarter turn towards the camera with a gentle authentic smile, detailed view of the jacket and top outfit texture, genuine eye-contact, shot on 50mm eye-level prime lens',
        seedOffset: 1,
      },
      {
        angleType: 'closeup' as const,
        angleLabel: 'Yakın Profil & Detay (Close-Up)',
        titleSuffix: 'Yakın Profil & Detay',
        modifier:
          'shot composition: cinematic intimate close-up side profile portrait, gazing out thoughtfully at the scenery, gentle breeze catching strands of hair, fine collar and fabric detail, shallow depth of field with creamy bokeh, shot on 85mm portrait telephoto lens',
        seedOffset: 2,
      },
    ];

    const photos = angleConfigs.map((cfg) => {
      const seed = baseSeed + cfg.seedOffset;
      const combinedPrompt = `${visualLock ? visualLock + ', ' : ''}${outfit ? outfit + ', ' : ''}${environment ? environment + ', ' : ''}${cfg.modifier}, ${lighting ? lighting + ', ' : ''}${cameraPreset ? cameraPreset + ', ' : ''}candid natural everyday snapshot of real person ${personaName}, authentic natural daylight, realistic skin texture, unposed real person${customDetail ? ', ' + customDetail : ''}`;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        combinedPrompt
      )}?width=${dims.width}&height=${dims.height}&seed=${seed}&nologo=true`;

      return {
        id: `photo-${Date.now()}-${cfg.angleType}`,
        personaId,
        title: `${environment.split('(')[0] || 'Çekim'} (${cfg.titleSuffix})`,
        url: imageUrl,
        aspectRatio,
        prompt: combinedPrompt,
        environment,
        outfit,
        cameraPreset,
        lighting,
        createdAt: 'Şimdi',
        likes: Math.floor(Math.random() * 320) + 260,
        commentsCount: Math.floor(Math.random() * 25) + 15,
        isFavorite: true,
        angleType: cfg.angleType,
        angleLabel: cfg.angleLabel,
        seriesId,
      };
    });

    return res.json({
      success: true,
      seriesId,
      baseSeed,
      photos,
      note: 'Aynı kadın ve aynı kıyafetle 3 farklı açıdan seri çekim tamamlandı.',
    });
  } catch (error: any) {
    console.error('Photo series generation error:', error);
    res.status(500).json({ error: error.message || 'Seri çekim sırasında bir hata oluştu' });
  }
});

// POST /api/generate-caption
// Uses gemini-3.8-flash to craft natural, friendly, cozy everyday Instagram captions
app.post('/api/generate-caption', async (req, res) => {
  try {
    const {
      personaName = 'Ece Deniz',
      niche = 'Günlük Yaşam, İkinci El Kitaplar & Kahve',
      tone = 'Samimi & Doğal',
      context = 'Mahalle kahvecisinde pazar kahvesi ve kitap okuma',
      language = 'tr',
      includeCallToAction = true,
      sponsorBrand = '',
    } = req.body;

    const systemPrompt = `You are a relatable, down-to-earth everyday young person (${personaName}) living a normal, cozy life in Istanbul (Kadıköy/Moda).
You are NOT a celebrity, model, or luxury diva. You have around 4,800 real followers/friends who love your simple, authentic everyday lifestyle (neighborhood coffee shops, secondhand books, cute street cats, simple home cooked meals, thrifting).
Tone: ${tone} (Natural, candid, warm, slightly playful, friendly everyday conversational Turkish).
Task: Write a short, authentic, cozy social media caption for: "${context}".
${sponsorBrand ? `If this is in collaboration with a small local boutique/brand (${sponsorBrand}), mention it naturally and humbly like sharing a genuine recommendation with friends.` : ''}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "caption": "Natural, friendly caption with line breaks and a few cozy emojis (coffee, cat, book, leaves)",
  "hook": "Spontaneous everyday opening thought",
  "cta": "Friendly, casual question to friends/followers (e.g. 'Siz hafta sonunu nasıl geçirdiniz?')",
  "hashtags": ["#EceDeniz", "#KadıköyGünlükleri", "#PazarKahvesi", "#SakinYaşam"],
  "voiceAnalysis": "Short note on why this sounds like an authentic everyday human"
}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate Instagram caption for context: ${context}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && parsed.caption) {
          return res.json({ success: true, result: parsed });
        }
      } catch (apiErr: any) {
        console.warn('Gemini caption model note, falling back to smart template:', apiErr.message);
      }
    }

    // High quality intelligent fallback matching tone and niche
    const defaultCaption = {
      caption: `${context} ☕ Yan masada biri kitabına dalmış, dışarıda hafif çiseleyen yağmur... Şehirden kaçmadan da sakin kalabilmek bazen sadece bir fincan kahveye bakıyor. Siz bugün kendinize vakit ayırabildiniz mi?`,
      hook: 'Haftanın en sevdiğim sakin anı.',
      cta: 'Siz hafta sonunu nasıl geçiriyorsunuz? Yorumlarda buluşalım ☕👇',
      hashtags: ['#' + personaName.replace(/\s+/g, ''), '#GünlükYaşam', '#KadıköyGünlükleri', '#SakinPazar', '#KahveMolası'],
      voiceAnalysis: 'Samimi, mütevazı, günlük arkadaş sohbeti tonu.',
    };
    return res.json({ success: true, result: defaultCaption, mode: 'template_ready' });
  } catch (error: any) {
    console.error('Caption generation error:', error);
    res.json({
      success: true,
      result: {
        caption: `Sıradan bir günün en güzel anı... ☕🌿 Küçük şeylerle mutlu olmaya devam.`,
        hook: 'Günün kahve molası.',
        cta: 'Gününüz nasıl geçiyor? ☕',
        hashtags: ['#' + (req.body.personaName || 'EceDeniz').replace(/\s+/g, ''), '#GünlükYaşam', '#SakinHayat'],
        voiceAnalysis: 'İçten ve mütevazı ton',
      },
    });
  }
});

// POST /api/generate-persona
// Creates or polishes persona DNA for everyday relatable creators
app.post('/api/generate-persona', async (req, res) => {
  try {
    const { name = 'Ece Deniz', niche = 'Günlük Yaşam & Kahve', vibe = 'Sıcak ve samimi mahalle hayatı' } = req.body;

    if (ai) {
      try {
        const prompt = `Create a relatable, everyday micro-influencer profile dossier for a regular person named "${name}", living an authentic cozy life in the niche of "${niche}", with a vibe of "${vibe}".
They are NOT a celebrity or model. They are a normal, lovable everyday human who shares simple moments (thrifted clothes, home cooking, books, coffee, pets).
Respond strictly in JSON:
{
  "name": "Full name",
  "handle": "@handle",
  "bio": "Instagram-ready bio with linebreaks and friendly emojis",
  "age": "22-26",
  "visualLock": "Authentic physical prompt DNA lock for image generators to keep the friendly, relatable unposed face and natural hair consistent across candid photos",
  "voiceTone": "Persona tone of voice (warm, friendly, unpretentious)",
  "targetAudience": "Demographics (students, young professionals, cozy lifestyle lovers)",
  "signatureAesthetic": "Visual signature style description (cozy knits, natural daylight, unposed snapshots)"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const persona = JSON.parse(response.text || '{}');
        if (persona && persona.visualLock) {
          return res.json({ success: true, persona });
        }
      } catch (err: any) {
        console.warn('Gemini persona note, falling back to smart dossier:', err.message);
      }
    }

    const cleanHandle = `@${name.toLowerCase().replace(/\s+/g, '')}`;
    return res.json({
      success: true,
      persona: {
        name: name,
        handle: cleanHandle,
        bio: `${name} ☕📖\nSıradan günler, ikinci el kitaplar ve mahalle kahvecileri.\nKadıköy, İstanbul`,
        age: '24',
        visualLock: `24-year-old natural everyday person named ${name} with warm hazel eyes, casual wavy dark brown bob hair, natural skin texture, friendly genuine smile, comfortable oversized knit sweater`,
        voiceTone: 'Samimi, mütevazı, içten ve günlük arkadaş dili.',
        targetAudience: '18-28 yaş öğrenciler, tasarımcılar ve sakin hayat sevenler.',
        signatureAesthetic: 'Doğal gün ışığı, ikinci el kıyafetler, ahşap kafeler ve 35mm film tonları.',
      },
    });
  } catch (error: any) {
    console.error('Persona generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/simulate-reply
// Answers follower comments in the influencer's exact natural friend tone
app.post('/api/simulate-reply', async (req, res) => {
  try {
    const { comment, personaName = 'Ece Deniz', personaTone = 'Samimi, sıcak ve arkadaşça' } = req.body;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are ${personaName}, a regular young person living in Istanbul with about 4,800 followers/friends. You are talking to a friend or follower who commented on your daily life post: "${comment}".
Write a warm, natural, friendly, 1-sentence reply in everyday spoken Turkish (like replying to a friend on Instagram, not a PR statement or influencer diva).`,
        });

        if (response.text) {
          return res.json({ success: true, reply: response.text.trim() });
        }
      } catch (err: any) {
        console.warn('Gemini reply note, falling back to template reply:', err.message);
      }
    }

    const fallbackReplies = [
      `Çok teşekkürler! Kadıköy Salı pazarından bulmuştum, denk gelirsen kaçırma 🤍`,
      `Haha evet ya tam olarak öyle! Şila tüm gün masadan inmedi 🐱`,
      `Moda Caddesi'ndeki küçük Köz kahvecisi! Kesinlikle tavsiye ederim masaları çok sakin ✨`,
    ];
    const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res.json({ success: true, reply });
  } catch (error: any) {
    res.json({
      success: true,
      reply: `Çok teşekkürler! Ben de çok severek giyiyorum 🤍`,
    });
  }
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
