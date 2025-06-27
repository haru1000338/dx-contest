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
        margin: 0,
        padding: 0,
        backgroundColor: "orange",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: 0,
          width: "100%",
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          transform: "translateY(-50%)",
        }}
      >
        アプリ名
      </div>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "95vw",
            maxWidth: "400px",
            padding: "8vw 4vw",
            background: "white",
            borderRadius: "6vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            margin: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "2.5rem",
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            ログイン
          </h1>
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
                padding: "4vw 3vw",
                width: "90%",
                fontSize: "1.1rem",
                boxSizing: "border-box",
                borderRadius: "2vw",
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
                padding: "4vw 3vw",
                width: "90%",
                fontSize: "1.1rem",
                boxSizing: "border-box",
                borderRadius: "2vw",
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
                padding: "4vw 0",
                width: "90%",
                fontSize: "1.2rem",
                borderRadius: "2vw",
                textAlign: "center",
                border: "none",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                marginTop: "0.5rem",
                letterSpacing: "0.05em",
                transition: "background 0.2s",
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
    </div>
  );
}
