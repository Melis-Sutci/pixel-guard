# PixelGuard: AI-Powered Visual Testing Platform
## Getcontact için Özel Tasarım-Kod Uyumluluk Sistemi

**Hazırlayan:** Platform Team - Business Analysis  
**Tarih:** Ocak 2026  
**Versiyon:** 1.0

---

## Executive Summary

Bu doküman, Figma tasarımlarını gerçek cihazlardaki uygulama görünümleriyle otomatik karşılaştıran, AI-destekli bir visual testing platformunun teknik spesifikasyonunu içerir. Mevcut piyasa çözümlerinin (Applitools, Percy) Getcontact'ın ihtiyaçlarını karşılayamadığı göz önünde bulundurularak, özel bir çözüm önerilmektedir.

### Temel Değer Önerisi
- **Mevcut Durum:** Designerlar tüm ekranları manuel olarak elden geçiriyor
- **Hedef:** AI'ın otomatik olarak bozuk/uyumsuz ekranları tespit edip raporlaması
- **Kapsam:** Android 9-15, iOS 14+, katlanabilir cihazlar dahil 100+ cihaz

---

## Bölüm 1: Neden Büyük Şirketler Tam Çözmedi?

### 1.1 Problem Gerçekten Zor

Melis, haklı olarak "Percy gibi büyük şirketler neden yapmadı?" diye sordu. Cevap çok katmanlı:

#### A. Teknik Karmaşıklık

| Zorluk | Açıklama | Neden Çözülmedi |
|--------|----------|-----------------|
| **Figma ↔ Native App Gap** | Figma pixel-based, native app ise runtime-rendered | Figma API'si design token veriyor ama native render'ı tahmin edemiyor |
| **Device Fragmentation** | Android'de 24,000+ farklı cihaz modeli | Her cihazın font rendering'i, DPI'ı, OS skin'i farklı |
| **Dynamic Content** | Ads, timestamps, user-generated content | AI'ın "kasıtlı değişiklik" vs "bug" ayrımı yapması zor |
| **False Positive Çılgınlığı** | Anti-aliasing, sub-pixel rendering farkları | %90 false positive = kullanılmaz araç |

#### B. İş Modeli Çatışması

```
Percy/Applitools İş Modeli:
├── Web uygulamaları → Büyük market, kolay entegrasyon
├── Mobile web → Orta zorluk
└── Native mobile → Küçük market, yüksek zorluk, düşük ROI
```

Bu şirketler native mobile'ı "second-class citizen" olarak görüyor çünkü:
- Web'de DOM var, karşılaştırma kolay
- Native'de sadece pixel var, semantic anlam yok
- Native device farm maliyeti çok yüksek

#### C. Figma-to-Code Kopukluğu

Applitools'un Figma plugin'i var ama:
- Sadece "design-to-design" veya "code-to-code" karşılaştırması yapıyor
- "Design-to-native-app-on-100-devices" senaryosu için optimize DEĞİL
- Device farm entegrasyonu sınırlı

### 1.2 Peki Neden Biz Yapabiliriz?

| Avantaj | Açıklama |
|---------|----------|
| **Dar Kapsam** | Sadece Getcontact ekranları, genel çözüm değil |
| **Bilinen Cihaz Listesi** | Analytics'ten gelen gerçek kullanıcı cihazları |
| **Kontrollü Ortam** | Kendi CI/CD pipeline'ımız, kendi kurallarımız |
| **AI Gelişimi** | 2024-2025'te Vision AI dramatik olarak gelişti |

---

## Bölüm 2: Teknik Mimari

### 2.1 Sistem Genel Görünümü

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PIXELGUARD PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   INPUT LAYER   │     │  ORCHESTRATION  │     │  OUTPUT LAYER   │       │
│  │                 │     │                 │     │                 │       │
│  │  • Figma API    │────▶│  • Job Queue    │────▶│  • Dashboard    │       │
│  │  • Screen URLs  │     │  • Device Pool  │     │  • Slack Alert  │       │
│  │  • Test Config  │     │  • AI Engine    │     │  • Jira Ticket  │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│           │                      │                       │                 │
│           │                      │                       │                 │
│           ▼                      ▼                       ▼                 │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                      DATA LAYER                                  │       │
│  │  • Figma Design Specs    • Device Screenshots    • AI Analysis  │       │
│  │  • Baseline Images       • Comparison Results    • History      │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Detaylı Komponent Mimarisi

```
                                    USER INTERFACE
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
            │   WEB APP   │      │   CLI TOOL  │      │  SLACK BOT  │
            │  (React)    │      │  (Python)   │      │  (Optional) │
            └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
                   │                    │                    │
                   └────────────────────┼────────────────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │    API LAYER    │
                              │   (FastAPI)     │
                              │                 │
                              │  /tests         │
                              │  /screens       │
                              │  /devices       │
                              │  /reports       │
                              └────────┬────────┘
                                       │
                   ┌───────────────────┼───────────────────┐
                   │                   │                   │
                   ▼                   ▼                   ▼
          ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
          │   FIGMA     │     │   DEVICE    │     │     AI      │
          │   SERVICE   │     │    FARM     │     │   ENGINE    │
          │             │     │   SERVICE   │     │             │
          │ • Token     │     │             │     │ • Claude    │
          │   Extract   │     │ • AWS DF    │     │   Vision    │
          │ • Screen    │     │ • Browser   │     │ • GPT-4V    │
          │   Export    │     │   Stack     │     │ • Custom    │
          │ • Component │     │ • Firebase  │     │   CNN       │
          │   Parse     │     │   Test Lab  │     │             │
          └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
                 │                   │                   │
                 └───────────────────┼───────────────────┘
                                     │
                                     ▼
                           ┌─────────────────┐
                           │    DATABASE     │
                           │   (PostgreSQL)  │
                           │                 │
                           │  + Redis Queue  │
                           │  + S3 Storage   │
                           └─────────────────┘
```

---

## Bölüm 3: Komponent Detayları

### 3.1 Figma Service

**Amaç:** Figma'dan design spec'leri ve görsel baseline'ları çekmek

#### Figma API Capabilities

```python
# Figma REST API Endpoints
GET /v1/files/{file_key}                    # Dosya yapısı
GET /v1/files/{file_key}/nodes?ids={ids}    # Belirli node'lar
GET /v1/images/{file_key}?ids={ids}         # Render edilmiş görsel
GET /v1/files/{file_key}/variables/local    # Design tokens (Enterprise)
```

#### Çıkarılabilir Bilgiler

| Bilgi | Kullanım |
|-------|----------|
| **Frame dimensions** | Ekran boyutu kontrolü |
| **Component tree** | Element hierarchy |
| **Color styles** | Renk uyumu kontrolü |
| **Typography** | Font size, weight, family |
| **Spacing** | Padding, margin değerleri |
| **Auto-layout** | Responsive davranış |
| **Rendered PNG** | Pixel-level baseline |

#### Önemli Limitasyonlar

```
⚠️ Figma API Kısıtlamaları:
├── Variables API → Sadece Enterprise plan
├── Rate limit → 120 request/dakika
├── Export boyutu → Max 4096x4096 px
└── Font rendering → Lokal font'lar farklı render edilebilir
```

#### Önerilen Yaklaşım: Hybrid

```python
class FigmaService:
    def extract_screen(self, screen_url: str) -> ScreenSpec:
        """
        1. Parse Figma URL → file_key, node_id
        2. GET /files/{key}/nodes → component tree
        3. Extract design tokens (colors, typography, spacing)
        4. GET /images/{key} → PNG export at 1x, 2x, 3x
        5. Return structured ScreenSpec
        """
        return ScreenSpec(
            name="HomeScreen",
            dimensions={"width": 390, "height": 844},
            design_tokens={
                "colors": {"primary": "#2563EB", "background": "#FFFFFF"},
                "typography": {"heading": {"size": 24, "weight": 700}},
                "spacing": {"padding": 16, "gap": 8}
            },
            baseline_images={
                "1x": "s3://baselines/home_1x.png",
                "2x": "s3://baselines/home_2x.png",
                "3x": "s3://baselines/home_3x.png"
            },
            components=[
                {"id": "header", "bounds": {"x": 0, "y": 0, "w": 390, "h": 64}},
                {"id": "hero_card", "bounds": {"x": 16, "y": 80, "w": 358, "h": 200}},
                # ...
            ]
        )
```

### 3.2 Device Farm Service

**Amaç:** Gerçek cihazlarda uygulama çalıştırıp screenshot almak

#### Seçenekler Karşılaştırması

| Platform | Cihaz Sayısı | Fiyat | API Kalitesi | Önerimiz |
|----------|--------------|-------|--------------|----------|
| **BrowserStack** | 3500+ | $199/ay başlangıç | ⭐⭐⭐⭐⭐ | **Birincil** |
| **AWS Device Farm** | 500+ | $0.17/dakika | ⭐⭐⭐⭐ | Alternatif |
| **Firebase Test Lab** | 200+ | $5/saat (fiziksel) | ⭐⭐⭐ | Android için |
| **LambdaTest** | 3000+ | $15/ay başlangıç | ⭐⭐⭐⭐ | Bütçe dostu |
| **Kendi Emulator Farm** | Sınırsız | Sunucu maliyeti | ⭐⭐ | Fallback |

#### Önerilen Cihaz Matrisi (Getcontact için)

```yaml
device_matrix:
  android:
    flagship_new:
      - Samsung Galaxy S24 Ultra (Android 15)
      - Google Pixel 9 Pro (Android 15)
      - OnePlus 12 (Android 14)
    
    flagship_old:
      - Samsung Galaxy S21 (Android 13)
      - Google Pixel 6 (Android 14)
      - OnePlus 9 (Android 12)
    
    mid_range:
      - Samsung Galaxy A54 (Android 14)
      - Xiaomi Redmi Note 13 (Android 14)
      - Oppo A78 (Android 13)
    
    budget:
      - Samsung Galaxy A14 (Android 13)
      - Xiaomi Redmi 12 (Android 13)
      - Realme C55 (Android 13)
    
    foldable:
      - Samsung Galaxy Z Fold 5 (folded)
      - Samsung Galaxy Z Fold 5 (unfolded)
      - Samsung Galaxy Z Flip 5
    
    legacy:
      - Samsung Galaxy S10 (Android 12)
      - Google Pixel 4 (Android 13)
      - Any device (Android 9) - minimum supported
      - Any device (Android 10)
      - Any device (Android 11)
  
  ios:
    latest:
      - iPhone 16 Pro Max (iOS 18)
      - iPhone 16 (iOS 18)
      - iPhone 15 Pro (iOS 18)
    
    common:
      - iPhone 14 (iOS 17)
      - iPhone 13 (iOS 17)
      - iPhone 12 (iOS 16)
      - iPhone SE 3rd gen (iOS 17)
    
    legacy:
      - iPhone 11 (iOS 17)
      - iPhone XR (iOS 16)
      - Any device (iOS 14) - minimum supported
      - Any device (iOS 15)

# Toplam: ~40 benzersiz cihaz/OS kombinasyonu
# Gerekirse 100+ varyasyona genişletilebilir
```

#### Screenshot Capture Flow

```python
class DeviceFarmService:
    def capture_screen(
        self,
        app_build: str,          # APK/IPA path
        device: Device,
        screen_name: str,
        navigation_script: str   # Appium script to reach screen
    ) -> Screenshot:
        """
        1. Upload app build to device farm
        2. Provision requested device
        3. Install app
        4. Execute navigation script (Appium)
        5. Wait for screen to stabilize
        6. Capture screenshot
        7. Return with metadata
        """
        
        # BrowserStack örnek implementasyonu
        session = browserstack.create_session(
            app=app_build,
            device=device.model,
            os_version=device.os_version,
            project="Getcontact-PixelGuard",
            build=f"v{app_version}"
        )
        
        driver = webdriver.Remote(
            command_executor=BROWSERSTACK_URL,
            desired_capabilities=session.capabilities
        )
        
        # Navigate to screen
        exec(navigation_script, {"driver": driver})
        
        # Stabilization wait
        time.sleep(2)
        
        # Capture
        screenshot = driver.get_screenshot_as_png()
        
        return Screenshot(
            device=device,
            screen_name=screen_name,
            image=screenshot,
            timestamp=datetime.now(),
            app_version=app_version
        )
```

### 3.3 AI Comparison Engine

**Amaç:** Figma baseline ile cihaz screenshot'ını karşılaştırıp anlamlı farkları tespit etmek

#### Neden Sadece Pixel-Diff Yetmez?

```
Pixel-Diff Problemleri:
├── Anti-aliasing farkları → False positive
├── Font rendering farkları → False positive  
├── Sub-pixel positioning → False positive
├── Dynamic content (saat, tarih) → False positive
├── Animasyon frame'leri → False positive
└── Sonuç: %80+ false positive, kullanılamaz
```

#### AI-Powered Comparison Stratejisi

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI COMPARISON PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 1: Pre-processing                                        │
│  ├── Normalize dimensions (scale to match)                      │
│  ├── Mask dynamic regions (timestamps, ads, user content)       │
│  ├── Extract safe areas (notch, status bar)                     │
│  └── Color space normalization                                  │
│                                                                 │
│  STAGE 2: Structural Analysis                                   │
│  ├── Element detection (buttons, cards, text blocks)            │
│  ├── Layout grid extraction                                     │
│  ├── Hierarchy matching (Figma components ↔ detected elements) │
│  └── Spacing measurement                                        │
│                                                                 │
│  STAGE 3: Semantic Comparison (AI)                              │
│  ├── Visual similarity scoring (per component)                  │
│  ├── Layout deviation detection                                 │
│  ├── Text truncation/overflow detection                         │
│  ├── Color accuracy check                                       │
│  └── Touch target size validation                               │
│                                                                 │
│  STAGE 4: Severity Classification (AI)                          │
│  ├── Critical: Layout broken, content hidden                    │
│  ├── Major: Significant visual deviation                        │
│  ├── Minor: Small spacing/color differences                     │
│  └── Acceptable: Expected platform differences                  │
│                                                                 │
│  STAGE 5: Root Cause Analysis (AI)                              │
│  ├── "Safe area inset issue"                                    │
│  ├── "Font scaling problem"                                     │
│  ├── "Aspect ratio mismatch"                                    │
│  └── "Component overflow"                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Vision AI Model Seçimi

| Model | Güçlü Yanları | Zayıf Yanları | Maliyet | Önerimiz |
|-------|---------------|---------------|---------|----------|
| **Claude Vision (Opus 4.5)** | UI/UX anlayışı çok iyi, Türkçe destek | Yavaş | $15/1M token | Detaylı analiz |
| **GPT-4V** | Genel görsel anlayış | UI-specific değil | $10/1M token | Alternatif |
| **Custom CNN** | Hızlı, ucuz, özelleştirilebilir | Eğitim gerekli | Sunucu | Ön-filtreleme |
| **CLIP + Custom** | Semantic similarity | Setup karmaşık | Orta | Hibrit |

#### Önerilen Hibrit Yaklaşım

```python
class AIComparisonEngine:
    def __init__(self):
        self.pre_filter = CustomCNN()      # Hızlı, ucuz ön-filtreleme
        self.vision_ai = ClaudeVision()    # Detaylı analiz
        self.classifier = SeverityModel()   # Önem sınıflandırma
    
    def compare(
        self,
        figma_spec: ScreenSpec,
        screenshot: Screenshot,
        tolerance_config: ToleranceConfig
    ) -> ComparisonResult:
        
        # Stage 1: Quick pre-filter (Custom CNN)
        # Eğer pixel-level benzerlik > %95 ise, detailed analiz skip
        quick_score = self.pre_filter.similarity_score(
            figma_spec.baseline_image,
            screenshot.image
        )
        
        if quick_score > 0.95:
            return ComparisonResult(
                status="PASS",
                confidence=0.95,
                issues=[]
            )
        
        # Stage 2: Detailed AI Analysis (Claude Vision)
        analysis_prompt = f"""
        Sen bir mobil uygulama QA uzmanısın. Aşağıda:
        1. Figma'dan export edilmiş tasarım baseline'ı
        2. {screenshot.device.model} ({screenshot.device.os}) cihazından alınmış screenshot
        
        Bu iki görseli karşılaştır ve şunları analiz et:
        
        A. LAYOUT ANALİZİ:
        - Element pozisyonları doğru mu?
        - Spacing (padding, margin) tasarımla uyumlu mu?
        - Overflow veya truncation var mı?
        
        B. GÖRSEL ANALİZ:
        - Renkler doğru mu?
        - Fontlar doğru render edilmiş mi?
        - Görseller/ikonlar bozuk mu?
        
        C. CİHAZA ÖZEL SORUNLAR:
        - Safe area (notch, status bar) sorunları var mı?
        - Ekran boyutuna uyum sağlanmış mı?
        - Platform-specific UI elementleri doğru mu?
        
        Tespit edilen her sorun için:
        - Sorunun açıklaması
        - Ekrandaki konumu (bounding box)
        - Severity: CRITICAL / MAJOR / MINOR / ACCEPTABLE
        - Olası root cause
        
        JSON formatında yanıt ver.
        """
        
        ai_response = self.vision_ai.analyze(
            images=[figma_spec.baseline_image, screenshot.image],
            prompt=analysis_prompt
        )
        
        # Stage 3: Parse and classify
        issues = self.parse_issues(ai_response)
        
        # Apply tolerance rules
        filtered_issues = self.apply_tolerance(
            issues,
            tolerance_config,
            screenshot.device
        )
        
        return ComparisonResult(
            status="FAIL" if any(i.severity in ["CRITICAL", "MAJOR"] for i in filtered_issues) else "PASS",
            confidence=ai_response.confidence,
            issues=filtered_issues,
            raw_analysis=ai_response
        )
```

#### Tolerance Configuration

```yaml
# tolerance_config.yaml
global:
  spacing_tolerance_px: 2      # 2px spacing farkı kabul edilebilir
  color_tolerance_delta: 5     # Delta E < 5 kabul edilebilir
  font_size_tolerance_pt: 1    # 1pt font farkı kabul edilebilir

device_specific:
  android:
    # Android'de system font rendering farklı
    font_rendering_strict: false
    # Material Design system UI elementleri
    ignore_system_ui: true
    
  ios:
    # iOS daha tutarlı
    font_rendering_strict: true
    ignore_system_ui: true

screen_specific:
  HomeScreen:
    dynamic_regions:
      - name: "timestamp"
        bounds: {x: 300, y: 20, w: 80, h: 20}
      - name: "notification_badge"
        bounds: {x: 350, y: 60, w: 30, h: 30}

known_acceptable_differences:
  - pattern: "status_bar_time"
    description: "Durum çubuğundaki saat farklı olabilir"
  - pattern: "carrier_name"
    description: "Operatör adı cihaza göre değişir"
```

---

## Bölüm 4: User Interface & Workflow

### 4.1 Dashboard Ana Ekran

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔍 PixelGuard                                    [New Test] [Settings] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 Overview                                      Last 7 days           │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐             │
│  │   Tests     │   Passed    │   Failed    │  In Queue   │             │
│  │    127      │     98      │     24      │      5      │             │
│  │             │   (77%)     │   (19%)     │    (4%)     │             │
│  └─────────────┴─────────────┴─────────────┴─────────────┘             │
│                                                                         │
│  🚨 Critical Issues (Action Required)                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⛔ HomeScreen - Samsung Galaxy Z Fold 5 (Unfolded)             │   │
│  │     Layout completely broken - elements overlapping              │   │
│  │     Detected: 2 hours ago | Assigned: @designer_ali              │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  ⛔ ProfileScreen - iPhone SE (3rd gen)                         │   │
│  │     Text truncation in bio section                               │   │
│  │     Detected: 5 hours ago | Unassigned                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📱 Device Coverage                                                     │
│  ┌────────────────────────────────────────────────────────┐            │
│  │  Android (25 devices)  ████████████████████░░ 85%      │            │
│  │  iOS (15 devices)      ██████████████████████ 100%     │            │
│  │  Foldables (3 devices) ████████░░░░░░░░░░░░░░ 33%      │            │
│  └────────────────────────────────────────────────────────┘            │
│                                                                         │
│  📋 Recent Test Runs                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Screen          │ Devices │ Passed │ Failed │ Status  │ Time   │   │
│  │  ───────────────────────────────────────────────────────────── │   │
│  │  HomeScreen      │   42    │   38   │   4    │ ⚠️      │ 2h ago │   │
│  │  CallerIDScreen  │   42    │   42   │   0    │ ✅      │ 3h ago │   │
│  │  SettingsScreen  │   42    │   41   │   1    │ ⚠️      │ 5h ago │   │
│  │  ProfileScreen   │   42    │   36   │   6    │ ❌      │ 6h ago │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Test Oluşturma Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  New Visual Test                                              [Cancel]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Step 1 of 4: Select Screen                                             │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Figma URL:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ https://www.figma.com/file/abc123/Getcontact?node-id=123:456   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Fetch from Figma]                                                     │
│                                                                         │
│  ✅ Screen detected: "Home Screen - Logged In State"                    │
│  ┌─────────────────────────┐                                           │
│  │  ┌─────────────────┐   │   Dimensions: 390 x 844                    │
│  │  │   Preview       │   │   Components: 24                           │
│  │  │   Image         │   │   Design Tokens: 18                        │
│  │  │                 │   │   Last Updated: Jan 18, 2026               │
│  │  │                 │   │                                            │
│  │  └─────────────────┘   │                                            │
│  └─────────────────────────┘                                           │
│                                                                         │
│                                               [Back] [Next: Devices →]  │
└─────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│  New Visual Test                                              [Cancel]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Step 2 of 4: Select Devices                                            │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Quick Select:                                                          │
│  [All Android] [All iOS] [Flagships Only] [Budget Devices] [Foldables] │
│                                                                         │
│  ┌─ Android ─────────────────────────────────────────────────────────┐ │
│  │  ☑️ Samsung Galaxy S24 Ultra    Android 15    1440x3120           │ │
│  │  ☑️ Samsung Galaxy S21          Android 13    1080x2400           │ │
│  │  ☑️ Samsung Galaxy A54          Android 14    1080x2340           │ │
│  │  ☑️ Samsung Galaxy Z Fold 5     Android 14    1812x2176 (unfolded)│ │
│  │  ☑️ Google Pixel 9 Pro          Android 15    1344x2992           │ │
│  │  ☐ Xiaomi Redmi Note 13         Android 14    1080x2400           │ │
│  │  ... [Show all 25 Android devices]                                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─ iOS ─────────────────────────────────────────────────────────────┐ │
│  │  ☑️ iPhone 16 Pro Max           iOS 18        1290x2796           │ │
│  │  ☑️ iPhone 14                   iOS 17        1170x2532           │ │
│  │  ☑️ iPhone SE (3rd gen)         iOS 17         750x1334           │ │
│  │  ☑️ iPhone 11                   iOS 17         828x1792           │ │
│  │  ... [Show all 15 iOS devices]                                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Selected: 18 devices                                                   │
│  Estimated time: ~45 minutes                                            │
│  Estimated cost: $12.50                                                 │
│                                                                         │
│                                           [← Back] [Next: Options →]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Comparison Result View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Test Result: HomeScreen on Samsung Galaxy Z Fold 5 (Unfolded)          │
│  Status: ❌ FAILED | 3 Critical Issues                      [Re-run]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┬─────────────────────────────┐         │
│  │      FIGMA BASELINE         │      DEVICE SCREENSHOT      │         │
│  │                             │                             │         │
│  │  ┌─────────────────────┐   │   ┌─────────────────────┐   │         │
│  │  │                     │   │   │                     │   │         │
│  │  │   [Header OK]       │   │   │   [Header OK]       │   │         │
│  │  │                     │   │   │                     │   │         │
│  │  │   ┌─────────────┐   │   │   │   ┌───────┐ ┌─────┐│   │         │
│  │  │   │  Hero Card  │   │   │   │   │ Hero  │ │Over ││   │  🔴     │
│  │  │   │  (OK)       │   │   │   │   │ Card  │ │flow!││   │         │
│  │  │   └─────────────┘   │   │   │   └───────┘ └─────┘│   │         │
│  │  │                     │   │   │                     │   │         │
│  │  │   [Content Grid]    │   │   │   [Content Grid]    │   │         │
│  │  │   [All items fit]   │   │   │   [Items overlap]   │   │  🔴     │
│  │  │                     │   │   │                     │   │         │
│  │  └─────────────────────┘   │   └─────────────────────┘   │         │
│  │                             │                             │         │
│  └─────────────────────────────┴─────────────────────────────┘         │
│                                                                         │
│  📋 Issues Detected:                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔴 CRITICAL: Hero card overflow                                 │   │
│  │     Location: x:200, y:150, w:400, h:200                         │   │
│  │     Description: Card content overflows container on wide screen │   │
│  │     Root Cause: Fixed width constraint instead of responsive     │   │
│  │     Suggestion: Use maxWidth instead of fixed width              │   │
│  │                                                     [Create Jira] │   │
│  │  ─────────────────────────────────────────────────────────────── │   │
│  │  🔴 CRITICAL: Content grid overlap                               │   │
│  │     Location: x:0, y:400, w:1812, h:600                          │   │
│  │     Description: Grid items overlap each other                   │   │
│  │     Root Cause: Grid not adapting to tablet aspect ratio         │   │
│  │     Suggestion: Implement adaptive grid columns for wide screens │   │
│  │                                                     [Create Jira] │   │
│  │  ─────────────────────────────────────────────────────────────── │   │
│  │  🟡 MINOR: Spacing inconsistency                                 │   │
│  │     Location: x:16, y:350, w:100, h:30                           │   │
│  │     Description: 4px extra padding on left side                  │   │
│  │     Root Cause: Safe area inset calculation                      │   │
│  │                                                  [Mark Acceptable]│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  AI Confidence: 94% | Analysis Time: 8.3s                               │
│                                                                         │
│  [← Previous Device] [Approve All Minor] [Reject & Assign] [Next →]    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Bölüm 5: Teknik Gereksinimler

### 5.1 Backend Stack

```yaml
backend:
  language: Python 3.11+
  framework: FastAPI
  
  dependencies:
    - fastapi[all]          # API framework
    - celery                # Task queue
    - redis                 # Queue backend & cache
    - sqlalchemy            # ORM
    - alembic               # Migrations
    - httpx                 # Async HTTP client
    - pillow                # Image processing
    - opencv-python         # Advanced image analysis
    - anthropic             # Claude API
    - openai                # GPT-4V fallback
    - boto3                 # S3 storage
    - appium-python-client  # Device automation
    
  infrastructure:
    database: PostgreSQL 15
    cache: Redis 7
    storage: S3 / MinIO
    queue: Celery + Redis
    
  hosting_options:
    - AWS (recommended): ECS + RDS + ElastiCache + S3
    - GCP: Cloud Run + Cloud SQL + Memorystore + GCS
    - Self-hosted: Docker Compose (development)
```

### 5.2 Frontend Stack

```yaml
frontend:
  framework: React 18+ / Next.js 14
  
  dependencies:
    - next                  # Framework
    - tailwindcss           # Styling
    - shadcn/ui             # Component library
    - tanstack/react-query  # Data fetching
    - zustand               # State management
    - react-compare-slider  # Image comparison UI
    - recharts              # Charts
    
  features:
    - Image comparison slider
    - Device matrix selector
    - Real-time test progress
    - Issue annotation overlay
    - Slack/Jira integration panels
```

### 5.3 External Service Dependencies

```yaml
external_services:
  required:
    - figma_api:
        description: "Design spec extraction"
        auth: "Personal Access Token"
        rate_limit: "120 req/min"
        
    - device_farm:
        primary: "BrowserStack"
        fallback: "AWS Device Farm"
        auth: "API key"
        
    - ai_vision:
        primary: "Claude API (claude-3-opus)"
        fallback: "OpenAI GPT-4V"
        auth: "API key"
        
    - storage:
        service: "AWS S3 / MinIO"
        usage: "Baseline images, screenshots, reports"
        
  optional:
    - slack_api:
        description: "Alert notifications"
        
    - jira_api:
        description: "Auto ticket creation"
        
    - github_api:
        description: "CI/CD integration"
```

---

## Bölüm 6: Maliyet Analizi

### 6.1 Operasyonel Maliyetler (Aylık)

| Kategori | Servis | Kullanım | Aylık Maliyet |
|----------|--------|----------|---------------|
| **Device Farm** | BrowserStack | ~500 test/hafta | $400-600 |
| **AI API** | Claude API | ~2000 comparison | $150-300 |
| **Cloud Hosting** | AWS/GCP | Basic infra | $100-200 |
| **Storage** | S3 | ~50GB images | $5-10 |
| **Database** | RDS/CloudSQL | Small instance | $50-100 |
| | | **TOPLAM** | **$700-1,200/ay** |

### 6.2 Geliştirme Maliyetleri (Tek Seferlik)

| Faz | Süre | Kaynak | Tahmini Maliyet* |
|-----|------|--------|------------------|
| MVP (Core Features) | 6-8 hafta | 1 Senior Dev + 1 BA | İç kaynak |
| Dashboard UI | 3-4 hafta | 1 Frontend Dev | İç kaynak |
| AI Engine Tuning | 2-3 hafta | 1 Dev + iterations | İç kaynak |
| Integrations | 2 hafta | 1 Dev | İç kaynak |
| | **TOPLAM** | **13-17 hafta** | - |

*İç kaynak kullanımı varsayılmıştır

### 6.3 ROI Analizi

```
Mevcut Maliyet (Manuel Review):
├── Designer zamanı: ~20 saat/hafta × $50/saat = $1,000/hafta
├── QA zamanı: ~10 saat/hafta × $40/saat = $400/hafta
├── Bug fix (geç tespit): ~5 bug/hafta × 4 saat × $60 = $1,200/hafta
└── TOPLAM: ~$2,600/hafta = $10,400/ay

PixelGuard ile Tasarruf (Tahmini):
├── Designer zamanı: %70 azalma → $700/hafta tasarruf
├── QA zamanı: %80 azalma → $320/hafta tasarruf
├── Bug fix: %50 azalma → $600/hafta tasarruf
└── TOPLAM TASARRUF: ~$1,620/hafta = $6,480/ay

Net Tasarruf: $6,480 - $1,000 (operasyonel) = $5,480/ay
ROI Payback: 3-4 ay
```

---

## Bölüm 7: Uygulama Yol Haritası

### Phase 1: MVP (Hafta 1-6)

```
Hedef: Tek ekran, 10 cihaz, basic comparison

Deliverables:
├── Figma API integration (read-only)
├── BrowserStack integration (screenshot capture)
├── Claude Vision comparison (basic prompt)
├── CLI tool for running tests
├── Simple HTML report output
└── Manual trigger (no automation)

Success Criteria:
├── HomeScreen'i 10 cihazda test edebilme
├── AI'ın gerçek bug'ları %70 accuracy ile bulması
├── False positive rate < %30
└── End-to-end test süresi < 30 dakika
```

### Phase 2: Dashboard & Automation (Hafta 7-10)

```
Hedef: Web UI, batch testing, CI integration

Deliverables:
├── React dashboard (test creation, results view)
├── Batch test support (multiple screens)
├── Device matrix configuration
├── Test scheduling (cron-based)
├── Slack notifications
└── Basic CI/CD integration (GitHub Actions)

Success Criteria:
├── Non-technical kullanıcıların test oluşturabilmesi
├── 20+ ekran için batch test
├── Günlük otomatik test run
└── Slack'te kritik issue alertleri
```

### Phase 3: Advanced AI & Scale (Hafta 11-14)

```
Hedef: Daha akıllı AI, daha az false positive

Deliverables:
├── Custom tolerance rules per screen/device
├── AI severity classification improvement
├── Root cause analysis enhancement
├── Historical trend analysis
├── Jira integration
├── Performance optimization (parallel testing)
└── Full device matrix (40+ devices)

Success Criteria:
├── False positive rate < %10
├── AI accuracy > %90
├── Full test suite < 2 saat
└── Designer review time %80 azalma
```

### Phase 4: Enterprise Features (Hafta 15+)

```
Hedef: Org-wide adoption, advanced features

Deliverables:
├── Multi-project support
├── Role-based access control
├── Audit logging
├── Custom AI model fine-tuning
├── A/B baseline support
├── Design system drift detection
└── API for external integrations

Success Criteria:
├── Tüm Getcontact ekranlarının coverage
├── Multiple team adoption
├── Self-service onboarding
└── Monthly visual health report
```

---

## Bölüm 8: Risk Analizi ve Mitigasyon

### 8.1 Teknik Riskler

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|------------|
| **AI false positive çok yüksek** | Orta | Yüksek | Iteratif prompt tuning, tolerance config, human-in-the-loop |
| **Device farm instabil** | Düşük | Orta | Multi-provider fallback (BrowserStack + AWS) |
| **Figma API değişikliği** | Düşük | Orta | Abstraction layer, version pinning |
| **AI API maliyet patlaması** | Orta | Orta | Pre-filtering with cheap model, caching |
| **Screenshot tutarsızlığı** | Orta | Yüksek | Stabilization waits, retry logic, region masking |

### 8.2 Organizasyonel Riskler

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|------------|
| **Designer adoption düşük** | Orta | Yüksek | Gradual rollout, training, feedback loops |
| **Maintenance burden** | Orta | Orta | Good documentation, clear ownership |
| **Scope creep** | Yüksek | Orta | Strict phase boundaries, MVP focus |

---

## Bölüm 9: Sonuç ve Öneriler

### 9.1 Neden Şimdi?

1. **AI Yetenekleri:** Claude Vision ve GPT-4V 2024-2025'te dramatik olarak gelişti
2. **Maliyet Düşüşü:** Vision API'ler artık makul fiyatlı
3. **Rekabet Avantajı:** Kimse tam bu problemi çözmedi
4. **İç Acı:** Designer'lar manuel review'dan yorgun

### 9.2 Neden Biz?

1. **Dar Kapsam:** Sadece Getcontact, genel çözüm değil
2. **Bilinen Problemler:** Hangi ekranlar sorunlu biliyoruz
3. **Kontrollü Ortam:** Kendi pipeline'ımız
4. **Behavioural Hub Deneyimi:** Benzer bir platform zaten yaptık

### 9.3 Aksiyon Önerileri

| Öncelik | Aksiyon | Sorumlu | Deadline |
|---------|---------|---------|----------|
| 1 | Figma API erişimi ve Enterprise plan kontrolü | BA | Hafta 1 |
| 2 | BrowserStack trial account ve POC | Dev | Hafta 1-2 |
| 3 | Claude API account ve initial testing | Dev | Hafta 2 |
| 4 | MVP scope finalization | BA + Dev | Hafta 2 |
| 5 | Development kickoff | Dev | Hafta 3 |

---

## Ekler

### Ek A: API Endpoint Tasarımı (Draft)

```
POST   /api/v1/tests                    # Yeni test oluştur
GET    /api/v1/tests                    # Test listesi
GET    /api/v1/tests/{id}               # Test detayı
POST   /api/v1/tests/{id}/run           # Testi çalıştır
GET    /api/v1/tests/{id}/results       # Test sonuçları

POST   /api/v1/screens                  # Ekran tanımla (Figma URL)
GET    /api/v1/screens                  # Ekran listesi
GET    /api/v1/screens/{id}             # Ekran detayı

GET    /api/v1/devices                  # Kullanılabilir cihazlar
POST   /api/v1/device-groups            # Cihaz grubu oluştur

GET    /api/v1/issues                   # Tüm issue'lar
PATCH  /api/v1/issues/{id}              # Issue güncelle (severity, status)
POST   /api/v1/issues/{id}/jira         # Jira ticket oluştur

GET    /api/v1/reports/summary          # Özet rapor
GET    /api/v1/reports/trends           # Trend analizi
```

### Ek B: Claude Vision Prompt Template

```
You are an expert mobile QA engineer specialized in visual regression testing.

## Context
- Baseline: Figma design export for "{screen_name}"
- Screenshot: Captured from {device_model} running {os_version}
- App Version: {app_version}

## Your Task
Compare the two images and identify visual discrepancies.

## Analysis Framework

### 1. Layout Analysis
- Element positioning accuracy
- Spacing consistency (padding, margins, gaps)
- Overflow and truncation issues
- Alignment problems

### 2. Visual Fidelity
- Color accuracy
- Typography (font size, weight, family)
- Icon/image rendering
- Border and shadow effects

### 3. Device-Specific Issues
- Safe area handling (notch, status bar, home indicator)
- Screen size adaptation
- Platform-specific UI elements
- Orientation handling (if applicable)

## Output Format (JSON)
{
  "overall_status": "PASS" | "FAIL",
  "confidence": 0.0-1.0,
  "issues": [
    {
      "id": "uuid",
      "severity": "CRITICAL" | "MAJOR" | "MINOR" | "ACCEPTABLE",
      "category": "layout" | "visual" | "device_specific",
      "description": "Clear description of the issue",
      "location": {
        "x": int,
        "y": int,
        "width": int,
        "height": int
      },
      "root_cause": "Likely technical reason",
      "suggestion": "Recommended fix"
    }
  ],
  "notes": "Any additional observations"
}

## Severity Guidelines
- CRITICAL: Content hidden, unusable UI, major layout broken
- MAJOR: Significant visual deviation, poor UX
- MINOR: Small spacing/color differences, cosmetic issues
- ACCEPTABLE: Expected platform differences, font rendering variations

## Important
- Ignore dynamic content areas (timestamps, ads, user-generated content)
- Account for expected platform differences (Android vs iOS system UI)
- Be specific about locations using bounding boxes
- Provide actionable suggestions for fixes
```

### Ek C: Referans Linkler

- [Figma REST API Documentation](https://www.figma.com/developers/api)
- [BrowserStack App Automate](https://www.browserstack.com/app-automate)
- [AWS Device Farm](https://aws.amazon.com/device-farm/)
- [Applitools Figma Plugin](https://applitools.com/solutions/figma/)
- [Percy App Percy](https://www.browserstack.com/docs/percy/integrate/app-percy)
- [Claude Vision API](https://docs.anthropic.com/claude/docs/vision)

---

*Bu doküman Getcontact Platform Team için hazırlanmıştır. Güncellemeler için BA ile iletişime geçin.*
