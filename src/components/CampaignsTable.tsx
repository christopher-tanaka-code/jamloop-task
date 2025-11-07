"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Campaign, CampaignsTableProps } from "@/types";

const CampaignsTable = ({ onEdit, onDelete }: CampaignsTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const search = searchParams.get("search") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const screens = searchParams.get("screens") || "";
  const inventory = searchParams.get("inventory") || "";

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (screens) params.set("screens", screens);
    if (inventory) params.set("inventory", inventory);

    try {
      const res = await fetch(`/api/campaigns?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch campaigns");
      }
      const data = await res.json();
      setCampaigns(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, from, to, screens, inventory]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/campaigns?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading && campaigns.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Error loading campaigns</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchCampaigns}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (
    campaigns.length === 0 &&
    !search &&
    !from &&
    !to &&
    !screens &&
    !inventory
  ) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">
          No campaigns yet. Create your first campaign!
        </p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No campaigns match your filters.</p>
        <button
          onClick={() => router.push("/campaigns")}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left text-sm font-semibold">Name</th>
            <th className="p-3 text-left text-sm font-semibold">Budget</th>
            <th className="p-3 text-left text-sm font-semibold">Dates</th>
            <th className="p-3 text-left text-sm font-semibold">
              Demographics
            </th>
            <th className="p-3 text-left text-sm font-semibold">Location</th>
            <th className="p-3 text-left text-sm font-semibold">Screens</th>
            <th className="p-3 text-left text-sm font-semibold">Publishers</th>
            <th className="p-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-sm font-medium">{campaign.name}</td>
              <td className="p-3 text-sm">
                ${campaign.budget_usd.toLocaleString()}
              </td>
              <td className="p-3 text-sm">
                <div className="text-xs">
                  <div>{campaign.start_date}</div>
                  <div className="text-gray-500">to {campaign.end_date}</div>
                </div>
              </td>
              <td className="p-3 text-sm">
                <div className="text-xs">
                  <div>
                    Ages {campaign.age_min}-{campaign.age_max}
                  </div>
                  <div className="text-gray-500 capitalize">
                    {campaign.gender}
                  </div>
                </div>
              </td>
              <td className="p-3 text-sm">
                <div className="text-xs">
                  <div>{campaign.country}</div>
                  {campaign.state && (
                    <div className="text-gray-500">{campaign.state}</div>
                  )}
                </div>
              </td>
              <td className="p-3 text-xs">
                <div className="flex flex-wrap gap-1">
                  {campaign.screens.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-3 text-xs">
                <div className="flex flex-wrap gap-1">
                  {campaign.inventory.slice(0, 2).map((pub) => (
                    <span
                      key={pub}
                      className="rounded bg-purple-100 px-1.5 py-0.5 text-purple-700"
                    >
                      {pub}
                    </span>
                  ))}
                  {campaign.inventory.length > 2 && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700">
                      +{campaign.inventory.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(campaign)}
                    className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(campaign)}
                    className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} campaigns
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => updateQuery({ page: (page - 1).toString() })}
            disabled={page === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => updateQuery({ page: pageNum.toString() })}
                  className={`rounded px-3 py-1 text-sm ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => updateQuery({ page: (page + 1).toString() })}
            disabled={page === totalPages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTable;
