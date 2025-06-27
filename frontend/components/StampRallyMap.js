import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  const filtered = query
    ? stamps.filter((s) => s.name.includes(query) || s.id.includes(query))
    : [];
  const selectedSpot = stamps.find((s) => s.id === selected);

  // 検索クリア用
  const handleClear = () => {
    setQuery("");
    setSelected(null);
  };

  useEffect(() => {
    // 親からqueryが変わったら自動で候補を選択
    if (query) {
      const found = stamps.find((s) => s.name === query || s.id === query);
      if (found) setSelected(found.id);
    }
  }, [query, stamps]);

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
      {query && filtered.length > 0 && (
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
          {filtered.map((s) => (
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
          ))}
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
        {selectedSpot && (
          <FlyToSpot position={[selectedSpot.lat, selectedSpot.lng]} />
        )}
        {selectedSpot && (
          <RoutingControl to={[selectedSpot.lat, selectedSpot.lng]} />
        )}
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
      </MapContainer>
      {/* 観光地リスト（画面中央に固定）を削除 */}
      {/* この部分を削除し、観光地リストのUIを非表示にします */}
    </div>
  );
}
