import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function getUserDetails() {
  const getId = useQuery({
    queryKey: ["id"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      return user.id;
    },
  });

  const getFullDetails = useQuery({
    queryKey: ["full-details"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      return user;
    },
  });

  return { getId, getFullDetails };
}
