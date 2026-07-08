import { useState } from "react";
import { BottomNav, type Tab } from "./BottomNav";
import { HomeTab } from "./tabs/HomeTab";
import { RewardsTab } from "./tabs/RewardsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { ReportsTab } from "./tabs/ReportsTab";

export function HomeScreen({ onReset: _onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  return (
    <div className="bg-card min-h-[700px] flex flex-col">
      <div className="flex-1">
        {tab === "home" && <HomeTab />}
        {tab === "rewards" && <RewardsTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "reports" && <ReportsTab />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
