import React, { useState } from "react";
import dynamic from "next/dynamic";

const initialStamps = [
  {
    id: "hachioji-castle",
    name: "八王子城跡",
    description: "歴史的な価値が高いスポット。",
    imageUrl:
      "https://placehold.jp/FFD700/444/150x150.png?text=%E5%85%AB%E7%8E%8B%E5%AD%90%E5%9F%8E%E8%B7%A1",
    lat: 35.6626,
    lng: 139.2436,
    isAcquired: true,
    acquiredDate: "2025/06/27 12:00:00",
    visitCount: 3,
  },
  {
    id: "mount-takao",
    name: "高尾山",
    description: "都心から手軽に行ける自然豊かな山。四季折々の景色が楽しめます。",
    imageUrl:
      "https://placehold.jp/8BC34A/444/150x150.png?text=%E9%AB%98%E5%B0%BE%E5%B1%B1",
    lat: 35.6251,
    lng: 139.243,
    isAcquired: true,
    acquiredDate: "2025/06/25 10:30:00",
    visitCount: 2,
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
    visitCount: 0,
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
    visitCount: 0,
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
    visitCount: 0,
  },
  {
    id: "southern-sky-tower",
    name: "サザンスカイタワー八王子",
    description:
      "八王子駅南口直結の高層複合施設。展望やショッピングも楽しめる。",
    imageUrl:
      "https://placehold.jp/FF6347/444/150x150.png?text=%E3%82%B5%E3%82%B6%E3%83%B3%E3%82%B9%E3%82%AB%E3%82%A4%E3%82%BF%E3%83%AF%E3%83%BC",
    lat: 35.6506,
    lng: 139.3402,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "takao-onsen",
    name: "高尾山口温泉",
    description: "高尾山口駅すぐの天然温泉。登山帰りにおすすめ。",
    imageUrl:
      "https://placehold.jp/FFA07A/444/150x150.png?text=%E9%AB%98%E5%B0%BE%E5%B1%B1%E5%8F%A3%E6%B8%A9%E6%B3%89",
    lat: 35.6242,
    lng: 139.2706,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "tokyo-fuji-museum",
    name: "東京富士美術館",
    description: "国内外の名画や企画展が楽しめる美術館。",
    imageUrl:
      "https://placehold.jp/87CEEB/444/150x150.png?text=%E6%9D%B1%E4%BA%AC%E5%AF%8C%E5%A3%AB%E7%BE%8E%E8%A1%93%E9%A4%A8",
    lat: 35.6681,
    lng: 139.3162,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "takiyama-castle",
    name: "滝山城跡",
    description: "戦国時代の山城跡。春は桜の名所。",
    imageUrl:
      "https://placehold.jp/DA70D6/444/150x150.png?text=%E6%BB%9D%E5%B1%B1%E5%9F%8E%E8%B7%A1",
    lat: 35.6931,
    lng: 139.3386,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "yuuyake-koyake",
    name: "夕やけ小やけふれあいの里",
    description: "自然や動物とふれあえる体験型施設。家族連れに人気。",
    imageUrl:
      "https://placehold.jp/FFDAB9/444/150x150.png?text=%E5%A4%95%E3%82%84%E3%81%91%E5%B0%8F%E3%82%84%E3%81%91",
    lat: 35.6689,
    lng: 139.1567,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "kitano-tenjin",
    name: "北野天神社",
    description: "学問の神様を祀る歴史ある神社。受験生に人気。",
    imageUrl:
      "https://placehold.jp/FFE4B5/444/150x150.png?text=%E5%8C%97%E9%87%8E%E5%A4%A9%E7%A5%9E%E7%A4%BE",
    lat: 35.6562,
    lng: 139.3532,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "koyasu-shrine",
    name: "子安神社",
    description: "安産祈願で有名な八王子最古の神社。",
    imageUrl:
      "https://placehold.jp/FFE4E1/444/150x150.png?text=%E5%AD%90%E5%AE%89%E7%A5%9E%E7%A4%BE",
    lat: 35.6567,
    lng: 139.3385,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "asakawa-bunker",
    name: "浅川地下壕跡",
    description: "戦時中の地下壕跡。歴史を学べる貴重なスポット。",
    imageUrl:
      "https://placehold.jp/708090/fff/150x150.png?text=%E6%B5%85%E5%B7%9D%E5%9C%B0%E4%B8%8B%E5%A3%95",
    lat: 35.6502,
    lng: 139.3201,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
  },
  {
    id: "takao599museum",
    name: "高尾599ミュージアム",
    description: "高尾山の自然や生態系を学べる体験型ミュージアム。",
    imageUrl:
      "https://placehold.jp/98FB98/444/150x150.png?text=%E9%AB%98%E5%B0%BE599%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%B8%E3%82%A2%E3%83%A0",
    lat: 35.6247,
    lng: 139.2702,
    isAcquired: false,
    acquiredDate: null,
    visitCount: 0,
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
  // 今日行くリスト機能
  const [todayList, setTodayList] = useState([]);
  const [activeTab, setActiveTab] = useState("spots");

  // 訪問回数に応じた星を表示する関数
  const getStarsDisplay = (visitCount) => {
    if (visitCount === 0) return "";
    const starCount = Math.min(visitCount, 5); // 最大5つの星まで表示
    return "★".repeat(starCount) + (visitCount > 5 ? `(${visitCount})` : "");
  };

  // QRコード読み取り時の処理
  const handleScan = (data) => {
    if (data) {
      // QRコードの内容に一致するスタンプを獲得
      const found = stamps.find((s) => data.includes(s.id));
      if (found) {
        setStamps((prev) =>
          prev.map((s) =>
            s.id === found.id
              ? {
                  ...s,
                  isAcquired: true,
                  acquiredDate: s.isAcquired ? s.acquiredDate : new Date().toLocaleString("ja-JP"),
                  visitCount: s.visitCount + 1,
                }
              : s
          )
        );
        setModal({
          ...found,
          isAcquired: true,
          acquiredDate: found.isAcquired ? found.acquiredDate : new Date().toLocaleString("ja-JP"),
          visitCount: found.visitCount + 1,
        });
      }
      setQrOpen(false);
    }
  };
  const handleError = (err) => {
    setQrError("カメラの起動に失敗しました: " + err?.message);
  };

  // 今日行くリストに追加・削除
  const addToTodayList = (spot) => {
    if (!todayList.find((item) => item.id === spot.id)) {
      setTodayList((prev) => [...prev, spot]);
    }
  };

  const removeFromTodayList = (spotId) => {
    setTodayList((prev) => prev.filter((item) => item.id !== spotId));
  };

  // スタンプ帳の描画
  const renderStampBook = () => {
    const acquiredCount = stamps.filter((s) => s.isAcquired).length;
    const couponThreshold = 5;
    const canIssueCoupon =
      acquiredCount > 0 && acquiredCount % couponThreshold === 0;
    // 既に発行済みの「スタンプ達成クーポン」の数
    const issuedCount = couponList.filter((c) =>
      c.id.startsWith("stamp-coupon-")
    ).length;
    // 次に発行できる達成クーポン番号
    const nextCouponNum = issuedCount + 1;

    const handleIssueCoupon = () => {
      const newCoupon = {
        id: `stamp-coupon-${nextCouponNum}`,
        title: `スタンプ${acquiredCount}個達成クーポン`,
        description: `スタンプ${acquiredCount}個達成記念！特別クーポンです。`,
        expires: "2025-12-31",
        used: false,
      };
      setCouponList((prev) => [...prev, newCoupon]);
    };

    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>マイスタンプ帳</h2>
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          {acquiredCount} / {stamps.length} 個のスタンプをゲット！
        </p>
        {/* クーポン発行ボタン */}
        <div style={{ textAlign: "center", margin: "18px 0 10px 0" }}>
          <button
            style={{
              background: canIssueCoupon ? "#007bff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: "bold",
              fontSize: "1.1em",
              boxShadow: canIssueCoupon
                ? "0 2px 8px rgba(0,123,255,0.08)"
                : "none",
              cursor: canIssueCoupon ? "pointer" : "not-allowed",
              opacity: canIssueCoupon ? 1 : 0.6,
              marginBottom: 8,
              transition: "background 0.2s",
            }}
            disabled={!canIssueCoupon}
            onClick={canIssueCoupon ? handleIssueCoupon : undefined}
          >
            {canIssueCoupon
              ? `クーポンを発行する（${acquiredCount}個達成）`
              : `5個ごとにクーポン発行！`}
          </button>
          {canIssueCoupon && (
            <div
              style={{
                color: "#007bff",
                fontSize: "0.97em",
                marginTop: 4,
              }}
            >
              スタンプ{acquiredCount}個達成！クーポンを発行できます
            </div>
          )}
        </div>
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
  };

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
              {modal.visitCount > 1 
                ? `${modal.name}に${modal.visitCount}回目の訪問です！` 
                : `${modal.name}のスタンプを獲得しました！`}
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
          <h3>
            {modal.name}
            {modal.visitCount > 0 && (
              <span style={{ color: "#FFD700", marginLeft: "8px", fontSize: "0.9em" }}>
                {getStarsDisplay(modal.visitCount)}
              </span>
            )}
          </h3>
          <p>{modal.description}</p>
          <p style={{ fontSize: "0.8em", color: "#888" }}>
            {modal.acquiredDate ? `初回訪問: ${modal.acquiredDate}` : "未獲得"}
            {modal.visitCount > 0 && (
              <>
                <br />
                訪問回数: {modal.visitCount}回
              </>
            )}
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
          <div
            style={{
              fontSize: "0.85em",
              color: "#666",
              marginBottom: 15,
              padding: "8px 12px",
              background: "#f8f9fa",
              borderRadius: 6,
            }}
          >
            💡 観光地名をクリックすると地図に表示されます。経路検索は利用制限があるため、頻繁な使用はお控えください。
          </div>
          {/* タブUI付きの観光地リストと今日行くリスト */}
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: 8,
              padding: "12px 10px 8px 10px",
              marginBottom: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* タブヘッダー */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <button
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#007bff",
                  color: "#fff",
                  fontSize: "0.95em",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setActiveTab(activeTab === "spots" ? "today" : "spots")}
              >
                {activeTab === "spots" 
                  ? `今日行くリスト (${todayList.length})` 
                  : "観光地リスト"}
              </button>
            </div>

            {/* 観光地リストタブ */}
            {activeTab === "spots" && (
              <div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {stamps.map((spot) => (
                    <li
                      key={spot.id}
                      style={{
                        marginBottom: 10,
                        padding: "7px 0 7px 0",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{ cursor: "pointer", flex: 1 }}
                        onClick={() => setMapQuery(spot.name)}
                      >
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          {spot.name}
                          {spot.visitCount > 0 && (
                            <span style={{ color: "#FFD700", marginLeft: "6px" }}>
                              {getStarsDisplay(spot.visitCount)}
                            </span>
                          )}
                        </span>
                        <br />
                        <span
                          style={{
                            fontSize: "0.85em",
                            color: "#666",
                          }}
                        >
                          {spot.description}
                        </span>
                      </div>
                      <button
                        style={{
                          background: todayList.find(
                            (item) => item.id === spot.id
                          )
                            ? "#28a745"
                            : "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: "0.8em",
                          cursor: "pointer",
                          marginLeft: 8,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (todayList.find((item) => item.id === spot.id)) {
                            removeFromTodayList(spot.id);
                          } else {
                            addToTodayList(spot);
                          }
                        }}
                      >
                        {todayList.find((item) => item.id === spot.id)
                          ? "追加済み"
                          : "追加"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 今日行くリストタブ */}
            {activeTab === "today" && (
              <div>
                {todayList.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#888",
                      margin: "20px 0",
                    }}
                  >
                    今日行く観光地を追加してください
                  </p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {todayList.map((spot) => (
                      <li
                        key={spot.id}
                        style={{
                          marginBottom: 10,
                          padding: "7px 0 7px 0",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ cursor: "pointer", flex: 1 }}
                          onClick={() => setMapQuery(spot.name)}
                        >
                          <span style={{ fontWeight: "bold", color: "#333" }}>
                            {spot.name}
                            {spot.visitCount > 0 && (
                              <span style={{ color: "#FFD700", marginLeft: "6px" }}>
                                {getStarsDisplay(spot.visitCount)}
                              </span>
                            )}
                          </span>
                          <br />
                          <span
                            style={{
                              fontSize: "0.85em",
                              color: "#666",
                            }}
                          >
                            {spot.description}
                          </span>
                        </div>
                        <button
                          style={{
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            fontSize: "0.8em",
                            cursor: "pointer",
                            marginLeft: 8,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromTodayList(spot.id);
                          }}
                        >
                          削除
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
