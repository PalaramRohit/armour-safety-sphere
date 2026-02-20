import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SOSButton from "./SOSButton";
import SOSOverlay from "./SOSOverlay";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/map": "Map View",
  "/community": "Community & Patrol",
  "/chat": "AI Safety Assistant",
  "/profile": "Profile & Settings",
};

export default function Layout() {
  const [sosOpen, setSosOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "ARMOUR";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <SOSButton onClick={() => setSosOpen(true)} />
      <SOSOverlay isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
