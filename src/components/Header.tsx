"use client";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Header = () => {
  const r = useRouter();

  const onSignOut = async () => {
    const sb = createSupabaseClient();
    await sb.auth.signOut();
    r.replace("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-lg font-semibold">JamLoop</h1>
      <button className="border rounded px-3 py-1" onClick={onSignOut}>
        Sign out
      </button>
    </header>
  );
};

export default Header;
