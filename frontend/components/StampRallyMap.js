import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import RedMarkerIcon from "./RedMarkerIcon";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  iconUrl: markerIcon.src || markerIcon,
  shadowUrl: markerShadow.src || markerShadow,
});

const RoutingControl = dynamic(() => import("./RoutingControl"), {
  ssr: false,
});

function FlyToSpot({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.2 });
    }
  }, [position]);
  return null;
}

// カスタム拡大縮小ボタン
function CustomZoomControl() {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <button
        onClick={zoomIn}
        style={{
          width: 30,
          height: 30,
          background: "#fff",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
        }}
        title="拡大"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        style={{
          width: 30,
          height: 30,
          background: "#fff",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
        }}
        title="縮小"
      >
        −
      </button>
    </div>
  );
}

// デバウンス用のカスタムフック
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function StampRallyMap({ stamps, query, setQuery }) {
  const [selected, setSelected] = useState(null);
  const [fromSpot, setFromSpot] = useState("hachioji-station"); // 出発地点（デフォルト：八王子駅）
  const [toSpot, setToSpot] = useState(null); // 到着地点
  const [routeRequestCount, setRouteRequestCount] = useState(0); // ルートリクエスト回数追跡
  const [isComposing, setIsComposing] = useState(false); // IME変換中かどうか
  const [isRouteMinimized, setIsRouteMinimized] = useState(true); // 経路情報パネルの縮小状態（デフォルト：縮小）

  // 経路検索をデバウンス（1秒遅延）
  const debouncedFromSpot = useDebounce(fromSpot, 1000);
  const debouncedToSpot = useDebounce(toSpot, 1000);

  // 検索は大文字小文字・全角半角を無視して部分一致
  const normalize = (str) => (str || "").toLowerCase().replace(/\s/g, "");
  const filtered =
    query && query.trim()
      ? stamps.filter(
          (s) =>
            normalize(s.name).includes(normalize(query)) ||
            normalize(s.id).includes(normalize(query))
        )
      : [];
  const selectedSpot = stamps.find((s) => s.id === selected);

  // 検索結果リストを表示するかどうか（IME変換中でも表示）
  const shouldShowSearchResults = query && query.trim();

  // 八王子駅の緯度経度
  const hachiojiStation = {
    id: "hachioji-station",
    name: "八王子駅",
    lat: 35.655,
    lng: 139.3389,
    description: "八王子市の中心駅・スタート地点",
  };

  // 全スポット（八王子駅 + 観光地）
  const allSpots = [hachiojiStation, ...stamps];

  // スポットIDから座標を取得
  const getSpotCoordinates = (spotId) => {
    if (spotId === "hachioji-station") {
      return [hachiojiStation.lat, hachiojiStation.lng];
    }
    const spot = stamps.find((s) => s.id === spotId);
    return spot ? [spot.lat, spot.lng] : null;
  };

  // スポットIDからスポット情報を取得
  const getSpotInfo = (spotId) => {
    if (spotId === "hachioji-station") {
      return hachiojiStation;
    }
    return stamps.find((s) => s.id === spotId);
  };

  // 経路詳細パネルの折りたたみ切り替え
  const toggleRouteMinimized = () => {
    setIsRouteMinimized(!isRouteMinimized);
  };

  // 検索クリア用
  const handleClear = () => {
    setQuery("");
    setSelected(null);
    setFromSpot("hachioji-station");
    setToSpot(null);
    setIsRouteMinimized(true); // 経路情報パネルを縮小状態にリセット
  };

  // 経路設定用の関数（自動的に経路検索モードを判定）
  const handleSpotSelect = (spotId, spotName) => {
    if (!fromSpot || fromSpot === "hachioji-station") {
      if (spotId === "hachioji-station") {
        // 八王子駅を選択した場合は単一選択として扱う
        setSelected(spotId);
        setFromSpot("hachioji-station");
        setToSpot(null);
      } else {
        // 観光地を選択した場合は経路表示
        setFromSpot("hachioji-station");
        setToSpot(spotId);
        setSelected(null);
      }
    } else if (!toSpot && fromSpot !== spotId) {
      // 2番目の選択：到着地点に設定（同じ場所は除く）
      setToSpot(spotId);
      setSelected(null);
    } else {
      // 3番目以降または同じ場所：新しい選択として設定
      if (spotId === "hachioji-station") {
        setSelected(spotId);
        setFromSpot("hachioji-station");
        setToSpot(null);
      } else {
        setFromSpot("hachioji-station");
        setToSpot(spotId);
        setSelected(null);
      }
    }
    setQuery("");
  };

  // 親からqueryが変わったら部分一致で自動選択（IME変換中は除く）
  React.useEffect(() => {
    if (query && query.trim() && !isComposing) {
      // 八王子駅の検索
      const norm = normalize(query);
      if (
        norm.includes("八王子駅") ||
        norm.includes("hachioji") ||
        norm.includes("はちおうじえき")
      ) {
        handleSpotSelect("hachioji-station", "八王子駅");
        return;
      }

      // 観光地の検索
      const found = stamps.find(
        (s) =>
          normalize(s.name) === normalize(query) ||
          normalize(s.id) === normalize(query) ||
          normalize(s.name).includes(normalize(query))
      );
      if (found) {
        handleSpotSelect(found.id, found.name);
      }
    }
  }, [query, stamps, isComposing]);

  // Enterキーで候補1件なら選択（IME変換中は除く）
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && query && query.trim() && !isComposing) {
      // 八王子駅の検索チェック
      const norm = normalize(query);
      if (
        norm.includes("八王子駅") ||
        norm.includes("hachioji") ||
        norm.includes("はちおうじえき")
      ) {
        handleSpotSelect("hachioji-station", "八王子駅");
        return;
      }

      if (filtered.length === 1) {
        handleSpotSelect(filtered[0].id, filtered[0].name);
      }
    }
  };

  // IME変換開始
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // IME変換終了
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 経路表示の判定（デバウンスされた値を使用）
  let routingFrom = null;
  let routingTo = null;

  if (
    debouncedFromSpot &&
    debouncedToSpot &&
    debouncedFromSpot !== debouncedToSpot
  ) {
    // 2つの地点が選択されている場合：地点間ルート
    routingFrom = getSpotCoordinates(debouncedFromSpot);
    routingTo = getSpotCoordinates(debouncedToSpot);
  } else if (selectedSpot && !debouncedToSpot) {
    // 1つの地点のみ選択：八王子駅からのルート
    routingFrom = [hachiojiStation.lat, hachiojiStation.lng];
    routingTo = [selectedSpot.lat, selectedSpot.lng];
  }

  // ルーティングリクエスト回数の制限チェック
  const maxRouteRequests = 10; // 1時間あたりの最大リクエスト数
  const canMakeRouteRequest = routeRequestCount < maxRouteRequests;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 上部UI：検索ボックスと経路検索モード切り替え */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          left: 60, // 拡大縮小ボタンのスペースを確保
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* 検索ボックス */}
        <div style={{ display: "flex", gap: 4 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="スポット名で検索・経路指定"
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #bbb",
              fontSize: "1em",
              flex: 1,
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          />
          <button
            onClick={handleClear}
            style={{
              background:
                query || selected || fromSpot !== "hachioji-station" || toSpot
                  ? "#dc3545"
                  : "#eee",
              color:
                query || selected || fromSpot !== "hachioji-station" || toSpot
                  ? "#fff"
                  : "#666",
              border: "1px solid #bbb",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: "1em",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "32px",
            }}
            title="クリア"
          >
            ×
          </button>
        </div>

        {/* 経路情報表示（両方の地点が選択されている場合のみ） */}
        {fromSpot && toSpot && fromSpot !== toSpot && (
          <div
            style={{
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: "0.9em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            {/* ヘッダー部分（常に表示） */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isRouteMinimized ? 0 : 6,
              }}
            >
              <div style={{ color: "#007bff", fontSize: "0.85em" }}>
                📍 経路表示中
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  fontSize: "0.8em",
                  cursor: "pointer",
                  padding: "2px 4px",
                  borderRadius: 3,
                }}
                onClick={toggleRouteMinimized}
                title={isRouteMinimized ? "展開" : "縮小"}
              >
                {isRouteMinimized ? "▼" : "▲"}
              </button>
            </div>

            {/* 折りたたみ可能な詳細部分 */}
            {!isRouteMinimized && (
              <>
                {/* 出発地選択 */}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: "0.8em", color: "#666" }}>
                    出発地：
                  </span>
                  <select
                    value={fromSpot}
                    onChange={(e) => setFromSpot(e.target.value)}
                    style={{
                      marginLeft: 4,
                      padding: "2px 4px",
                      fontSize: "0.85em",
                      borderRadius: 3,
                      border: "1px solid #ccc",
                      background: "#fff",
                    }}
                  >
                    <option value="hachioji-station">八王子駅</option>
                    {stamps.map((spot) => (
                      <option key={spot.id} value={spot.id}>
                        {spot.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 到着地選択 */}
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: "0.8em", color: "#666" }}>
                    到着地：
                  </span>
                  <select
                    value={toSpot}
                    onChange={(e) => setToSpot(e.target.value)}
                    style={{
                      marginLeft: 4,
                      padding: "2px 4px",
                      fontSize: "0.85em",
                      borderRadius: 3,
                      border: "1px solid #ccc",
                      background: "#fff",
                    }}
                  >
                    <option value="hachioji-station">八王子駅</option>
                    {stamps.map((spot) => (
                      <option key={spot.id} value={spot.id}>
                        {spot.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* 経路表示テキスト（常に表示または縮小表示） */}
            <div
              style={{
                fontSize: isRouteMinimized ? "0.85em" : "0.9em",
                fontWeight: "bold",
                marginTop: isRouteMinimized ? 4 : 6,
              }}
            >
              <strong>{getSpotInfo(fromSpot)?.name}</strong> →{" "}
              <strong>{getSpotInfo(toSpot)?.name}</strong>
            </div>
          </div>
        )}

        {/* 単一地点選択時の情報表示 */}
        {selectedSpot && !toSpot && (
          <div
            style={{
              background: "#e8f4fd",
              border: "1px solid #bee5eb",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: "0.9em",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{ color: "#0c5460", fontSize: "0.85em", marginBottom: 4 }}
            >
              📍 選択中のスポット
            </div>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {selectedSpot.name}
            </div>
            <button
              onClick={() => {
                setToSpot(selectedSpot.id);
                setSelected(null);
              }}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "4px 8px",
                fontSize: "0.8em",
                cursor: "pointer",
              }}
            >
              八王子駅からの経路を表示
            </button>
          </div>
        )}
      </div>

      {/* 経路検索制限メッセージ */}
      {routingFrom && routingTo && !canMakeRouteRequest && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 10,
            right: 10,
            background: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: 6,
            padding: "10px 12px",
            fontSize: "0.9em",
            color: "#856404",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          ⚠️
          経路検索の利用制限に達しました。しばらく待ってから再度お試しください。
        </div>
      )}

      {/* 検索結果リスト */}
      {shouldShowSearchResults && (
        <div
          style={{
            position: "absolute",
            top:
              fromSpot && toSpot && fromSpot !== toSpot
                ? isRouteMinimized
                  ? 80
                  : 140
                : selectedSpot && !toSpot
                ? 120
                : 44,
            right: 10,
            left: 60, // 拡大縮小ボタンのスペースを確保
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #bbb",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            maxWidth: 300,
            maxHeight: 180,
            overflowY: "auto",
          }}
        >
          {/* 八王子駅を候補に追加 */}
          {normalize("八王子駅").includes(normalize(query)) && (
            <div
              style={{
                padding: "7px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                background: "#fff3cd",
                fontWeight: "bold",
              }}
              onClick={() => handleSpotSelect("hachioji-station", "八王子駅")}
            >
              🚉 八王子駅
            </div>
          )}

          {filtered.length === 0 &&
          !normalize("八王子駅").includes(normalize(query)) ? (
            <div style={{ padding: "10px 12px", color: "#888" }}>該当なし</div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.id}
                style={{
                  padding: "7px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  background: selected === s.id ? "#e3f0ff" : undefined,
                }}
                onClick={() => handleSpotSelect(s.id, s.name)}
              >
                {s.name}
              </div>
            ))
          )}
        </div>
      )}
      <MapContainer
        center={[35.6581, 139.323]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false} // デフォルトの拡大縮小ボタンを無効化
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* 八王子駅の赤いピン */}
        <Marker
          position={[hachiojiStation.lat, hachiojiStation.lng]}
          icon={RedMarkerIcon}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                八王子駅
              </div>
              <div style={{ fontSize: "0.95em", marginBottom: 4 }}>
                八王子市の中心駅・スタート地点
              </div>
            </div>
          </Popup>
        </Marker>
        {/* 既存の観光地マーカー */}
        {stamps.map((spot) =>
          spot.lat && spot.lng ? (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      marginBottom: 6,
                    }}
                  />
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    {spot.name}
                  </div>
                  <div style={{ fontSize: "0.95em", marginBottom: 4 }}>
                    {spot.description}
                  </div>
                  {spot.isAcquired ? (
                    <span style={{ color: "#007bff", fontWeight: "bold" }}>
                      スタンプ獲得済み
                    </span>
                  ) : (
                    <span style={{ color: "#888" }}>未獲得</span>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
        {/* 経路描画（リクエスト制限内の場合のみ） */}
        {routingFrom && routingTo && canMakeRouteRequest && (
          <RoutingControl from={routingFrom} to={routingTo} />
        )}

        {/* 選択時に地図移動 */}
        {selectedSpot && !toSpot && (
          <FlyToSpot position={[selectedSpot.lat, selectedSpot.lng]} />
        )}
        {fromSpot && fromSpot !== "hachioji-station" && !selectedSpot && (
          <FlyToSpot position={getSpotCoordinates(fromSpot)} />
        )}

        {/* カスタム拡大縮小ボタン */}
        <CustomZoomControl />
      </MapContainer>
      {/* 観光地リスト（画面中央に固定）を削除 */}
      {/* この部分を削除し、観光地リストのUIを非表示にします */}
    </div>
  );
}
