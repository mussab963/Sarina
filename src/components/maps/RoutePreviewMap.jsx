import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// Enable Arabic and right-to-left map labels.
if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
  maplibregl
    .setRTLTextPlugin(
      "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js",
      true,
    )
    .catch((error) => {
      console.warn("Arabic map text plugin failed:", error);
    });
}

// MapLibre coordinates: [longitude, latitude]
const ALEPPO = [37.1343, 36.2021];
const DAMASCUS = [36.2765, 33.5138];

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const GOOGLE_MAP_URL =
  "https://maps.google.com/maps?q=34.86%2C36.7&z=7&output=embed";

function RoutePreviewMap() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let map = null;
    let timeoutId = null;
    let resizeObserver = null;

    let disposed = false;
    let ready = false;
    let failed = false;

    // Switch to fallback only when initialization fails
    const showFallback = () => {
      if (disposed || ready || failed) return;

      failed = true;

      window.clearTimeout(timeoutId);
      resizeObserver?.disconnect();

      if (map) {
        map.remove();
        map = null;
      }

      setStatus("fallback");
    };

    try {
      // Initialize map immediately
      map = new maplibregl.Map({
        container,
        style: MAP_STYLE,

        center: [36.7, 34.86],
        zoom: 6,

        minZoom: 4,
        maxZoom: 15,

        // User interaction
        interactive: true,
        dragPan: true,
        scrollZoom: true,
        doubleClickZoom: true,
        touchZoomRotate: true,

        // Disable unnecessary rendering features
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        renderWorldCopies: false,
        fadeDuration: 0,
        antialias: false,

        attributionControl: false,
      });

      // Zoom buttons
      map.addControl(
        new maplibregl.NavigationControl({
          showCompass: false,
          showZoom: true,
        }),
        "top-left",
      );

      // Map attribution
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
        }),
        "bottom-left",
      );

      // Fit Syria's cities within the visible area
      const bounds = new maplibregl.LngLatBounds()
        .extend(DAMASCUS)
        .extend(ALEPPO);

      map.fitBounds(bounds, {
        padding: 40,
        maxZoom: 8,
        duration: 0,
      });

      // Wait for the initial map to load
      map.once("load", () => {
        if (disposed || failed || !map) return;

        try {
          // Markers only - NO route lines
          const cities = [
            {
              coordinates: ALEPPO,
              color: "#0aa99b",
              label: "حلب",
            },
            {
              coordinates: DAMASCUS,
              color: "#153c52",
              label: "دمشق",
            },
          ];

          cities.forEach((city) => {
            new maplibregl.Marker({
              color: city.color,
              scale: 0.8,
            })
              .setLngLat(city.coordinates)
              .setPopup(
                new maplibregl.Popup({
                  offset: 20,
                }).setText(city.label),
              )
              .addTo(map);
          });

          ready = true;
          window.clearTimeout(timeoutId);

          map.resize();
          setStatus("ready");
        } catch (error) {
          console.error("Map markers initialization error:", error);

          showFallback();
        }
      });

      // Log resource errors without destroying
      // an otherwise functional map
      map.on("error", (event) => {
        console.warn("MapLibre resource warning:", event.error);
      });

      // Resize only when the container size changes
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          if (!disposed && !failed && map) {
            map.resize();
          }
        });

        resizeObserver.observe(container);
      }

      // Prevent endless loading
      timeoutId = window.setTimeout(() => {
        if (!ready) {
          showFallback();
        }
      }, 15000);
    } catch (error) {
      console.error("Map initialization error:", error);

      showFallback();
    }

    // Release resources on unmount
    return () => {
      disposed = true;

      window.clearTimeout(timeoutId);
      resizeObserver?.disconnect();

      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="خريطة تفاعلية تعرض حلب ودمشق"
      className="
        relative isolate
        h-[280px] w-full
        overflow-hidden rounded-[18px]
        bg-[#e6efeb]
        max-[900px]:h-[220px]
        max-[650px]:h-[230px]
      "
    >
      {/* Interactive map */}
      <div
        ref={containerRef}
        dir="ltr"
        className="h-full w-full"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Loading state */}
      {status === "loading" && (
        <div
          className="
            absolute inset-0 z-10
            grid place-items-center
            bg-[#e7f0eb] p-5
            text-center text-[13px]
            font-bold text-[#285463]
          "
        >
          يتم تحميل الخريطة...
        </div>
      )}

      {/* Google Maps fallback */}
      {status === "fallback" && (
        <div className="absolute inset-0 z-20">
          <iframe
            title="خريطة سوريا"
            src={GOOGLE_MAP_URL}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />

          <a
            href="https://www.google.com/maps/@34.86,36.7,7z"
            target="_blank"
            rel="noopener noreferrer"
            className="
              absolute right-3 bottom-3
              rounded-lg bg-white
              px-3 py-2
              text-[11px] font-extrabold
              text-[#0c5962]
              shadow-lg
              hover:bg-[#e9fbf7]
            "
          >
            فتح في Google Maps
          </a>
        </div>
      )}
    </div>
  );
}

export default RoutePreviewMap;
