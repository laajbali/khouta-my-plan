import { useState } from "react";
import { BottomNav, type Tab } from "./BottomNav";
import { HomeTab } from "./tabs/HomeTab";
import { RewardsTab } from "./tabs/RewardsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { NoorChat } from "./NoorChat";
import { BankConnect } from "./BankConnect";
import { InterceptModal } from "./InterceptModal";

type SubScreen = "none" | "noor" | "bank";

export function HomeScreen({ onReset: _onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [sub, setSub] = useState<SubScreen>("none");
  const [interceptOpen, setInterceptOpen] = useState(false);

  // Sub-screens take over the entire phone body (nav hidden)
  if (sub === "noor") return <NoorChat onBack={() => setSub("none")} />;
  if (sub === "bank")
    return <BankConnect onBack={() => setSub("none")} onConnected={() => setSub("none")} />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        {tab === "home" && (
          <HomeTab
            onOpenNoor={() => setSub("noor")}
            onOpenBank={() => setSub("bank")}
            onSimulateIntercept={() => setInterceptOpen(true)}
          />
        )}
        {tab === "rewards" && <RewardsTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "reports" && <ReportsTab />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
      <InterceptModal
        open={interceptOpen}
        onCancel={() => setInterceptOpen(false)}
        onProceed={() => setInterceptOpen(false)}
      />
    </div>
  );
}
