import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./use-session";

export type Profile = {
  id: string;
  full_name: string | null;
  monthly_income: number | null;
  linked_bank: string | null;
  commitment_score: number;
  income_source: string | null;
  income_label: string | null;
};

export type Goal = {
  id: string;
  title: string;
  icon: string | null;
  target_amount: number;
  saved_amount: number;
  deadline: string | null;
};

export function useProfile() {
  const { user } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return setProfile(null);
    supabase
      .from("profiles")
      .select("id, full_name, monthly_income, linked_bank, commitment_score, income_source, income_label")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  return profile;
}

export function useGoals() {
  const { user } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("savings_goals")
      .select("id, title, icon, target_amount, saved_amount, deadline")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setGoals((data ?? []) as Goal[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { goals, loading, refresh };
}
