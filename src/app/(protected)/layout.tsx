import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { Header } from "@/components";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProtectedLayout;
