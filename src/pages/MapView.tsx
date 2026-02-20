import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Shield, Users, Navigation, Layers } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getNearbyVolunteers } from "@/lib/api";

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const userPos: [number, number] = [17.4268, 78.4484];

const createColoredIcon = (color: string) =>
  L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 8px ${color}"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const userIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;border-radius:50%;background:hsl(160,84%,39%);border:3px solid white;box-shadow:0 0 16px hsl(160,84%,39%)"><div style="position:absolute;inset:-6px;border-radius:50%;background:hsl(160,84%,39%,0.2);animation:ping 1.5s ease infinite"></div></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MapView() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [safeZones, setSafeZones] = useState<any[]>([]);
  const [activeLayer, setActiveLayer] = useState<"volunteers" | "zones" | "both">("both");

  useEffect(() => {
    getNearbyVolunteers(userPos[0], userPos[1]).then((d) => {
      setVolunteers(d.volunteers || []);
      setSafeZones(d.safe_zones || []);
    });
  }, []);

  const volunteerPositions: [number, number][] = [
    [17.4298, 78.4510],
    [17.4240, 78.4450],
    [17.4310, 78.4420],
    [17.4200, 78.4530],
    [17.4280, 78.4390],
  ];

  return (
    <div className="h-full flex flex-col p-6 gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold">Live Map</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Real-time volunteer & safe zone tracking</p>
        </div>

        {/* Layer toggles */}
        <div className="flex items-center gap-2">
          {(["volunteers", "zones", "both"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                activeLayer === layer
                  ? "bg-safe/15 border border-safe/30 text-safe"
                  : "bg-secondary/60 border border-white/[0.06] text-muted-foreground hover:text-foreground"
              }`}
            >
              {layer === "both" ? "All Layers" : layer}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ minHeight: 400 }}
        >
          <MapContainer
            center={userPos}
            zoom={14}
            style={{ width: "100%", height: "100%", minHeight: 400 }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />

            {/* User location */}
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div style={{ background: "hsl(220,15%,10%)", color: "white", padding: "8px", borderRadius: "8px", minWidth: 120 }}>
                  <strong className="text-safe">📍 Your Location</strong>
                  <br />
                  <span style={{ fontSize: 11 }}>City Center Mall</span>
                </div>
              </Popup>
            </Marker>

            {/* Safe radius */}
            {(activeLayer === "zones" || activeLayer === "both") && (
              <Circle
                center={userPos}
                radius={500}
                pathOptions={{ color: "hsl(160,84%,39%)", fillColor: "hsl(160,84%,39%)", fillOpacity: 0.05, weight: 1.5 }}
              />
            )}

            {/* Volunteers */}
            {(activeLayer === "volunteers" || activeLayer === "both") &&
              volunteerPositions.map((pos, i) => (
                <Marker key={i} position={pos} icon={createColoredIcon("#10B981")}>
                  <Popup>
                    <div style={{ background: "hsl(220,15%,10%)", color: "white", padding: "8px", borderRadius: "8px" }}>
                      <strong style={{ color: "hsl(160,84%,39%)" }}>{volunteers[i]?.name || `Volunteer ${i + 1}`}</strong>
                      <br />
                      <span style={{ fontSize: 11 }}>{volunteers[i]?.distance || "Nearby"} • Online</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </motion.div>

        {/* Side panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-64 flex flex-col gap-3 overflow-y-auto"
        >
          {/* Current location */}
          <GlassCard variant="safe" padding="sm">
            <div className="flex items-center gap-2 mb-2">
              <Navigation size={14} className="text-safe" />
              <span className="text-xs font-semibold text-safe">Current Location</span>
            </div>
            <p className="text-sm font-medium">City Center Mall</p>
            <p className="text-xs text-muted-foreground mt-0.5">Panjagutta, Hyderabad</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              <span className="text-xs text-safe font-medium">Safe Zone</span>
            </div>
          </GlassCard>

          {/* Volunteers */}
          <GlassCard padding="sm">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-primary" />
              <span className="text-xs font-semibold">Nearby Patrollers</span>
            </div>
            <div className="space-y-2.5">
              {volunteers.slice(0, 4).map((vol) => (
                <div key={vol.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                        {vol.name[0]}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-background ${vol.status === "online" ? "bg-safe" : "bg-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium leading-none">{vol.name}</p>
                      <p className="text-[10px] text-muted-foreground">{vol.distance}</p>
                    </div>
                  </div>
                  <button className="text-[10px] px-2 py-0.5 rounded-md bg-safe/10 text-safe border border-safe/20 hover:bg-safe/20 transition-colors">
                    Alert
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Safe Zones */}
          <GlassCard padding="sm">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-safe" />
              <span className="text-xs font-semibold">Safe Zones</span>
            </div>
            <div className="space-y-2.5">
              {safeZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-safe shrink-0" />
                    <span className="text-[11px] text-foreground/80">{zone.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-safe">{zone.distance}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
