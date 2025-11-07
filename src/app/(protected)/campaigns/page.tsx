"use client";
import { useState } from "react";
import {
  CampaignsTable,
  CampaignFilters,
  CampaignForm,
  Modal,
  ConfirmDialog,
  Toast,
} from "@/components";
import type { Campaign, CampaignFormData, ToastState } from "@/types";

const CampaignsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const handleCreate = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create campaign");
      }

      showToast("Campaign created successfully!", "success");
      setIsCreateModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create campaign",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: CampaignFormData) => {
    if (!editingCampaign) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/campaigns/${editingCampaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update campaign");
      }

      showToast("Campaign updated successfully!", "success");
      setEditingCampaign(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update campaign",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCampaign) return;
    try {
      const res = await fetch(`/api/campaigns/${deletingCampaign.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete campaign");
      }

      showToast("Campaign deleted successfully!", "success");
      setDeletingCampaign(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete campaign",
        "error"
      );
      setDeletingCampaign(null);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your advertising campaigns
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CampaignFilters />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border bg-white">
            <CampaignsTable
              key={refreshKey}
              onEdit={(campaign) => setEditingCampaign(campaign)}
              onDelete={(campaign) => setDeletingCampaign(campaign)}
            />
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Campaign"
      >
        <CampaignForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingCampaign}
        onClose={() => setEditingCampaign(null)}
        title="Edit Campaign"
      >
        {editingCampaign && (
          <CampaignForm
            campaign={editingCampaign}
            onSubmit={handleEdit}
            onCancel={() => setEditingCampaign(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCampaign}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCampaign(null)}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deletingCampaign?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default CampaignsPage;
