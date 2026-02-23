import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Shield, AlertTriangle, Locate } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getNearbyVolunteers } from "@/lib/api";

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_POS: [number, number] = [17.3850, 78.4867];

const createZoneIcon = (risk: number) => {
  const color = risk <= 30 ? "hsl(160,84%,39%)" : risk <= 60 ? "hsl(38,95%,50%)" : "hsl(0,84%,60%)";
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 8px ${color};font-size:9px;font-weight:700;color:#fff">⊕</div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const userIcon = L.divIcon({
  html: `<div style="position:relative;width:22px;height:22px;border-radius:50%;background:hsl(217,91%,60%);border:3px solid white;box-shadow:0 0 16px hsl(217,91%,60%)"><div style="position:absolute;inset:-8px;border-radius:50%;border:2px solid hsl(217,91%,60%,0.4);animation:ping 2s ease infinite"></div></div>`,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Zone data with risk scores
const zones = [
  { id: 1, name: "Hospital 2 Warangal", lat: 17.3920, lng: 78.4750, risk: 0, type: "Security" },
  { id: 2, name: "Panjagutta Police Station", lat: 17.4268, lng: 78.4484, risk: 12, type: "Police" },
  { id: 3, name: "Apollo Hospitals", lat: 17.4100, lng: 78.4800, risk: 8, type: "Hospital" },
  { id: 4, name: "City Center Mall", lat: 17.3950, lng: 78.5000, risk: 15, type: "Public" },
  { id: 5, name: "Dilsukh Nagar Junction", lat: 17.3690, lng: 78.5250, risk: 45, type: "Transit" },
  { id: 6, name: "Chaitanyapuri Main Rd", lat: 17.3720, lng: 78.5150, risk: 38, type: "Road" },
  { id: 7, name: "High Risk 3 Khammam", lat: 17.3780, lng: 78.5050, risk: 74, type: "Area" },
  { id: 8, name: "Saidabad Colony", lat: 17.3600, lng: 78.5100, risk: 62, type: "Area" },
  { id: 9, name: "Malakpet Area", lat: 17.3850, lng: 78.4950, risk: 55, type: "Area" },
  { id: 10, name: "Moosarambagh", lat: 17.3900, lng: 78.4850, risk: 22, type: "Area" },
  { id: 11, name: "Akbar Bagh Colony", lat: 17.3750, lng: 78.4700, risk: 68, type: "Area" },
  { id: 12, name: "New Market", lat: 17.3880, lng: 78.4600, risk: 33, type: "Market" },
  { id: 13, name: "Saroor Nagar", lat: 17.3550, lng: 78.5200, risk: 70, type: "Area" },
  { id: 14, name: "Gaddiannaram", lat: 17.3650, lng: 78.4900, risk: 28, type: "Area" },
  { id: 15, name: "East Prasanthi Nagar", lat: 17.3980, lng: 78.4780, risk: 10, type: "Residential" },
];

function FlyToLocation({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(pos, 14, { duration: 1.2 });
  }, [pos, map]);
  return null;
}

export default function MapView() {
  const [userPos, setUserPos] = useState<[number, number]>(DEFAULT_POS);
  const [locating, setLocating] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [safeZones] = useState(zones);

  const nearestSafe = [...safeZones].filter(z => z.risk <= 30).sort((a, b) => {
    const distA = Math.hypot(a.lat - userPos[0], a.lng - userPos[1]);
    const distB = Math.hypot(b.lat - userPos[0], b.lng - userPos[1]);
    return distA - distB;
  })[0];

  const nearestDanger = [...safeZones].filter(z => z.risk > 60).sort((a, b) => {
    const distA = Math.hypot(a.lat - userPos[0], a.lng - userPos[1]);
    const distB = Math.hypot(b.lat - userPos[0], b.lng - userPos[1]);
    return distA - distB;
  })[0];

  const getDistanceM = (z: typeof zones[0]) => {
    const R = 6371000;
    const dLat = ((z.lat - userPos[0]) * Math.PI) / 180;
    const dLng = ((z.lng - userPos[1]) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((userPos[0] * Math.PI) / 180) * Math.cos((z.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const statusLabel = riskScore <= 30 ? "SAFE ZONE" : riskScore <= 60 ? "CAUTION ZONE" : "DANGER ZONE";
  const statusColor = riskScore <= 30 ? "safe" : riskScore <= 60 ? "caution" : "danger";

  const handleLocate = useCallback(() => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        () => {
          setUserPos(DEFAULT_POS);
          setLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocating(false);
    }
  }, []);

  // Calculate risk score for current position
  useEffect(() => {
    const nearest = [...safeZones].sort((a, b) => {
      const distA = Math.hypot(a.lat - userPos[0], a.lng - userPos[1]);
      const distB = Math.hypot(b.lat - userPos[0], b.lng - userPos[1]);
      return distA - distB;
    });
    setRiskScore(nearest[0]?.risk ?? 0);
  }, [userPos, safeZones]);

  return (
    <div className="h-full flex flex-col p-4 gap-3">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
        <Shield size={18} className="text-safe" />
        <h2 className="text-lg font-bold">Armour Safety Map</h2>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map — takes most space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ minHeight: 400 }}
        >
          <MapContainer center={userPos} zoom={14} style={{ width: "100%", height: "100%", minHeight: 400 }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
            <FlyToLocation pos={userPos} />

            {/* User marker */}
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div style={{ background: "hsl(220,15%,10%)", color: "white", padding: "10px 14px", borderRadius: "10px", minWidth: 140 }}>
                  <strong style={{ color: "hsl(217,91%,60%)" }}>📍 Your Location</strong>
                  <br />
                  <span style={{ fontSize: 11 }}>Risk Score: {riskScore}/100</span>
                </div>
              </Popup>
            </Marker>

            {/* Zone markers */}
            {safeZones.map((zone) => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={createZoneIcon(zone.risk)}>
                <Popup>
                  <div style={{ background: "hsl(220,15%,10%)", color: "white", padding: "10px 14px", borderRadius: "10px", minWidth: 150 }}>
                    <strong style={{ color: zone.risk <= 30 ? "hsl(160,84%,39%)" : zone.risk <= 60 ? "hsl(38,95%,50%)" : "hsl(0,84%,60%)" }}>
                      {zone.name}
                    </strong>
                    <br />
                    <span style={{ fontSize: 11 }}>Risk: {zone.risk}/100 • {zone.type}</span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Safe radius around user */}
            <Circle
              center={userPos}
              radius={600}
              pathOptions={{ color: "hsl(217,91%,60%)", fillColor: "hsl(217,91%,60%)", fillOpacity: 0.06, weight: 1 }}
            />
          </MapContainer>
        </motion.div>

        {/* Right sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-72 flex flex-col gap-3 overflow-y-auto"
        >
          {/* Get My Location */}
          <button
            onClick={handleLocate}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <Locate size={16} className={locating ? "animate-spin" : ""} />
            {locating ? "Locating…" : "Get My Location"}
          </button>

          {/* Current Status */}
          <GlassCard variant={statusColor as any} padding="sm">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Current Status</p>
            <p className={`text-lg font-extrabold text-${statusColor}`}>{statusLabel}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Risk Score: {riskScore}/100</p>
          </GlassCard>

          {/* Nearest Safe Zone */}
          {nearestSafe && (
            <GlassCard variant="safe" padding="sm">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-safe" />
                <span className="text-xs font-semibold text-safe">Nearest Safe Zone</span>
              </div>
              <p className="text-sm font-bold">{nearestSafe.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-safe" />
                <span className="text-xs text-muted-foreground">{getDistanceM(nearestSafe)}m away</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{nearestSafe.type}</p>
            </GlassCard>
          )}

          {/* Nearest Danger Zone */}
          {nearestDanger && (
            <GlassCard variant="danger" padding="sm">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="text-xs font-semibold text-danger">Nearest Danger Zone</span>
              </div>
              <p className="text-sm font-bold">{nearestDanger.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertTriangle size={12} className="text-caution" />
                <span className="text-xs text-muted-foreground">{getDistanceM(nearestDanger)}m away</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Risk: {nearestDanger.risk}/100</p>
            </GlassCard>
          )}

          {/* Map Legend */}
          <GlassCard padding="sm">
            <p className="text-xs font-bold mb-2.5">Map Legend</p>
            <div className="space-y-2">
              {[
                { label: "Safe Zones (0-30)", color: "bg-safe" },
                { label: "Caution Zones (31-60)", color: "bg-caution" },
                { label: "High Risk Zones (61-100)", color: "bg-danger" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                  <span className="text-[11px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
