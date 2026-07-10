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
import { DonationScreen } from "./DonationScreen";
import {
  TransferScreen,
  PayBillsScreen,
  QrPayScreen,
  MoreServicesScreen,
  StatementScreen,
  GoalDetailScreen,
  GoalsListScreen,
  NewGoalScreen,
  CalendarScreen,
  RadarScreen,
  GroupChallengeScreen,
} from "./ActionScreens";
import { useProfile, useGoals } from "@/hooks/use-khouta-data";

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
  | "goals-list"
  | "new-goal"
  | "calendar"
  | "radar"
  | "group"
  | "donate";

export function HomeScreen({ onReset: _onReset }: { onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [sub, setSub] = useState<SubScreen>("none");
  const [interceptOpen, setInterceptOpen] = useState(false);
  const [interceptMerchant, setInterceptMerchant] = useState<string>("SHEIN");
  const [interceptAmount, setInterceptAmount] = useState(240);
  const profile = useProfile();
  const { goals } = useGoals();
  const topGoal = goals[0];

  const close = () => setSub("none");

  if (sub === "noor") return <NoorChat onBack={close} userName={profile?.full_name ?? ""} />;
  if (sub === "bank")
    return <BankConnect onBack={close} onConnected={close} />;
  if (sub === "transfer") return <TransferScreen onBack={close} />;
  if (sub === "pay") return <PayBillsScreen onBack={close} />;
  if (sub === "qr") return <QrPayScreen onBack={close} />;
  if (sub === "more") return <MoreServicesScreen onBack={close} />;
  if (sub === "statement") return <StatementScreen onBack={close} />;
  if (sub === "goal") return <GoalDetailScreen onBack={close} />;
  if (sub === "goals-list")
    return (
      <GoalsListScreen
        onBack={close}
        onOpenGoal={() => setSub("goal")}
        onOpenNewGoal={() => setSub("new-goal")}
      />
    );
  if (sub === "new-goal") return <NewGoalScreen onBack={close} />;
  if (sub === "calendar") return <CalendarScreen onBack={close} />;
  if (sub === "radar") return <RadarScreen onBack={close} />;
  if (sub === "group")
    return <GroupChallengeScreen onBack={close} userName={profile?.full_name ?? ""} />;
  if (sub === "donate") return <DonationScreen onBack={close} />;

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
            onOpenGoal={() => setSub(goals.length > 0 ? "goals-list" : "new-goal")}
            onOpenNewGoal={() => setSub("new-goal")}
            onOpenCalendar={() => setSub("calendar")}
            onOpenNotifications={() => setTab("notifications")}
            onOpenReports={() => setTab("reports")}
            onOpenRewards={() => setTab("rewards")}
            onOpenProfile={() => setTab("profile")}
            onOpenRadar={() => setSub("radar")}
            onOpenGroup={() => setSub("group")}
            onOpenDonate={() => setSub("donate")}
          />

        )}
        {tab === "rewards" && (
          <RewardsTab
            onOpenNotifications={() => setTab("notifications")}
            onCompleteReward={() => setTab("notifications")}
          />
        )}
        {tab === "profile" && <ProfileTab onOpenNotifications={() => setTab("notifications")} onSignOut={_onReset} />}
        {tab === "notifications" && (
          <NotificationsTab
            onSimulateIntercept={(merchant, amount) => {
              setInterceptMerchant(merchant);
              setInterceptAmount(amount);
              setInterceptOpen(true);
            }}
            onOpenDonate={() => setSub("donate")}
          />
        )}
        {tab === "reports" && <ReportsTab onOpenNotifications={() => setTab("notifications")} />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
      <InterceptModal
        open={interceptOpen}
        onCancel={() => setInterceptOpen(false)}
        onProceed={() => setInterceptOpen(false)}
        merchant={interceptMerchant}
        amount={interceptAmount}
        userName={profile?.full_name ?? ""}
        goalTitle={topGoal?.title ?? "هدفك"}
        goalTarget={Number(topGoal?.target_amount ?? 25000)}
        goalSaved={Number(topGoal?.saved_amount ?? 0)}
      />
    </div>
  );
}
