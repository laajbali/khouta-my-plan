import { createFileRoute } from '@tanstack/react-router';
import { GroupChallengeScreen } from '@/components/khouta/ActionScreens';

export const Route = createFileRoute('/chat-preview')({
  component: () => <GroupChallengeScreen onBack={() => {}} userName="سارة" />,
});
