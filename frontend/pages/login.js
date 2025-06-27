import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push("/stamprally");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        maxWidth: 430,
        margin: "0 auto",
        padding: 0,
      }}
    >
      {/* タイトルカード */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: 25,
          width: "100%",
          maxWidth: 400,
          marginTop: 36,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#007bff",
            marginBottom: 10,
            fontSize: "1.7em",
            fontWeight: "bold",
            letterSpacing: "0.04em",
          }}
        >
          サイクル観光スタンプラリー
        </h1>
        <p style={{ color: "#555", fontSize: "1em", margin: 0 }}>
          ログインしてスタンプラリーを始めよう！
        </p>
      </div>
      {/* ログインフォームカード */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: 25,
          width: "100%",
          maxWidth: 400,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.3em",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#007bff",
            letterSpacing: "0.05em",
          }}
        >
          ログイン
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            width: "100%",
            alignItems: "center",
          }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="メールアドレス"
            style={{
              border: "1.5px solid #ccc",
              padding: "14px 12px",
              width: "90%",
              fontSize: "1.1rem",
              boxSizing: "border-box",
              borderRadius: "8px",
              background: "#fafbfc",
              outline: "none",
              marginBottom: "0.5rem",
              transition: "border 0.2s",
            }}
            inputMode="email"
            autoComplete="username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="パスワード"
            style={{
              border: "1.5px solid #ccc",
              padding: "14px 12px",
              width: "90%",
              fontSize: "1.1rem",
              boxSizing: "border-box",
              borderRadius: "8px",
              background: "#fafbfc",
              outline: "none",
              marginBottom: "0.5rem",
              transition: "border 0.2s",
            }}
            autoComplete="current-password"
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "14px 0",
              width: "90%",
              fontSize: "1.2rem",
              borderRadius: "8px",
              textAlign: "center",
              border: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
              marginTop: "0.5rem",
              letterSpacing: "0.05em",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
          >
            ログイン
          </button>
        </form>
        {userId && (
          <p
            style={{
              marginTop: "1.5rem",
              color: "green",
              fontSize: "1.1rem",
            }}
          >
            ログイン成功: ユーザーID {userId}
          </p>
        )}
      </div>
    </div>
  );
}
