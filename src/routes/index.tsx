import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/khouta/PhoneFrame";
import { LoginScreen } from "@/components/khouta/LoginScreen";
import { Step1Account } from "@/components/khouta/Step1Account";
import { Step2Financial } from "@/components/khouta/Step2Financial";
import { Step3Goal } from "@/components/khouta/Step3Goal";
import { HomeScreen } from "@/components/khouta/HomeScreen";
import { OnboardingProvider } from "@/components/khouta/onboarding-context";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

type Screen = "login" | "s1" | "s2" | "s3" | "home";

function Index() {
  const { session, ready } = useSession();
  const [screen, setScreen] = useState<Screen>("login");

  // Once signed in from anywhere (login OR after signup), show home
  const active: Screen = session && screen !== "s1" && screen !== "s2" && screen !== "s3"
    ? "home"
    : session && screen === "s3"
      ? "home"
      : screen;

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
        <OnboardingProvider>
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
            <Step3Goal onBack={() => setScreen("s2")} onFinish={() => setScreen("home")} />
          )}
          {active === "home" && <HomeScreen onReset={handleReset} />}
        </OnboardingProvider>
      )}
    </PhoneFrame>
  );
}
