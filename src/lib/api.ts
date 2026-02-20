import axios from "axios";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Location / Risk ──────────────────────────────────────────────
export const updateLocation = async (payload: {
  user_id: string;
  lat: number;
  lng: number;
  timestamp: string;
}) => {
  try {
    const { data } = await api.post("/location/update", payload);
    return data;
  } catch {
    // Mock response when backend unavailable
    return { risk_level: "SAFE", score: 82, zone: "City Center Mall" };
  }
};

// ── SOS / Alert ──────────────────────────────────────────────────
export const sendAlert = async (payload: {
  user_id: string;
  alert_type: string;
  network_status: string;
  location: { lat: number; lng: number };
}) => {
  try {
    const { data } = await api.post("/communication/send-alert", payload);
    return data;
  } catch {
    return { success: true, alert_id: "mock-alert-001", message: "Alert sent to 3 guardians" };
  }
};

// ── Community / Volunteers ───────────────────────────────────────
export const getNearbyVolunteers = async (lat: number, lng: number, radius = 5) => {
  try {
    const { data } = await api.get("/community/nearby", { params: { lat, lng, radius } });
    return data;
  } catch {
    return {
      volunteers: [
        { id: "v1", name: "Anita Sharma", distance: "1.4 km", status: "online", rating: 4.9, verified: true, avatar: null },
        { id: "v2", name: "Rashmi Patel", distance: "1.7 km", status: "online", rating: 4.7, verified: true, avatar: null },
        { id: "v3", name: "Sneha Nair", distance: "2.1 km", status: "online", rating: 4.8, verified: true, avatar: null },
        { id: "v4", name: "Priya Gupta", distance: "2.8 km", status: "offline", rating: 4.6, verified: false, avatar: null },
        { id: "v5", name: "Maya Reddy", distance: "3.2 km", status: "online", rating: 4.9, verified: true, avatar: null },
        { id: "v6", name: "Kavya Singh", distance: "4.0 km", status: "online", rating: 4.5, verified: true, avatar: null },
      ],
      safe_zones: [
        { id: "z1", name: "City DCenter Mall", distance: "600m" },
        { id: "z2", name: "Panjagutta Police Station", distance: "1.2 km" },
        { id: "z3", name: "Apollo Hospitals", distance: "1.8 km" },
      ],
    };
  }
};

// ── AI Chat ──────────────────────────────────────────────────────
export const chatWithAI = async (user_id: string, message: string) => {
  try {
    const { data } = await api.post("/communication/chat", { user_id, message });
    return data;
  } catch {
    const responses: Record<string, string> = {
      "safe area": "Based on your current location near City Center, your safety score is 82/100. This is a well-monitored area with 3 nearby volunteers and a police station 1.2km away.",
      "emergency": "In an emergency, press the SOS button immediately. I'll alert your 3 guardians and the nearest 5 volunteers. You can also call 112 (Police) or 1091 (Women Helpline).",
      "contacts": "Your emergency contacts are: Dad (Raj Sharma) and Friend (Maya). They'll be notified instantly during SOS. Want to update them?",
    };
    const lower = message.toLowerCase();
    const key = Object.keys(responses).find((k) => lower.includes(k));
    return {
      response: key
        ? responses[key]
        : "I'm your ARMOUR Safety AI. I can help you assess your current safety, find nearby safe zones, and contact emergency services. How can I help you stay safe today?",
    };
  }
};

// ── Auth ─────────────────────────────────────────────────────────
export const googleLogin = async (email: string) => {
  try {
    const { data } = await api.post("/auth/google-login", { email });
    return data;
  } catch {
    return { success: true, user_id: "user-001", token: "mock-token" };
  }
};

export const verifyPhone = async (phone: string, otp: string) => {
  try {
    const { data } = await api.post("/auth/verify-phone", { phone, otp });
    return data;
  } catch {
    return { verified: true };
  }
};

// ── Trust Score ──────────────────────────────────────────────────
export const getTrustScore = async (email: string) => {
  try {
    const { data } = await api.get(`/trust/score/${email}`);
    return data;
  } catch {
    return {
      score: 87,
      level: "Trusted",
      breakdown: { identity: 95, community: 80, activity: 86 },
      badges: ["Verified ID", "Active Patroller", "Guardian Angel"],
    };
  }
};

// ── Session Timeline ─────────────────────────────────────────────
export const getSessionTimeline = async (user_id: string) => {
  try {
    const { data } = await api.get(`/session/timeline/${user_id}`);
    return data;
  } catch {
    return {
      events: [
        { id: "e1", type: "check_in", message: "Safety check-in at City Center Mall", time: "2 min ago", status: "safe" },
        { id: "e2", type: "zone_enter", message: "Entered Safe Zone: Panjagutta", time: "18 min ago", status: "safe" },
        { id: "e3", type: "volunteer", message: "Volunteer Anita is 1.4km away", time: "25 min ago", status: "info" },
        { id: "e4", type: "risk_update", message: "Area risk updated to CAUTION", time: "1 hr ago", status: "caution" },
        { id: "e5", type: "sos_test", message: "SOS drill completed successfully", time: "3 hrs ago", status: "safe" },
      ],
    };
  }
};

export default api;
