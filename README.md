# Findyx — стартовий каркас Mini App

Мінімальний робочий ланцюжок: **Telegram Mini App → дані юзера → бекенд перевіряє підпис**.
Без цього кроку далі рухатись немає сенсу — це фундамент авторизації для всього іншого.

## Структура

```
findyx-app/
├── src/                  # фронтенд (React + Vite + TS)
│   ├── App.tsx           # головний екран, показує юзера + кнопку перевірки
│   ├── useTelegram.ts    # хук доступу до Telegram WebApp SDK
│   └── telegram.d.ts     # типи для window.Telegram
└── backend/              # бекенд-заглушка (Express + TS)
    └── src/
        ├── index.ts                    # сервер, ендпоінт /auth/verify
        └── verifyTelegramInitData.ts   # HMAC-перевірка підпису (ВАЖЛИВО)
```

## Крок 1 — Локальний запуск фронтенду

```bash
npm install
npm run dev
```

Відкриється на `localhost:5173` у звичайному браузері — побачиш повідомлення
"Дані користувача не знайдено", це нормально: Telegram SDK працює тільки
всередині Telegram-клієнта.

## Крок 2 — Задеплоїти фронтенд (Vercel, безкоштовно)

1. Заведи акаунт на vercel.com, підключи GitHub
2. Заливаєш папку `findyx-app` (без `backend/`) в окремий репозиторій або
   налаштовуєш Vercel на конкретну підпапку
3. Vercel сам визначить Vite-проєкт, build команда: `npm run build`,
   output: `dist`
4. Отримаєш HTTPS-домен типу `findyx.vercel.app`

## Крок 3 — Прив'язати URL до бота

В Telegram у @BotFather:
```
/newapp
→ обрати findyxxx_bot
→ вказати назву, опис, іконку
→ Web App URL: https://findyx.vercel.app
```

Тепер відкрий бота в Telegram, натисни кнопку запуску застосунку — маєш
побачити свій профіль (ім'я, фото, telegram id).

## Крок 4 — Задеплоїти бекенд (Railway, безкоштовний tier)

```bash
cd backend
npm install
cp .env.example .env
# встав свій BOT_TOKEN з BotFather у .env
npm run dev
```

Локально перевір: `curl http://localhost:3001/health` має повернути `{"ok":true}`.

Потім:
1. Заведи акаунт на railway.app
2. New Project → Deploy from GitHub repo → обери папку `backend`
3. В Variables додай `BOT_TOKEN` (той самий, що в BotFather)
4. Railway видасть публічний URL типу `findyx-backend.up.railway.app`

## Крок 5 — З'єднати фронтенд з бекендом

У фронтенд-проєкті онови `.env`:
```
VITE_API_URL=https://findyx-backend.up.railway.app
```
Передеплой на Vercel (або додай цю змінну в налаштуваннях Vercel Environment Variables).

Тепер кнопка "Перевірити підпис на бекенді" в застосунку має повертати
`{"ok": true, "user": {...}}` — значить весь ланцюжок працює і можна рухатись
далі: профіль, БД, стрічка кандидатів.

## Що далі (наступні кроки, не зараз)

- БД (PostgreSQL) для зберігання профілів
- Екран заповнення анкети (фото, вік, місто, опис)
- Ендпоінт збереження/отримання профілю
- Базова модерація (репорт, бан)

Не додавай це все одразу — спочатку переконайся, що крок 1–5 повністю
працює і задеплоєно, це вже даватиме змогу показати щось реальне.
