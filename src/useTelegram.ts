import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (!tg) {
      // Опен у звичайному браузері — для розробки без Telegram
      console.warn("Telegram WebApp SDK не знайдено. Відкрий через бота.");
      setIsReady(true);
      return;
    }

    tg.ready();
    tg.expand();
    setUser(tg.initDataUnsafe.user ?? null);
    setIsReady(true);
  }, [tg]);

  return {
    tg,
    user,
    isReady,
    initData: tg?.initData ?? "",
    colorScheme: tg?.colorScheme ?? "light",
  };
}
