import { Link } from "react-router";
import { ArrowLeft, KeyRound } from "lucide-react";

const ProfileHeaderCard = ({ formData, jwtRole, isAdmin, loadingProfile }) => {
  const avatarLetter = (formData.name || formData.email || "U")
    .charAt(0)
    .toUpperCase();

  const editableSummary = isAdmin
    ? "Editable: All profile & account fields"
    : "Editable: Name, First Name, Last Name, Phone";

  return (
    <>
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1.5">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage user interface profile information
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
          <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            Role: {jwtRole || "guest"}
          </span>
          {isAdmin && (
            <span className="ml-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              Full Access
            </span>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 border-y border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
            {avatarLetter}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {formData.name || "Unnamed User"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.email || "No email"}
            </p>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {editableSummary}
            </p>
          </div>
        </div>

        {loadingProfile && (
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
            Syncing with server...
          </span>
        )}
      </div>
    </>
  );
};

export default ProfileHeaderCard;