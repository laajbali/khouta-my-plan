import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/khouta/PhoneFrame";
import { LoginScreen } from "@/components/khouta/LoginScreen";
import { Step1Account } from "@/components/khouta/Step1Account";
import { Step2Financial } from "@/components/khouta/Step2Financial";
import { Step3Goal } from "@/components/khouta/Step3Goal";
import { Step4Bank } from "@/components/khouta/Step4Bank";
import { PlanGenerating } from "@/components/khouta/PlanGenerating";
import { HomeScreen } from "@/components/khouta/HomeScreen";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

type Screen = "login" | "s1" | "s2" | "s3" | "s4" | "loading" | "home";

function Index() {
  const { session, ready } = useSession();
  const [screen, setScreen] = useState<Screen>("login");

  // Once signed in, snap to home
  const active: Screen = session && screen === "login" ? "home" : screen;

  async function handleReset() {
    await supabase.auth.signOut();
    setScreen("login");
  }

  return (
    <PhoneFrame>
      {!ready ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          جارٍ التحميل...
        </div>
      ) : (
        <>
          {active === "login" && (
            <LoginScreen onCreate={() => setScreen("s1")} onLogin={() => setScreen("home")} />
          )}
          {active === "s1" && (
            <Step1Account onBack={() => setScreen("login")} onNext={() => setScreen("s2")} />
          )}
          {active === "s2" && (
            <Step2Financial onBack={() => setScreen("s1")} onNext={() => setScreen("s3")} />
          )}
          {active === "s3" && (
            <Step3Goal onBack={() => setScreen("s2")} onNext={() => setScreen("s4")} />
          )}
          {active === "s4" && (
            <Step4Bank onBack={() => setScreen("s3")} onNext={() => setScreen("loading")} />
          )}
          {active === "loading" && <PlanGenerating onDone={() => setScreen("home")} />}
          {active === "home" && <HomeScreen onReset={handleReset} />}
        </>
      )}
    </PhoneFrame>
  );
}
