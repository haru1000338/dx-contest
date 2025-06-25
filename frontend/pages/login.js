import { useState } from "react";
import { login } from "../lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    setUserId(res.user_id);
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
            width: "90vw",
            maxWidth: "400px",
            padding: "6vw 4vw",
            background: "white",
            borderRadius: "4vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            ログイン
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              alignItems: "center",
            }}
          >
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="メールアドレス"
              style={{
                border: "1px solid #ccc",
                padding: "2vw",
                width: "80%",
                fontSize: "1rem",
                boxSizing: "border-box",
                borderRadius: "1vw",
              }}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="パスワード"
              style={{
                border: "1px solid #ccc",
                padding: "2vw",
                width: "80%",
                fontSize: "1rem",
                boxSizing: "border-box",
                borderRadius: "1vw",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                textAlign: "center",
                border: "none",
              }}
            >
              ログイン
            </button>
          </form>
          {userId && (
            <p style={{ marginTop: "1rem", color: "green" }}>
              ログイン成功: ユーザーID {userId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
