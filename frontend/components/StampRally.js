import React, { useState } from "react";

const initialStamps = [
  {
    id: "hachioji-castle",
    name: "八王子城跡",
    description: "戦国時代の山城の遺地。関東有数の規模を誇ります。",
    imageUrl:
      "https://via.placeholder.com/150x150/FFD700/FFFFFF?text=HachiojiCastle",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "mount-takao",
    name: "高尾山",
    description: "都心から手軽に行ける自然豊かな山。ミシュラン三つ星評価。",
    imageUrl: "https://via.placeholder.com/150x150/8BC34A/FFFFFF?text=MtTakao",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "musashi-ichinomiya",
    name: "武蔵一宮 氷川神社",
    description: "2000年以上の歴史を持つとされる由緒ある神社です。",
    imageUrl:
      "https://via.placeholder.com/150x150/FF6347/FFFFFF?text=HikawaJinja",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "kawagoe-warehouse",
    name: "川越一番街",
    description: "蔵造りの町並みが美しい「小江戸」として知られています。",
    imageUrl: "https://via.placeholder.com/150x150/87CEEB/FFFFFF?text=Kawagoe",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "lake-okutama",
    name: "奥多摩湖",
    description: "多摩川をせき止めて作られた人造湖。美しい景観が広がります。",
    imageUrl:
      "https://via.placeholder.com/150x150/6A5ACD/FFFFFF?text=OkutamaLake",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "tachikawa-park",
    name: "国営昭和記念公園",
    description: "広大な敷地を持つ都内有数の公園。四季折々の花が楽しめます。",
    imageUrl:
      "https://via.placeholder.com/150x150/FFB6C1/FFFFFF?text=ShowaPark",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "chofu-jindaiji",
    name: "深大寺",
    description: "東京都内で2番目に古いお寺。そばが名物です。",
    imageUrl: "https://via.placeholder.com/150x150/FFDAB9/FFFFFF?text=Jindaiji",
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "fuchu-okunitama",
    name: "大國魂神社",
    description: "武蔵国の総社。歴史あるお祭りでも有名です。",
    imageUrl:
      "https://via.placeholder.com/150x150/DA70D6/FFFFFF?text=OkunitamaJinja",
    isAcquired: false,
    acquiredDate: null,
  },
];

export default function StampRally() {
  const [screen, setScreen] = useState("map");
  const [stamps, setStamps] = useState(initialStamps);
  const [modal, setModal] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrError, setQrError] = useState("");

  // QRコード読み取り時の処理
  const handleScan = (data) => {
    if (data) {
      // QRコードの内容に一致するスタンプを獲得
      const found = stamps.find((s) => data.includes(s.id));
      if (found && !found.isAcquired) {
        setStamps((prev) =>
          prev.map((s) =>
            s.id === found.id
              ? {
                  ...s,
                  isAcquired: true,
                  acquiredDate: new Date().toLocaleString("ja-JP"),
                }
              : s
          )
        );
        setModal({
          ...found,
          isAcquired: true,
          acquiredDate: new Date().toLocaleString("ja-JP"),
        });
      }
      setQrOpen(false);
    }
  };
  const handleError = (err) => {
    setQrError("カメラの起動に失敗しました: " + err?.message);
  };

  // スタンプ帳の描画
  const renderStampBook = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>マイスタンプ帳</h2>
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        {stamps.filter((s) => s.isAcquired).length} / {stamps.length}{" "}
        個のスタンプをゲット！
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 15,
        }}
      >
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            style={{
              background: stamp.isAcquired ? "#fff" : "#f0f0f0",
              borderRadius: 8,
              padding: 10,
              boxShadow: stamp.isAcquired
                ? "0 2px 5px rgba(0,0,0,0.08)"
                : "inset 0 1px 3px rgba(0,0,0,0.1)",
              opacity: stamp.isAcquired ? 1 : 0.6,
              filter: stamp.isAcquired ? "none" : "grayscale(100%)",
              cursor: stamp.isAcquired ? "pointer" : "default",
              textAlign: "center",
            }}
            onClick={() => stamp.isAcquired && setModal(stamp)}
          >
            <img
              src={stamp.imageUrl}
              alt={stamp.name}
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 8,
                border: "2px solid #ddd",
              }}
            />
            <p
              style={{
                fontWeight: "bold",
                color: stamp.isAcquired ? "#444" : "#888",
              }}
            >
              {stamp.isAcquired ? stamp.name : "？"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // モーダル
  const renderModal = () =>
    modal && (
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
        onClick={() => setModal(null)}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 30,
            maxWidth: 350,
            width: "90%",
            textAlign: "center",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 15,
              fontSize: 28,
              fontWeight: "bold",
              color: "#aaa",
              cursor: "pointer",
            }}
            onClick={() => setModal(null)}
          >
            &times;
          </span>
          <img
            src={modal.imageUrl}
            alt={modal.name}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 15,
              border: "3px solid #007bff",
            }}
          />
          <h3>{modal.name}</h3>
          <p>{modal.description}</p>
          <p style={{ fontSize: "0.8em", color: "#888" }}>
            {modal.acquiredDate ? `獲得日時: ${modal.acquiredDate}` : "未獲得"}
          </p>
        </div>
      </div>
    );

  // 画面切り替え
  return (
    <div
      style={{
        background: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: 25,
          width: "100%",
          maxWidth: 400,
          marginTop: 20,
          marginBottom: 90,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            color: "#333",
            marginBottom: 25,
            fontSize: "1.6em",
            textAlign: "center",
          }}
        >
          自転車観光スタンプラリー
        </h1>
        {/* 画面切り替え */}
        {screen === "map" && (
          <div>
            <h2>マップ</h2>
            <div
              style={{
                background: "#e9ecef",
                border: "2px dashed #ced4da",
                borderRadius: 8,
                height: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: "1.1em",
                marginBottom: 20,
              }}
            >
              <p>🗺️ 地図のプレースホルダー</p>
              <p>(今回は地図サービスの実装はしていません)</p>
            </div>
          </div>
        )}
        {screen === "camera" && (
          <div>
            <h2>スタンプをゲット！</h2>
            <p>
              観光地に到着したら、QRコードをスキャンしてスタンプを獲得できます。<br />
              ※現在カメラ機能は一時停止中です。
            </p>
            <button
              style={{
                background: "#aaa",
                fontWeight: "bold",
                fontSize: "1.1em",
                padding: "12px 25px",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                marginTop: 20,
                cursor: "not-allowed",
                opacity: 0.7,
              }}
              disabled
            >
              カメラ機能は現在ご利用いただけません
            </button>
          </div>
        )}
        {screen === "stampBook" && renderStampBook()}
        {/* クーポン画面は省略可 */}
      </div>
      {/* フッターナビ */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 70,
          background: "#fff",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.1)",
          borderTop: "1px solid #e0e0e0",
          zIndex: 90,
        }}
      >
        <a
          href="#"
          style={{
            flex: 1,
            color: screen === "map" ? "#007bff" : "#777",
            textAlign: "center",
            fontWeight: screen === "map" ? "bold" : "normal",
            textDecoration: "none",
            fontSize: "0.8em",
            padding: "5px 0",
          }}
          onClick={(e) => {
            e.preventDefault();
            setScreen("map");
          }}
        >
          マップ
        </a>
        <a
          href="#"
          style={{
            flex: 1,
            color: screen === "camera" ? "#007bff" : "#777",
            textAlign: "center",
            fontWeight: screen === "camera" ? "bold" : "normal",
            textDecoration: "none",
            fontSize: "0.8em",
            padding: "5px 0",
          }}
          onClick={(e) => {
            e.preventDefault();
            setScreen("camera");
          }}
        >
          カメラ
        </a>
        <a
          href="#"
          style={{
            flex: 1,
            color: screen === "stampBook" ? "#007bff" : "#777",
            textAlign: "center",
            fontWeight: screen === "stampBook" ? "bold" : "normal",
            textDecoration: "none",
            fontSize: "0.8em",
            padding: "5px 0",
          }}
          onClick={(e) => {
            e.preventDefault();
            setScreen("stampBook");
          }}
        >
          スタンプ
        </a>
      </nav>
      {renderModal()}
    </div>
  );
}
