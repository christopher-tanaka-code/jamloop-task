"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CampaignFormProps } from "@/types";
import type { Gender, Screen, Publisher } from "@/types";

const GENDERS: Gender[] = ["any", "male", "female", "nonbinary"];
const SCREENS: Screen[] = ["CTV", "Mobile Device", "Web Browser"];
const PUBLISHERS: Publisher[] = [
  "Hulu",
  "Discovery",
  "ABC",
  "A&E",
  "TLC",
  "Fox News",
  "Fox Sports",
  "Etc",
];

type FormData = {
  name: string;
  budget_usd: number;
  start_date: string;
  end_date: string;
  age_min: number;
  age_max: number;
  gender: Gender;
  country: string;
  state: string;
  city: string;
  zip: string;
  inventory: Publisher[];
  screens: Screen[];
};

const CampaignForm = ({
  campaign,
  onSubmit,
  onCancel,
  isSubmitting,
}: CampaignFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: campaign
      ? {
          name: campaign.name,
          budget_usd: campaign.budget_usd,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          age_min: campaign.age_min,
          age_max: campaign.age_max,
          gender: campaign.gender,
          country: campaign.country,
          state: campaign.state || "",
          city: campaign.city || "",
          zip: campaign.zip || "",
          inventory: campaign.inventory,
          screens: campaign.screens,
        }
      : {
          name: "",
          budget_usd: 0,
          start_date: "",
          end_date: "",
          age_min: 18,
          age_max: 65,
          gender: "any",
          country: "US",
          state: "",
          city: "",
          zip: "",
          inventory: [],
          screens: [],
        },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedScreens = watch("screens") || [];
  const selectedInventory = watch("inventory") || [];

  const toggleScreen = (screen: Screen) => {
    const current = selectedScreens;
    const updated = current.includes(screen)
      ? current.filter((s) => s !== screen)
      : [...current, screen];
    setValue("screens", updated);
  };

  const toggleInventory = (pub: Publisher) => {
    const current = selectedInventory;
    const updated = current.includes(pub)
      ? current.filter((p) => p !== pub)
      : [...current, pub];
    setValue("inventory", updated);
  };

  const handleFormSubmit = async (data: FormData) => {
    setFormError(null);

    // Validate date range
    if (data.start_date > data.end_date) {
      setFormError("Start date must be before or equal to end date");
      return;
    }

    // Validate age range
    if (data.age_min > data.age_max) {
      setFormError("Minimum age must be less than or equal to maximum age");
      return;
    }

    // Validate screens selection
    if (data.screens.length === 0) {
      setFormError("Please select at least one screen/device");
      return;
    }

    // Validate inventory selection
    if (data.inventory.length === 0) {
      setFormError("Please select at least one publisher");
      return;
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Form-level error message */}
      {formError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Validation Error
              </h3>
              <div className="mt-1 text-sm text-red-700">{formError}</div>
            </div>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 text-red-500 hover:bg-red-100"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Campaign Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Campaign Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Campaign name is required",
            minLength: 2,
          })}
          className="w-full rounded border p-2"
          placeholder="Enter campaign name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Budget (USD) <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          {...register("budget_usd", {
            required: "Budget is required",
            min: 0,
          })}
          className="w-full rounded border p-2"
          placeholder="0.00"
          step="0.01"
          min="0"
        />
        {errors.budget_usd && (
          <p className="mt-1 text-sm text-red-600">
            {errors.budget_usd.message}
          </p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            {...register("start_date", { required: "Start date is required" })}
            className="w-full rounded border p-2"
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.start_date.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            End Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            {...register("end_date", { required: "End date is required" })}
            className="w-full rounded border p-2"
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.end_date.message}
            </p>
          )}
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Min Age <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            {...register("age_min", { required: true, min: 13, max: 120 })}
            className="w-full rounded border p-2"
            min="13"
            max="120"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Max Age <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            {...register("age_max", { required: true, min: 13, max: 120 })}
            className="w-full rounded border p-2"
            min="13"
            max="120"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Gender <span className="text-red-600">*</span>
          </label>
          <select
            {...register("gender", { required: true })}
            className="w-full rounded border p-2"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("country", {
              required: "Country is required",
              minLength: 2,
            })}
            className="w-full rounded border p-2"
            placeholder="US"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            {...register("state")}
            className="w-full rounded border p-2"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            {...register("city")}
            className="w-full rounded border p-2"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zip Code</label>
          <input
            type="text"
            {...register("zip")}
            className="w-full rounded border p-2"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Screens */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Screens/Devices <span className="text-red-600">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SCREENS.map((screen) => (
            <button
              key={screen}
              type="button"
              onClick={() => toggleScreen(screen)}
              className={`rounded px-4 py-2 text-sm font-medium ${
                selectedScreens.includes(screen)
                  ? "bg-blue-600 text-white"
                  : "border bg-white hover:bg-gray-50"
              }`}
            >
              {screen}
            </button>
          ))}
        </div>
        {selectedScreens.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Select at least one screen type
          </p>
        )}
      </div>

      {/* Inventory/Publishers */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Publishers/Inventory <span className="text-red-600">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PUBLISHERS.map((pub) => (
            <button
              key={pub}
              type="button"
              onClick={() => toggleInventory(pub)}
              className={`rounded px-4 py-2 text-sm font-medium ${
                selectedInventory.includes(pub)
                  ? "bg-purple-600 text-white"
                  : "border bg-white hover:bg-gray-50"
              }`}
            >
              {pub}
            </button>
          ))}
        </div>
        {selectedInventory.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Select at least one publisher
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-6 py-2 font-medium hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : campaign
            ? "Update Campaign"
            : "Create Campaign"}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
