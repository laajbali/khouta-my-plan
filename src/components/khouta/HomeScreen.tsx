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
import {
  TransferScreen,
  PayBillsScreen,
  QrPayScreen,
  MoreServicesScreen,
  StatementScreen,
  GoalDetailScreen,
  NewGoalScreen,
  CalendarScreen,
} from "./ActionScreens";

type SubScreen =
  | "none"
  | "noor"
  | "bank"
  | "transfer"
  | "pay"
  | "qr"
  | "more"
  | "statement"
  | "goal"
  | "new-goal"
  | "calendar";

export function HomeScreen({ onReset: _onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [sub, setSub] = useState<SubScreen>("none");
  const [interceptOpen, setInterceptOpen] = useState(false);
  const [interceptMerchant, setInterceptMerchant] = useState<"SHEIN" | "نون" | "noon">("SHEIN");
  const [interceptAmount, setInterceptAmount] = useState(240);

  const close = () => setSub("none");

  if (sub === "noor") return <NoorChat onBack={close} />;
  if (sub === "bank")
    return <BankConnect onBack={close} onConnected={close} />;
  if (sub === "transfer") return <TransferScreen onBack={close} />;
  if (sub === "pay") return <PayBillsScreen onBack={close} />;
  if (sub === "qr") return <QrPayScreen onBack={close} />;
  if (sub === "more") return <MoreServicesScreen onBack={close} />;
  if (sub === "statement") return <StatementScreen onBack={close} />;
  if (sub === "goal") return <GoalDetailScreen onBack={close} />;
  if (sub === "new-goal") return <NewGoalScreen onBack={close} />;
  if (sub === "calendar") return <CalendarScreen onBack={close} />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        {tab === "home" && (
          <HomeTab
            onOpenNoor={() => setSub("noor")}
            onOpenBank={() => setSub("bank")}
            onOpenTransfer={() => setSub("transfer")}
            onOpenPay={() => setSub("pay")}
            onOpenQr={() => setSub("qr")}
            onOpenMore={() => setSub("more")}
            onOpenStatement={() => setSub("statement")}
            onOpenGoal={() => setSub("goal")}
            onOpenNewGoal={() => setSub("new-goal")}
            onOpenCalendar={() => setSub("calendar")}
            onOpenNotifications={() => setTab("notifications")}
            onOpenReports={() => setTab("reports")}
            onOpenRewards={() => setTab("rewards")}
          />
        )}
        {tab === "rewards" && <RewardsTab />}
        {tab === "profile" && <ProfileTab />}
        {tab === "notifications" && (
          <NotificationsTab
            onSimulateIntercept={(merchant, amount) => {
              setInterceptMerchant(merchant);
              setInterceptAmount(amount);
              setInterceptOpen(true);
            }}
          />
        )}
        {tab === "reports" && <ReportsTab />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
      <InterceptModal
        open={interceptOpen}
        onCancel={() => setInterceptOpen(false)}
        onProceed={() => setInterceptOpen(false)}
        merchant={interceptMerchant}
        amount={interceptAmount}
      />
    </div>
  );
}
