import { Save, RotateCcw } from "lucide-react";

const ProfileFormActions = ({ saving, onReset }) => {
  return (
    <div className="px-6 sm:px-8 py-5 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
      <button
        type="button"
        onClick={onReset}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-md hover:opacity-95 disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Profile Settings"}
      </button>
    </div>
  );
};

export default ProfileFormActions;