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

export const Route = createFileRoute("/")({
  component: Index,
});

type Screen = "login" | "s1" | "s2" | "s3" | "s4" | "loading" | "home";

function Index() {
  const [screen, setScreen] = useState<Screen>("login");

  return (
    <PhoneFrame>
      {screen === "login" && (
        <LoginScreen onCreate={() => setScreen("s1")} onLogin={() => setScreen("home")} />
      )}
      {screen === "s1" && (
        <Step1Account onBack={() => setScreen("login")} onNext={() => setScreen("s2")} />
      )}
      {screen === "s2" && (
        <Step2Financial onBack={() => setScreen("s1")} onNext={() => setScreen("s3")} />
      )}
      {screen === "s3" && (
        <Step3Goal onBack={() => setScreen("s2")} onNext={() => setScreen("s4")} />
      )}
      {screen === "s4" && (
        <Step4Bank onBack={() => setScreen("s3")} onNext={() => setScreen("loading")} />
      )}
      {screen === "loading" && <PlanGenerating onDone={() => setScreen("home")} />}
      {screen === "home" && <HomeScreen onReset={() => setScreen("login")} />}
    </PhoneFrame>
  );
}
