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

// Duration of the crossfade overlay after the splash animation finishes.
const SPLASH_FADE_MS = 500;

function Index() {
  const { session, ready } = useSession();
  const [screen, setScreen] = useState<Screen>("splash");
  // While true, splash's onDone must land on "login" regardless of any lingering session.
  const [forceLoginAfterSplash, setForceLoginAfterSplash] = useState(false);
  // Keep splash mounted as a fading overlay after the next screen renders underneath.
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setForceLoginAfterSplash(true);
        setSplashFading(false);
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
    setForceLoginAfterSplash(true);
    setSplashFading(false);
    setScreen("splash");
    await supabase.auth.signOut();
  }

  function handleSplashDone() {
    // Swap to the destination screen underneath, then fade the splash overlay out.
    const next: Screen = forceLoginAfterSplash ? "login" : session ? "home" : "login";
    if (forceLoginAfterSplash) setForceLoginAfterSplash(false);
    setScreen(next);
    setSplashFading(true);
    window.setTimeout(() => setSplashFading(false), SPLASH_FADE_MS);
  }

  const showSplashOverlay = active === "splash" || splashFading;

  return (
    <PhoneFrame>
      <div className="relative flex-1 flex flex-col">
        {active === "splash" ? (
          // Reserve layout space while the very first splash plays.
          <div className="flex-1" />
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

        {showSplashOverlay && (
          <div
            aria-hidden={splashFading}
            className="absolute inset-0 z-50"
            style={{
              opacity: splashFading ? 0 : 1,
              transition: `opacity ${SPLASH_FADE_MS}ms ease-out`,
              pointerEvents: splashFading ? "none" : "auto",
            }}
          >
            <SplashScreen onDone={handleSplashDone} />
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
