import type { ListQuery } from "@/types";

export const parseQuery = (sp: URLSearchParams): ListQuery => {
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.max(1, Number(sp.get("pageSize") ?? "10"));
  const qp = (k: string) => sp.get(k) || undefined;
  const arr = (k: string) =>
    qp(k)?.split(",").filter(Boolean) as string[] | undefined;
  return {
    page,
    pageSize,
    search: qp("search"),
    from: qp("from"),
    to: qp("to"),
    screens: arr("screens"),
    inventory: arr("inventory"),
  };
};
