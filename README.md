# SunDock — Akıllı Bank Sistemi ☀️🔋

İstanbul Üniversitesi-Cerrahpaşa Avcılar Kampüsü'ndeki güneş enerjili akıllı bankların anlık şarj (voltaj) durumlarını, konumlarını ve çalışma durumlarını izlemek için geliştirilmiş web arayüzü ve simülasyon sunucusu.

---

## 🏗️ Proje Yapısı

Proje iki ana kısımdan oluşmaktadır:

*   **Frontend (İstemci):** React (Vite) ile yazılmış, harita (Leaflet) entegrasyonuna sahip ve telemetri verilerini anlık olarak güncelleyebilen modern bir kullanıcı arayüzü.
*   **Backend (Sunucu):** Node.js & Express ile geliştirilmiş, veritabanı olarak doğrudan `src/data/benches.json` dosyasını kullanan ve telemetri verisi güncellemelerini (`POST /api/telemetry/report`) işleyen sunucu.

---

## ⚡ Çalıştırma ve Kurulum

Projenin yerel bilgisayarında veya bir sunucuda çalışabilmesi için aşağıdaki adımları uygulayabilirsin:

### 1. Bağımlılıkların Kurulması

Öncelikle hem frontend hem de backend bağımlılıklarını kurmalısın:

```bash
# Ana dizinde frontend paketlerini yükleyin:
npm install

# Backend dizininde sunucu paketlerini yükleyin:
cd backend
npm install
```

### 2. Yerel Geliştirme Ortamında Başlatma

Aynı anda hem backend'i hem de frontend'i ayağa kaldırmalısın:

#### A. Backend'i Başlatma:
```bash
cd backend
npm run dev
```
*Sunucu varsayılan olarak **`http://localhost:5000`** portunda çalışacaktır.*

#### B. Frontend'i Başlatma:
```bash
# Ana dizinde:
npm run dev
```
*Arayüz varsayılan olarak **`http://localhost:5173/sundock/`** adresinde açılacaktır.*

---

## 📡 API Uç Noktaları (Endpoints)

Backend, istemciyle veya fiziksel donanımlarla (örneğin akıllı bank cihazları) haberleşmek için şu endpoint'leri sunar:

### 1. Tüm Bankları Listeleme
*   **İstek Tipi:** `GET`
*   **Adres:** `/api/benches`
*   **Açıklama:** Sistemdeki tüm bankların listesini döner.

### 2. Tek Bir Bank Detayı
*   **İstek Tipi:** `GET`
*   **Adres:** `/api/benches/:id`
*   **Açıklama:** Belirtilen ID'ye sahip bankın detaylarını getirir.

### 3. Telemetri Verisi Raporlama (Cihaz Güncelleme)
*   **İstek Tipi:** `POST`
*   **Adres:** `/api/telemetry/report`
*   **İstek Gövdesi (JSON):**
    ```json
    {
      "id": 1,
      "batteryLevel": 85,
      "status": "active"
    }
    ```
*   **Açıklama:** Belirtilen ID'li bankın şarj seviyesini (`batteryLevel`) ve durumunu (`status`) günceller. Eğer şarj seviyesi `0` olarak bildirilirse ve bir durum belirtilmezse, bank otomatik olarak `offline` durumuna çekilir.

---

## 🚀 Uzak Sunucuya (Production) Dağıtım

Uzak sunucuda sistemi kurup arka planda sürekli çalışır halde tutmak için aşağıdaki adımları izleyebilirsin:

1. **Sunucuya Dosya Taşıma:** `node_modules` hariç `backend` klasörünü sunucuya yükle.
2. **Çevre Değişkenleri (Opsiyonel):** Başka bir konumdaki JSON dosyasını okutmak istiyorsan `DATA_FILE_PATH` değişkenini kullanabilirsin:
   ```bash
   PORT=5000 DATA_FILE_PATH="/var/www/benches.json" node server.js
   ```
3. **PM2 Kurulumu & Çalıştırma:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "sundock-backend"
   ```
