"use client";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-2xl shadow-primary/20">
        <div className="h-1 bg-gradient-to-r from-primary via-teal to-accent" />
        <div className="p-6">
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <p className="mt-2 text-sm text-muted">{message}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-surface-tint"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-hard px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
