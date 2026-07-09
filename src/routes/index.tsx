import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/khouta/PhoneFrame";
import { LoginScreen } from "@/components/khouta/LoginScreen";
import { SplashScreen } from "@/components/khouta/SplashScreen";
import { Step1Account } from "@/components/khouta/Step1Account";
import { Step2Financial } from "@/components/khouta/Step2Financial";
import { Step3Goal } from "@/components/khouta/Step3Goal";
import { Step4Card } from "@/components/khouta/Step4Card";
import { PlanGenerating } from "@/components/khouta/PlanGenerating";
import { HomeScreen } from "@/components/khouta/HomeScreen";
import { OnboardingProvider } from "@/components/khouta/onboarding-context";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

type Screen = "splash" | "login" | "s1" | "s2" | "s3" | "s4" | "generating" | "home";
const ONBOARDING: Screen[] = ["s1", "s2", "s3", "s4", "generating"];

function Index() {
  const { session, ready } = useSession();
  const [screen, setScreen] = useState<Screen>("splash");
  // While true, splash's onDone must land on "login" regardless of any lingering session.
  const [forceLoginAfterSplash, setForceLoginAfterSplash] = useState(false);

  // Whenever the session ends (logout), replay the splash, then land on login.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setForceLoginAfterSplash(true);
        setScreen("splash");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Splash always shows first. After that, if signed in and not in onboarding, go home.
  const active: Screen =
    screen === "splash"
      ? "splash"
      : session && !ONBOARDING.includes(screen)
        ? "home"
        : screen;

  async function handleReset() {
    // Kick off splash immediately so the user sees Logout → Splash → Login.
    setForceLoginAfterSplash(true);
    setScreen("splash");
    await supabase.auth.signOut();
  }

  function handleSplashDone() {
    if (forceLoginAfterSplash) {
      setForceLoginAfterSplash(false);
      setScreen("login");
      return;
    }
    setScreen(session ? "home" : "login");
  }

  return (
    <PhoneFrame>
      {active === "splash" ? (
        <SplashScreen onDone={() => setScreen(session ? "home" : "login")} />
      ) : !ready ? (
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
            <Step3Goal onBack={() => setScreen("s2")} onFinish={() => setScreen("s4")} />
          )}
          {active === "s4" && (
            <Step4Card onBack={() => setScreen("s3")} onNext={() => setScreen("generating")} />
          )}
          {active === "generating" && (
            <PlanGenerating onDone={() => setScreen("home")} />
          )}
          {active === "home" && <HomeScreen onReset={handleReset} />}
        </OnboardingProvider>
      )}
    </PhoneFrame>
  );
}
