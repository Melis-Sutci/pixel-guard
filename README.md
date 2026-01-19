# PixelGuard 🔍

AI-Powered Visual Testing Platform for Mobile Applications

> Figma tasarımlarını 100+ gerçek cihazda otomatik test eden, sadece bozuk ekranları raporlayan yapay zeka destekli visual testing platformu.

## 🎯 Problem

Mobil uygulama ekranlarının tasarımla uyumluluğunu kontrol etmek manuel ve zaman alıcı bir süreç. Mevcut araçlar (Applitools, Percy) ya çok pahalı, ya false positive oranı çok yüksek, ya da Figma-to-native-app senaryosunu tam desteklemiyor.

## 💡 Çözüm

```
Figma Ekranı → AI Extraction → 100 Cihazda Test → Semantic Comparison → Sadece Gerçek Sorunları Raporla
```

## 🚀 Features

- **Figma Integration:** Design spec'leri ve baseline görsellerini otomatik çek
- **Device Farm:** BrowserStack/AWS Device Farm ile 40+ gerçek cihazda test
- **AI Comparison:** Claude Vision ile semantic karşılaştırma (pixel-diff değil)
- **Smart Filtering:** False positive'leri otomatik filtrele
- **Severity Classification:** Critical/Major/Minor otomatik sınıflandırma
- **Root Cause Analysis:** "Bu muhtemelen safe area sorunu" gibi öneriler

## 📁 Project Structure

```
pixelguard/
├── frontend/                 # React dashboard
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Python FastAPI (Phase 2)
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── services/         # Business logic
│   │   │   ├── figma.py      # Figma API integration
│   │   │   ├── device_farm.py # BrowserStack/AWS
│   │   │   └── ai_engine.py  # Claude Vision comparison
│   │   ├── models/           # Database models
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                     # Documentation
│   ├── TECHNICAL_SPEC.md     # Full technical specification
│   ├── EXECUTIVE_SUMMARY.md  # One-pager for stakeholders
│   └── API.md                # API documentation
│
└── README.md
```

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Shadcn/ui components
- TanStack Query
- Recharts

### Backend (Phase 2)
- Python 3.11+
- FastAPI
- Celery + Redis
- PostgreSQL
- Claude Vision API

### External Services
- Figma API
- BrowserStack / AWS Device Farm
- Anthropic Claude API

## 🏃‍♂️ Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Environment Variables

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000

# backend/.env (Phase 2)
FIGMA_ACCESS_TOKEN=your_token
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
ANTHROPIC_API_KEY=your_key
DATABASE_URL=postgresql://...
```

## 📅 Roadmap

- [x] Phase 0: Technical specification & UI prototype
- [ ] Phase 1: MVP - CLI tool, 10 devices, basic comparison
- [ ] Phase 2: Dashboard & automation
- [ ] Phase 3: Advanced AI & scale (40+ devices)
- [ ] Phase 4: Enterprise features

## 📊 ROI

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Designer review time | 20h/week | 6h/week | 70% ↓ |
| Bug catch rate | 60% | 90% | 50% ↑ |
| False positive rate | 40% | <10% | 75% ↓ |

## 📝 License

Internal use only - Getcontact Platform Team

## 👥 Team

- Business Analysis: Platform Team
- Development: TBD
