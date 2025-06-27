import { useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";

export default function RoutingControl({ from, to }) {
  const map = useMap();
  const routingRef = useRef(null);
  const lastRequestRef = useRef(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ((!from && !to) || typeof window === "undefined") return;
    let destroyed = false;

    // API制限を避けるため、前回のリクエストから1秒以上間隔を開ける
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestRef.current;
    const minInterval = 1000; // 1秒

    const executeRouting = async () => {
      if (timeSinceLastRequest < minInterval) {
        await new Promise((resolve) =>
          setTimeout(resolve, minInterval - timeSinceLastRequest)
        );
      }

      if (destroyed) return;

      lastRequestRef.current = Date.now();
      setError(null);

      try {
        const L = (await import("leaflet")).default;
        await import("leaflet-routing-machine");
        await import(
          "leaflet-routing-machine/dist/leaflet-routing-machine.css"
        );

        // デフォルト出発地点は八王子駅
        const defaultFrom = [35.655556, 139.338889];
        const startPoint = from || defaultFrom;
        const endPoint = to;

        // 既存ルートを削除
        if (routingRef.current) {
          try {
            map.removeControl(routingRef.current);
          } catch (e) {
            console.warn("Failed to remove existing route:", e);
          }
          routingRef.current = null;
        }

        if (destroyed || !endPoint) return;

        const instance = L.Routing.control({
          waypoints: [
            L.latLng(startPoint[0], startPoint[1]),
            L.latLng(endPoint[0], endPoint[1]),
          ],
          lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          show: false,
          routeWhileDragging: false,
          createMarker: () => null,
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            timeout: 30000,
            profile: "driving",
          }),
        });

        // ルーティングエラーハンドラを追加
        instance.on("routesfound", function (e) {
          setError(null);
        });

        instance.on("routingerror", function (e) {
          console.warn("Routing error:", e);
          if (e.error && e.error.status === 429) {
            setError(
              "経路検索の利用制限に達しました。しばらく待ってから再度お試しください。"
            );
          } else if (e.error && e.error.status >= 500) {
            setError("経路検索サービスが一時的に利用できません。");
          } else {
            setError("経路が見つかりませんでした。");
          }
        });

        instance.addTo(map);
        routingRef.current = instance;
      } catch (error) {
        console.error("Routing setup failed:", error);
        if (!destroyed) {
          setError("経路検索機能の初期化に失敗しました。");
        }
      }
    };

    executeRouting();

    return () => {
      destroyed = true;
      if (routingRef.current) {
        try {
          routingRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingRef.current);
        } catch (e) {
          console.warn("Failed to cleanup route:", e);
        }
        routingRef.current = null;
      }
    };
  }, [from, to, map]);

  // エラー表示UI
  if (error) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: 6,
          padding: "10px 12px",
          fontSize: "0.9em",
          color: "#856404",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        ⚠️ {error}
        <button
          onClick={() => setError(null)}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "#856404",
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return null;
}
