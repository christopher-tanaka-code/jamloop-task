"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const r = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setErr(null);
    setLoading(true);
    const sb = createSupabaseClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    r.replace("/campaigns");
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-3 border rounded-xl p-6"
      >
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <label className="block text-sm">
          <span className="sr-only">Email</span>
          <input
            className="w-full border p-2 rounded"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="sr-only">Password</span>
          <input
            className="w-full border p-2 rounded"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          className="w-full border rounded p-2 disabled:opacity-50"
          type="submit"
          disabled={!email || !password || loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-gray-500">
          Use the demo accounts listed in the project&apos;s README.
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
