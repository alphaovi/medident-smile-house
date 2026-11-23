import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const AccountStatusSection = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          Account Role, Approval & Verification Status
        </h3>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {formData.isActive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div className="space-y-0.5">
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.isActive ? "Account is active" : "Account is inactive"}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(formData.isActive)}
            disabled
            aria-readonly="true"
            className="w-5 h-5 rounded accent-indigo-600 cursor-not-allowed"
          />
        </div>

        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {formData.isEmailVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div className="space-y-0.5">
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.isEmailVerified ? "Email verified" : "Email not verified"}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(formData.isEmailVerified)}
            disabled
            aria-readonly="true"
            className="w-5 h-5 rounded accent-indigo-600 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountStatusSection;