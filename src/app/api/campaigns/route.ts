import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { parseQuery } from "@/lib/filters";
import { CampaignInput } from "@/lib/schemas";
import type { Campaign, Database } from "@/types";

type CampaignRow = Campaign;

export const GET = async (req: Request) => {
  const sb = await supabaseServer();
  const url = new URL(req.url);
  const {
    page = 1,
    pageSize = 10,
    search,
    from,
    to,
    screens,
    inventory,
  } = parseQuery(url.searchParams);

  const offset = (page - 1) * pageSize;
  const limitTo = offset + pageSize - 1;

  // COUNT query
  let countQ = sb.from("campaigns").select("*", { count: "exact", head: true });
  if (search) countQ = countQ.ilike("name", `%${search}%`);
  if (screens?.length)
    countQ = countQ.overlaps("screens", screens as CampaignRow["screens"]);
  if (inventory?.length)
    countQ = countQ.overlaps(
      "inventory",
      inventory as CampaignRow["inventory"]
    );
  if (from && to) countQ = countQ.lte("start_date", to).gte("end_date", from);
  else if (from) countQ = countQ.gte("end_date", from);
  else if (to) countQ = countQ.lte("start_date", to);

  const countRes = await countQ;
  if (countRes.error)
    return NextResponse.json(
      { error: countRes.error.message },
      { status: 400 }
    );
  const total = countRes.count ?? 0;

  // DATA query
  let dataQ = sb
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, limitTo);

  if (search) dataQ = dataQ.ilike("name", `%${search}%`);
  if (screens?.length)
    dataQ = dataQ.overlaps("screens", screens as CampaignRow["screens"]);
  if (inventory?.length)
    dataQ = dataQ.overlaps("inventory", inventory as CampaignRow["inventory"]);
  if (from && to) dataQ = dataQ.lte("start_date", to).gte("end_date", from);
  else if (from) dataQ = dataQ.gte("end_date", from);
  else if (to) dataQ = dataQ.lte("start_date", to);

  const dataRes = await dataQ;
  if (dataRes.error)
    return NextResponse.json({ error: dataRes.error.message }, { status: 400 });

  return new NextResponse(
    JSON.stringify({ items: dataRes.data, total, page, pageSize }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Total-Count": String(total),
      },
    }
  );
};

export const POST = async (req: Request) => {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CampaignInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const prof = await sb
    .from("user_profiles")
    .select("account_id")
    .eq("user_id", user.id)
    .single<{ account_id: string }>();
  if (prof.error)
    return NextResponse.json({ error: prof.error.message }, { status: 400 });

  // Build a proper Insert type
  const payload: Database["public"]["Tables"]["campaigns"]["Insert"] = {
    account_id: prof.data.account_id,
    name: parsed.data.name,
    budget_usd: parsed.data.budget_usd,
    start_date:
      parsed.data.start_date instanceof Date
        ? parsed.data.start_date.toISOString().slice(0, 10)
        : (parsed.data.start_date as unknown as string),
    end_date:
      parsed.data.end_date instanceof Date
        ? parsed.data.end_date.toISOString().slice(0, 10)
        : (parsed.data.end_date as unknown as string),
    age_min: parsed.data.age_min,
    age_max: parsed.data.age_max,
    gender: parsed.data.gender,
    country: parsed.data.country,
    state: parsed.data.state ?? null,
    city: parsed.data.city ?? null,
    zip: parsed.data.zip ?? null,
    inventory: parsed.data.inventory,
    screens: parsed.data.screens,
  };

  const { data, error } = await sb
    .from("campaigns")
    .insert(payload)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
};
