# 🏢 JumushTap — Жумуш Табуу Платформасы

> Django + React Native менен жасалган жумуш табуу мобилдик колдонмосу (студенттер үчүн)

---

## 📁 Структура

```
jumush.tap/
├── backend/          # Django REST API
│   ├── users/        # Колдонуучулар (аутентификация, профиль)
│   ├── jobs/         # Вакансиялар, сакталгандар, рейтинг
│   └── config/       # Django settings, urls
│
└── frontend/         # React Native (Expo)
    └── src/
        ├── screens/  # Login, Home, PostJob, MyJobs, Bookmarks, Profile
        ├── navigation/
        ├── context/  # AuthContext
        └── api/      # Axios API calls
```

---

## 🚀 Backend'ди ишке киргизүү

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### API Endpoints

| Method | URL | Сүрөттөмө |
|--------|-----|-----------|
| POST | `/api/users/register/` | Катталуу (аты + телефон) |
| POST | `/api/users/login/` | Кируу (телефон) |
| GET/PATCH | `/api/users/profile/` | Профиль |
| GET/POST | `/api/jobs/` | Вакансияларды көрүү/жарыялоо |
| GET | `/api/jobs/?q=ашпоз` | Издөө |
| GET/DELETE | `/api/jobs/<id>/` | Жеке вакансия |
| POST | `/api/jobs/<id>/bookmark/` | Сактоо/алып салуу |
| POST | `/api/jobs/<id>/rate/` | Рейтинг берүү |
| GET | `/api/jobs/my/` | Менин вакансияларым |
| GET | `/api/jobs/bookmarks/` | Сакталгандар |

---

## 📱 Frontend'ди ишке киргизүү

```bash
cd frontend
npm install
npx expo start
```

### IP дарек

`src/api/index.js` файлында туура IP дарекке өзгөртүңүз:

```js
// Android эмулятору
export const BASE_URL = 'http://10.0.2.2:8000';

// iOS симулятору  
export const BASE_URL = 'http://localhost:8000';

// Реалдуу телефон — компьютерин IP дарегин жазыңыз
export const BASE_URL = 'http://192.168.1.XXX:8000';
```

---

## 🎨 Экрандар

| Экран | Сүрөттөмө |
|-------|-----------|
| **Login** | Катталуу / Кируу (аты + телефон) |
| **Home** | Вакансиялар тизмеси, издөө |
| **PostJob** | Жаңы вакансия жарыялоо |
| **MyJobs** | Менин вакансияларым |
| **Bookmarks** | Сакталган вакансиялар |
| **Profile** | Профиль өзгөртүү, статистика |

---

## 🛠 Технологиялар

- **Backend:** Django 4.2, DRF, JWT, SQLite
- **Frontend:** React Native, Expo, React Navigation, Axios
- **Auth:** Телефон номери боюнча (сырсөз жок)
