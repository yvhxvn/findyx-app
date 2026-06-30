import crypto from "node:crypto";

/**
 * Перевіряє підпис initData, який Telegram передає у Mini App.
 * Без цієї перевірки будь-хто може підробити запит і видати себе
 * за іншого користувача (підмінити telegram_id, ім'я тощо).
 *
 * Документація: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): { isValid: boolean; data: Record<string, string> } {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  if (!hash) {
    return { isValid: false, data: {} };
  }

  // Дані сортуються за ключем і конкатенуються у вигляді "key=value"
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Секретний ключ — це HMAC-SHA256 від bot token зі статичною строкою "WebAppData"
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const isValid = computedHash === hash;

  const data: Record<string, string> = {};
  params.forEach((value, key) => {
    data[key] = value;
  });

  return { isValid, data };
}
