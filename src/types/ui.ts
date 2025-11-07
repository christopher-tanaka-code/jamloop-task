export type ToastType = "success" | "error" | "info";

export type ToastState = {
  message: string;
  type: ToastType;
} | null;
