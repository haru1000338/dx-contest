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

export default function StampRallyMap({ stamps, query, setQuery }) {
  const [selected, setSelected] = useState(null);
  // 検索は大文字小文字・全角半角を無視して部分一致
  const normalize = (str) => (str || "").toLowerCase().replace(/\s/g, "");
  const filtered = query
    ? stamps.filter(
        (s) =>
          normalize(s.name).includes(normalize(query)) ||
          normalize(s.id).includes(normalize(query))
      )
    : [];
  const selectedSpot = stamps.find((s) => s.id === selected);

  // 八王子駅の緯度経度
  const hachiojiStation = { lat: 35.655, lng: 139.3389 };
  // 検索で八王子駅が選択された場合の特別処理
  const isHachiojiStation = (query) => {
    const norm = normalize(query);
    return (
      norm.includes("八王子駅") ||
      norm.includes("hachioji") ||
      norm.includes("はちおうじえき")
    );
  };

  // 検索クリア用
  const handleClear = () => {
    setQuery("");
    setSelected(null);
  };

  // 親からqueryが変わったら部分一致で自動選択
  React.useEffect(() => {
    if (query) {
      const found = stamps.find(
        (s) =>
          normalize(s.name) === normalize(query) ||
          normalize(s.id) === normalize(query) ||
          normalize(s.name).includes(normalize(query))
      );
      if (found) setSelected(found.id);
    }
  }, [query, stamps]);

  // Enterキーで候補1件なら選択
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length === 1) {
      setSelected(filtered[0].id);
      setQuery("");
    }
  };

  // selectedSpot: 観光地が選択されていればその座標、八王子駅が選択されていればnull
  let routingTo = null;
  if (selectedSpot) {
    routingTo = [selectedSpot.lat, selectedSpot.lng];
  } else if (query && isHachiojiStation(query)) {
    // 八王子駅が検索された場合はピンだけ強調（ルートは引かない）
    routingTo = null;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 検索ボックス */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          display: "flex",
          gap: 4,
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="スポット名で検索"
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #bbb",
            fontSize: "1em",
            width: 150,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        />
        {(query || selected) && (
          <button
            onClick={handleClear}
            style={{
              background: "#eee",
              border: "1px solid #bbb",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: "1em",
              cursor: "pointer",
            }}
            title="検索クリア"
          >
            ×
          </button>
        )}
      </div>
      {/* 検索結果リスト */}
      {query && (
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 10,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #bbb",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            width: 180,
            maxHeight: 180,
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
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
                onClick={() => {
                  setSelected(s.id);
                  setQuery("");
                }}
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
        {/* 経路描画（観光地が選択されている場合のみ） */}
        {routingTo && <RoutingControl to={routingTo} />}
        {/* 選択時に地図移動 */}
        {selectedSpot && (
          <FlyToSpot position={[selectedSpot.lat, selectedSpot.lng]} />
        )}
      </MapContainer>
      {/* 観光地リスト（画面中央に固定）を削除 */}
      {/* この部分を削除し、観光地リストのUIを非表示にします */}
    </div>
  );
}
