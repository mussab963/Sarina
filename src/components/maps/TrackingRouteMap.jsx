import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// الإحداثيات: [longitude, latitude]
const CITIES = {
  دمشق: [36.2765, 33.5138],
  حلب: [37.1343, 36.2021],
  حمص: [36.7234, 34.7324],
  حماة: [36.75, 35.1333],
  اللاذقية: [35.7833, 35.5167],
  طرطوس: [35.8866, 34.889],
  إدلب: [36.6333, 35.9333],
  درعا: [36.105, 32.6189],
  الرقة: [39.0167, 35.95],
  "دير الزور": [40.14, 35.33],
  الحسكة: [40.75, 36.5],
};

function getBusPosition(from, to, progress) {
  const fraction = Math.max(0, Math.min(1, (Number(progress) || 0) / 100));

  return [
    from[0] + (to[0] - from[0]) * fraction,
    from[1] + (to[1] - from[1]) * fraction,
  ];
}

if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
  maplibregl
    .setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
      true,
    )
    .catch((error) => {
      console.warn("RTL plugin:", error);
    });
}

export default function TrackingRouteMap({
  origin,
  destination,
  progress = 0,
}) {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("loading");

  const busMarkerRef = useRef(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;

    const from = CITIES[origin];
    const to = CITIES[destination];

    if (!from || !to || !busMarkerRef.current) return;

    busMarkerRef.current.setLngLat(getBusPosition(from, to, progress));
  }, [origin, destination, progress]);

  useEffect(() => {
    if (!mapRef.current) return;

    let map;
    let disposed = false;
    let observer;
    let timeout;

    const points = [
      {
        name: origin,
        coordinates: CITIES[origin],
        color: "#0aa99b",
      },
      {
        name: destination,
        coordinates: CITIES[destination],
        color: "#123e51",
      },
    ].filter((item) => item.coordinates);

    try {
      map = new maplibregl.Map({
        container: mapRef.current,
        style: MAP_STYLE,
        center: [37.2, 35],
        zoom: 5.5,
        minZoom: 4,
        maxZoom: 15,
        renderWorldCopies: false,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        antialias: false,
      });

      map.addControl(
        new maplibregl.NavigationControl({
          showCompass: false,
        }),
        "top-left",
      );

      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
        }),
        "bottom-left",
      );

      map.once("load", () => {
        if (disposed) return;

        if (points.length === 2 && origin !== destination) {
          map.addSource("tracking-route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [points[0].coordinates, points[1].coordinates],
              },
            },
          });

          map.addLayer({
            id: "tracking-route-line",
            type: "line",
            source: "tracking-route",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#0aa99b",
              "line-width": 4,
              "line-opacity": 0.9,
              "line-dasharray": [2, 2],
            },
          });
        }

        for (const point of points) {
          new maplibregl.Marker({
            color: point.color,
          })
            .setLngLat(point.coordinates)
            .setPopup(
              new maplibregl.Popup({
                offset: 20,
              }).setText(point.name),
            )
            .addTo(map);
        }

        if (points.length === 2 && origin !== destination) {
          const busElement = document.createElement("span");

          busElement.textContent = "🚌";
          busElement.setAttribute("role", "img");
          busElement.setAttribute(
            "aria-label",
            "موقع الحافلة الافتراضي في المحاكاة",
          );

          busElement.className =
            "grid h-11 w-11 place-items-center rounded-full border-2 border-[#0aa99b] bg-white text-[26px] shadow-lg";

          busMarkerRef.current = new maplibregl.Marker({
            element: busElement,
            anchor: "center",
          })
            .setLngLat(
              getBusPosition(
                points[0].coordinates,
                points[1].coordinates,
                progressRef.current,
              ),
            )
            .addTo(map);
        }

        if (points.length > 0) {
          const bounds = new maplibregl.LngLatBounds();

          for (const point of points) {
            bounds.extend(point.coordinates);
          }

          map.fitBounds(bounds, {
            padding: 65,
            maxZoom: 8,
            duration: 0,
          });
        }

        map.resize();
        window.clearTimeout(timeout);
        setStatus("ready");
      });

      map.on("error", (event) => {
        console.warn("Map warning:", event.error);
      });

      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => {
          if (!disposed) map.resize();
        });

        observer.observe(mapRef.current);
      }

      timeout = window.setTimeout(() => {
        if (!disposed) setStatus("error");
      }, 15000);
    } catch (error) {
      console.error("Tracking map error:", error);
      setStatus("error");
    }

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      observer?.disconnect();
      busMarkerRef.current?.remove();
      busMarkerRef.current = null;
      map?.remove();
    };
  }, [origin, destination]);

  return (
    <div
      role="region"
      aria-label="خريطة تفاعلية للرحلة"
      className="relative h-[460px] w-full overflow-hidden bg-[#e6efeb] max-[650px]:h-[330px]"
    >
      <div ref={mapRef} dir="ltr" className="absolute inset-0 h-full w-full" />

      {status === "loading" && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#e7f0eb] text-sm font-bold text-[#285463]">
          جاري تحميل خريطة سوريا...
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#e7f0eb] p-6 text-center text-sm font-bold text-[#285463]">
          تعذّر تحميل الخريطة. تأكد من اتصال الإنترنت.
        </div>
      )}
    </div>
  );
}
