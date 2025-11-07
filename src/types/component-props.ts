import type { Campaign, CampaignFormData } from "./campaign";
import type { ToastType } from "./ui";

export type CampaignFormProps = {
  campaign?: Campaign;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export type CampaignsTableProps = {
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
};

export type ConfirmDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
};
