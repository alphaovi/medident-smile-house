import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ProfileToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const toastStyle =
    toast.type === "error"
      ? "bg-rose-600/95 border-rose-500 text-white"
      : toast.type === "info"
      ? "bg-slate-800/95 border-slate-700 text-white"
      : "bg-emerald-600/95 border-emerald-500 text-white";

  return (
    <div
      role="status"
      className={`fixed top-5 right-5 z-50 max-w-sm w-full px-4 py-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 text-sm font-medium transition-all ${toastStyle}`}
    >
      {toast.type === "error" ? (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        className="text-white/80 hover:text-white shrink-0"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProfileToast;