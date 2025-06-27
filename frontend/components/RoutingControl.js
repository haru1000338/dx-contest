import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function RoutingControl({ to }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!to || typeof window === "undefined") return;
    let destroyed = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet-routing-machine");
      await import("leaflet-routing-machine/dist/leaflet-routing-machine.css");
      // 八王子駅（世界測地系: 35.655556, 139.338889）
      const from = [35.655556, 139.338889];

      // 既存ルートを削除
      if (routingRef.current) {
        try {
          map.removeControl(routingRef.current);
        } catch (e) {}
        routingRef.current = null;
      }

      if (destroyed) return;

      const instance = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        lineOptions: { styles: [{ color: "#007bff", weight: 5 }] },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
        routeWhileDragging: false,
        createMarker: () => null,
      }).addTo(map);

      routingRef.current = instance;
    })();

    return () => {
      destroyed = true;
      if (routingRef.current) {
        try {
          routingRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingRef.current);
        } catch (e) {}
        routingRef.current = null;
      }
    };
  }, [to, map]);

  return null;
}
