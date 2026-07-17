import { createFileRoute } from "@tanstack/react-router";
import { RadarScreen } from "@/components/khouta/ActionScreens";

export const Route = createFileRoute("/radar")({
  component: () => <RadarScreen onBack={() => {}} />,
});
