import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyTelegramInitData } from "./verifyTelegramInitData.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.warn(
    "⚠️  BOT_TOKEN не задано в .env — /auth/verify завжди повертатиме помилку."
  );
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Цей ендпоінт викликає фронтенд при натисканні кнопки "Перевірити підпис"
app.post("/auth/verify", (req, res) => {
  const { initData } = req.body as { initData?: string };

  if (!BOT_TOKEN) {
    return res.status(500).json({ error: "BOT_TOKEN не налаштовано на сервері" });
  }

  if (!initData) {
    return res.status(400).json({ error: "initData відсутній у запиті" });
  }

  const { isValid, data } = verifyTelegramInitData(initData, BOT_TOKEN);

  if (!isValid) {
    return res.status(401).json({ error: "Підпис недійсний — запит підроблено" });
  }

  // Тут далі: знайти або створити користувача в БД за data.user.id
  res.json({ ok: true, user: data.user ? JSON.parse(data.user) : null });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Findyx backend запущено на порту ${PORT}`);
});
