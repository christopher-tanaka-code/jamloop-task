"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SCREEN_OPTIONS = ["CTV", "Mobile Device", "Web Browser"];
const INVENTORY_OPTIONS = [
  "Hulu",
  "Discovery",
  "ABC",
  "A&E",
  "TLC",
  "Fox News",
  "Fox Sports",
  "Etc",
];

const CampaignFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [selectedScreens, setSelectedScreens] = useState<string[]>(
    searchParams.get("screens")?.split(",").filter(Boolean) || []
  );
  const [selectedInventory, setSelectedInventory] = useState<string[]>(
    searchParams.get("inventory")?.split(",").filter(Boolean) || []
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (selectedScreens.length)
      params.set("screens", selectedScreens.join(","));
    if (selectedInventory.length)
      params.set("inventory", selectedInventory.join(","));

    router.push(`/campaigns?${params.toString()}`);
  }, [search, from, to, selectedScreens, selectedInventory, router]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, applyFilters]);

  const handleScreenToggle = (screen: string) => {
    setSelectedScreens((prev) =>
      prev.includes(screen)
        ? prev.filter((s) => s !== screen)
        : [...prev, screen]
    );
  };

  const handleInventoryToggle = (inv: string) => {
    setSelectedInventory((prev) =>
      prev.includes(inv) ? prev.filter((i) => i !== inv) : [...prev, inv]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setFrom("");
    setTo("");
    setSelectedScreens([]);
    setSelectedInventory([]);
    router.push("/campaigns");
  };

  const hasActiveFilters =
    search ||
    from ||
    to ||
    selectedScreens.length > 0 ||
    selectedInventory.length > 0;

  return (
    <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Search Campaign Name
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded border p-2 text-sm"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          />
        </div>
      </div>

      {/* Screens */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Screens/Devices
        </label>
        <div className="flex flex-wrap gap-2">
          {SCREEN_OPTIONS.map((screen) => (
            <button
              key={screen}
              onClick={() => handleScreenToggle(screen)}
              className={`rounded px-3 py-1 text-sm ${
                selectedScreens.includes(screen)
                  ? "bg-blue-600 text-white"
                  : "border bg-white hover:bg-gray-50"
              }`}
            >
              {screen}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Publishers/Inventory
        </label>
        <div className="flex flex-wrap gap-2">
          {INVENTORY_OPTIONS.map((inv) => (
            <button
              key={inv}
              onClick={() => handleInventoryToggle(inv)}
              className={`rounded px-3 py-1 text-sm ${
                selectedInventory.includes(inv)
                  ? "bg-purple-600 text-white"
                  : "border bg-white hover:bg-gray-50"
              }`}
            >
              {inv}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default CampaignFilters;
