# 📝 Text Summarizer

Bu proje, kullanıcıdan alınan metni OpenAI API'si aracılığıyla özetleyen basit bir web uygulamasıdır. Arayüz HTML + JavaScript ile hazırlanmıştır, backend ise Flask (Python) kullanır.

---

## 🚀 Özellikler

- Türkçe ve İngilizce metinleri özetleme desteği  
- OpenAI GPT tabanlı özetleme  
- Kullanıcı dostu web arayüzü  
- Dil seçimi (EN/TR)  
- Flask backend entegrasyonu  

---

## 🗂️ Proje Yapısı

summarizer-backend/
├── app.py # Flask backend
├── requirements.txt # Gerekli Python paketleri
├── templates/
│ └── index.html # Web arayüzü (HTML)
├── static/
│ └── script.js # Web arayüzü (JavaScript)


---

## ⚙️ Kurulum

### 1. Depoyu klonlayın veya dosyaları indirin
 
```bash
* git clone https://github.com/CanKolcu/Summarizer.git
* cd summarizer-backend

### Sanal ortam oluşturun

* python -m venv venv
* source venv/bin/activate  # Windows: venv\Scripts\activate

### Python kütüphanelerini yükleyin

* pip install -r requirements.txt

### app.py dosyasına kendi OpenAI API anahtarınızı girin:

* openai.api_key = "YOUR_API_KEY"

### uygulamayı başlatmak için komutu girin 

* python app.py
