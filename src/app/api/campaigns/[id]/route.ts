import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { CampaignInput } from "@/lib/schemas";
import type { CampaignUpdate } from "@/types";

const normalizeYYYYMMDD = (v: unknown): string | undefined => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v;
  return undefined;
};

export const GET = async (
  _req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const sb = await supabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("campaigns")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
};

export const PATCH = async (
  req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const sb = await supabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const parsed = CampaignInput.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const upd: CampaignUpdate = {};

  // Copy all fields and normalize dates
  if (parsed.data.name !== undefined) upd.name = parsed.data.name;
  if (parsed.data.budget_usd !== undefined)
    upd.budget_usd = parsed.data.budget_usd;
  if (parsed.data.age_min !== undefined) upd.age_min = parsed.data.age_min;
  if (parsed.data.age_max !== undefined) upd.age_max = parsed.data.age_max;
  if (parsed.data.gender !== undefined) upd.gender = parsed.data.gender;
  if (parsed.data.country !== undefined) upd.country = parsed.data.country;
  if (parsed.data.state !== undefined) upd.state = parsed.data.state;
  if (parsed.data.city !== undefined) upd.city = parsed.data.city;
  if (parsed.data.zip !== undefined) upd.zip = parsed.data.zip;
  if (parsed.data.inventory !== undefined)
    upd.inventory = parsed.data.inventory;
  if (parsed.data.screens !== undefined) upd.screens = parsed.data.screens;

  if (parsed.data.start_date !== undefined) {
    upd.start_date = normalizeYYYYMMDD(parsed.data.start_date);
  }
  if (parsed.data.end_date !== undefined) {
    upd.end_date = normalizeYYYYMMDD(parsed.data.end_date);
  }

  const { data, error } = await sb
    .from("campaigns")
    .update(upd)
    .eq("id", params.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
};

export const DELETE = async (
  _req: Request,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const sb = await supabaseServer();

  // Check authentication
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await sb.from("campaigns").delete().eq("id", params.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
};
