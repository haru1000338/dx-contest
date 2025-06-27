import React, { useState } from "react";
import dynamic from "next/dynamic";

const initialStamps = [
  {
    id: "hachioji-castle",
    name: "八王子城跡",
    description: "戦国時代の山城の遺地。関東有数の規模を誇ります。",
    imageUrl:
      "https://placehold.jp/FFD700/444/150x150.png?text=%E5%85%AB%E7%8E%8B%E5%AD%90%E5%9F%8E%E8%B7%A1",
    lat: 35.6626,
    lng: 139.2436,
    isAcquired: true,
    acquiredDate: "2025/06/27 12:00:00",
  },
  {
    id: "mount-takao",
    name: "高尾山",
    description: "都心から手軽に行ける自然豊かな山。ミシュラン三つ星評価。",
    imageUrl:
      "https://placehold.jp/8BC34A/444/150x150.png?text=%E9%AB%98%E5%B0%BE%E5%B1%B1",
    lat: 35.6251,
    lng: 139.243,
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "hachioji-yume-art-museum",
    name: "八王子市夢美術館",
    description: "多彩な企画展が開催される八王子中心部の美術館。",
    imageUrl:
      "https://placehold.jp/FFB6C1/444/150x150.png?text=%E5%85%AB%E7%8E%8B%E5%AD%90%E5%B8%82%E5%A4%A2%E7%BE%8E%E8%A1%93%E9%A4%A8",
    lat: 35.6565,
    lng: 139.3382,
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "yakuoin",
    name: "高尾山薬王院",
    description: "高尾山山頂近くの歴史ある寺院。パワースポットとしても有名。",
    imageUrl:
      "https://placehold.jp/90EE90/444/150x150.png?text=%E8%96%AC%E7%8E%8B%E9%99%A2",
    lat: 35.6301,
    lng: 139.2437,
    isAcquired: false,
    acquiredDate: null,
  },
  {
    id: "fujimori-park",
    name: "富士森公園",
    description: "桜の名所としても知られる八王子市内の大きな公園。",
    imageUrl:
      "https://placehold.jp/ADD8E6/444/150x150.png?text=%E5%AF%8C%E5%A3%AB%E6%A3%AE%E5%85%AC%E5%9C%92",
    lat: 35.6485,
    lng: 139.3307,
    isAcquired: false,
    acquiredDate: null,
  },
];

const coupons = [
  {
    id: "coupon1",
    title: "テスト用クーポンA",
    description: "これはテスト用のクーポンです。〇〇円引きです。",
    expires: "2025-12-31",
    used: false,
  },
  {
    id: "coupon2",
    title: "テスト用クーポンB",
    description: "これはテスト用のクーポンです。△△％割引です。",
    expires: "2025-09-30",
    used: false,
  },
  {
    id: "coupon3",
    title: "テスト用クーポンC",
    description: "これはテスト用のクーポンです。",
    expires: "2025-08-31",
    used: false,
  },
];

// 地図部分だけクライアントサイド限定で動的import
const MapWithMarkers = dynamic(() => import("./StampRallyMap"), { ssr: false });

export default function StampRally() {
  const [screen, setScreen] = useState("map");
  const [stamps, setStamps] = useState(initialStamps);
  const [modal, setModal] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrError, setQrError] = useState("");
  const [couponList, setCouponList] = useState(coupons);
  // 検索バー連携用
  const [mapQuery, setMapQuery] = useState("");

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
          {/* スタンプ獲得メッセージ */}
          {modal.acquiredDate && (
            <div
              style={{
                fontWeight: "bold",
                color: "#007bff",
                fontSize: "1.15em",
                marginBottom: 10,
              }}
            >
              {modal.name}のスタンプを獲得しました！
            </div>
          )}
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
      {/* タイトルカード */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: 25,
          width: "100%",
          maxWidth: 400,
          marginTop: 24,
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
          自転車観光スタンプラリー
        </h1>
        <p style={{ color: "#555", fontSize: "1em", margin: 0 }}>
          八王子市内の観光スポットを巡ってスタンプを集めよう！
        </p>
      </div>
      {/* 画面切り替え */}
      {screen === "map" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            padding: 25,
            width: "100%",
            maxWidth: 400,
            marginBottom: 24,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              color: "#007bff",
              fontWeight: "bold",
              fontSize: "1.2em",
              marginBottom: 12,
            }}
          >
            マップ
          </h2>
          <div
            style={{
              background: "#e9ecef",
              border: "2px dashed #ced4da",
              borderRadius: 8,
              height: 320,
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <MapWithMarkers
              stamps={stamps}
              query={mapQuery}
              setQuery={setMapQuery}
            />
          </div>
          {/* 観光地リストを地図の下に表示 */}
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: 8,
              padding: "12px 10px 8px 10px",
              marginBottom: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1em",
                margin: "0 0 8px 0",
                color: "#007bff",
              }}
            >
              観光地リスト
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {stamps.map((spot) => (
                <li
                  key={spot.id}
                  style={{
                    marginBottom: 10,
                    padding: "7px 0 7px 0",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => setMapQuery(spot.name)}
                >
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {spot.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.93em",
                      color: "#666",
                      marginLeft: 6,
                    }}
                  >
                    {spot.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {screen === "camera" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            padding: 25,
            width: "100%",
            maxWidth: 400,
            marginBottom: 24,
            flexGrow: 1,
            overflowY: "auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#007bff",
              fontWeight: "bold",
              fontSize: "1.2em",
              marginBottom: 12,
            }}
          >
            スタンプをゲット！
          </h2>
          <p>
            観光地に到着したら、QRコードをスキャンしてスタンプを獲得できます。
            <br />
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
      {screen === "stampBook" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            padding: 25,
            width: "100%",
            maxWidth: 400,
            marginBottom: 24,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {renderStampBook()}
        </div>
      )}
      {screen === "coupon" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            margin: "0 auto 24px auto",
            padding: "18px 10px 12px 10px",
            maxWidth: 400,
            minHeight: 80,
            textAlign: "center",
            color: "#444",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              marginBottom: 18,
              color: "#007bff",
              fontWeight: "bold",
              fontSize: "1.3em",
            }}
          >
            クーポン
          </h2>
          {couponList.length === 0 ? (
            <p style={{ color: "#888" }}>利用可能なクーポンはありません。</p>
          ) : (
            <div style={{ width: "100%", maxWidth: 360 }}>
              {/* 未使用クーポン */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                    color: "#007bff",
                    marginBottom: 8,
                    textAlign: "left",
                  }}
                >
                  未使用クーポン
                </div>
                {couponList.filter((c) => !c.used).length === 0 ? (
                  <div
                    style={{
                      color: "#aaa",
                      fontSize: "0.97em",
                      marginBottom: 12,
                    }}
                  >
                    未使用のクーポンはありません。
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 14,
                    }}
                  >
                    {couponList
                      .filter((c) => !c.used)
                      .map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: "#f8fbff",
                            borderRadius: 10,
                            boxShadow: "0 2px 8px rgba(0,123,255,0.07)",
                            padding: "16px 12px 12px 12px",
                            textAlign: "left",
                            marginBottom: 0,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.08em",
                              marginBottom: 6,
                              color: "#007bff",
                            }}
                          >
                            {c.title}
                          </div>
                          <div style={{ fontSize: "0.97em", marginBottom: 8 }}>
                            {c.description}
                          </div>
                          <div
                            style={{
                              fontSize: "0.89em",
                              color: "#888",
                              marginBottom: 8,
                            }}
                          >
                            有効期限: {c.expires}
                          </div>
                          <button
                            style={{
                              background: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "8px 22px",
                              fontWeight: "bold",
                              fontSize: "1em",
                              cursor: "pointer",
                              boxShadow: "0 1px 4px rgba(0,123,255,0.08)",
                            }}
                            onClick={() => {
                              setCouponList((prev) =>
                                prev.map((item) =>
                                  item.id === c.id
                                    ? { ...item, used: true }
                                    : item
                                )
                              );
                              alert("クーポンを利用しました！（ダミー動作）");
                            }}
                          >
                            利用する
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {/* 区切り線 */}
              <hr
                style={{
                  border: 0,
                  borderTop: "1px dashed #bbb",
                  margin: "18px 0 10px 0",
                }}
              />
              {/* 使用済みクーポン */}
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.05em",
                    color: "#888",
                    marginBottom: 8,
                    textAlign: "left",
                  }}
                >
                  使用済みクーポン
                </div>
                {couponList.filter((c) => c.used).length === 0 ? (
                  <div style={{ color: "#aaa", fontSize: "0.97em" }}>
                    使用済みのクーポンはありません。
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 14,
                    }}
                  >
                    {couponList
                      .filter((c) => c.used)
                      .map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: "#f3f3f3",
                            borderRadius: 10,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                            padding: "16px 12px 12px 12px",
                            textAlign: "left",
                            opacity: 0.7,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: "1.08em",
                              marginBottom: 6,
                              color: "#888",
                            }}
                          >
                            {c.title}
                          </div>
                          <div style={{ fontSize: "0.97em", marginBottom: 8 }}>
                            {c.description}
                          </div>
                          <div
                            style={{
                              fontSize: "0.89em",
                              color: "#888",
                              marginBottom: 8,
                            }}
                          >
                            有効期限: {c.expires}
                          </div>
                          <button
                            style={{
                              background: "#ccc",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "8px 22px",
                              fontWeight: "bold",
                              fontSize: "1em",
                              cursor: "not-allowed",
                              opacity: 0.7,
                            }}
                            disabled
                          >
                            利用済み
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {renderModal()}
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
        <a
          href="#"
          style={{
            flex: 1,
            color: screen === "coupon" ? "#007bff" : "#777",
            textAlign: "center",
            fontWeight: screen === "coupon" ? "bold" : "normal",
            textDecoration: "none",
            fontSize: "0.8em",
            padding: "5px 0",
          }}
          onClick={(e) => {
            e.preventDefault();
            setScreen("coupon");
          }}
        >
          クーポン
        </a>
      </nav>
    </div>
  );
}
