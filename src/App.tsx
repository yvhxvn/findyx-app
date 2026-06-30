import { useState } from "react";
import { useTelegram } from "./useTelegram";
import "./App.css";

function App() {
  const { user, isReady, colorScheme, initData } = useTelegram();
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // URL твого бекенду, поки заглушка — заміниш на реальний після деплою бекенду
  const API_URL = import.meta.env.VITE_API_URL || "https://your-backend.example.com";

  const handleVerify = async () => {
    setLoading(true);
    setVerifyResult(null);
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();
      setVerifyResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setVerifyResult("Помилка: бекенд ще не підʼєднано. Це нормально на цьому кроці.");
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return <div className="container">Завантаження...</div>;
  }

  return (
    <div className={`container ${colorScheme}`}>
      <h1>Findyx</h1>
      <p className="subtitle">Каркас Mini App — крок 1: перевірка зв'язку з Telegram</p>

      {user ? (
        <div className="card">
          {user.photo_url && (
            <img className="avatar" src={user.photo_url} alt={user.first_name} />
          )}
          <p>
            Привіт, <b>{user.first_name}</b>
            {user.username && <span> (@{user.username})</span>}!
          </p>
          <p className="muted">Telegram ID: {user.id}</p>
        </div>
      ) : (
        <div className="card warning">
          Дані користувача не знайдено. Якщо ти бачиш це у звичайному браузері — це
          нормально, відкрий через бота в Telegram.
        </div>
      )}

      <button className="verify-btn" onClick={handleVerify} disabled={loading}>
        {loading ? "Перевіряю..." : "Перевірити підпис на бекенді"}
      </button>

      {verifyResult && <pre className="result">{verifyResult}</pre>}
    </div>
  );
}

export default App;
