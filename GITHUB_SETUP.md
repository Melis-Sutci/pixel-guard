# 🚀 PixelGuard - GitHub Kurulum Rehberi

## Adım 1: GitHub'da Yeni Repo Oluştur

1. GitHub'a git: https://github.com/new
2. Repository adı: `pixelguard` (veya `pixel-testing-platform`)
3. Description: `AI-Powered Visual Testing Platform for Mobile Applications`
4. **Private** seç (şirket projesi olduğu için)
5. README ekleme (biz zaten ekledik)
6. .gitignore ekleme (biz zaten ekledik)
7. **Create repository** tıkla

---

## Adım 2: Projeyi Bilgisayarına İndir

Bu dosyaları indir ve bir klasöre koy:
- `pixelguard-project` klasörünün tamamı

Veya dosyaları manuel olarak şu yapıda oluştur:

```
pixelguard/
├── .gitignore
├── README.md
├── docs/
│   ├── TECHNICAL_SPEC.md
│   └── EXECUTIVE_SUMMARY.md
└── frontend/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── components/
        │   ├── Layout.jsx
        │   ├── StatsCard.jsx
        │   ├── StatusBadge.jsx
        │   ├── IssueRow.jsx
        │   └── QuickActionButton.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── NewTest.jsx
            ├── TestDetail.jsx
            ├── Devices.jsx
            └── Settings.jsx
```

---

## Adım 3: Git Komutları

Terminal'de proje klasörüne git ve şunları çalıştır:

```bash
# Git repo başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: PixelGuard frontend prototype"

# Ana branch'i main yap
git branch -M main

# Remote ekle (kendi repo URL'ini kullan!)
git remote add origin https://github.com/KULLANICI_ADIN/pixelguard.git

# Push et
git push -u origin main
```

---

## Adım 4: Projeyi Çalıştır (Test İçin)

```bash
cd frontend
npm install
npm run dev
```

Tarayıcıda aç: http://localhost:5173

---

## Adım 5: Claude Code ile Çalışmaya Başla

Claude Code'u aç ve şunu söyle:

```
Bu repo'yu klonla ve incele: https://github.com/KULLANICI_ADIN/pixelguard

Bu bir AI-powered visual testing platformu. Frontend React ile yazılmış ve çalışıyor.
Şimdi backend'i Python/FastAPI ile geliştirmemiz gerekiyor.

docs/TECHNICAL_SPEC.md dosyasını oku - tüm teknik detaylar orada.

İlk olarak şunları yapalım:
1. backend/ klasörünü oluştur
2. FastAPI boilerplate kur
3. Figma API entegrasyonu için service yaz
```

---

## Proje Yapısı Özeti

```
pixelguard/
├── frontend/          ✅ HAZIR (React dashboard)
│   └── src/
│       ├── components/   UI component'ları
│       └── pages/        Sayfa component'ları
│
├── backend/           ❌ GELİŞTİRİLECEK (FastAPI)
│   └── app/
│       ├── api/         API routes
│       ├── services/    Figma, DeviceFarm, AI
│       └── models/      Database models
│
└── docs/              ✅ HAZIR
    ├── TECHNICAL_SPEC.md    Detaylı teknik doküman
    └── EXECUTIVE_SUMMARY.md Özet
```

---

## Sonraki Adımlar

1. [ ] GitHub repo oluştur ve push et
2. [ ] Claude Code ile backend geliştirmeye başla
3. [ ] Figma API erişimini test et
4. [ ] BrowserStack trial al

İyi çalışmalar! 🎉
