import { User, Mail, Phone } from "lucide-react";

const PersonalInfoSection = ({ formData, isAdmin, onChange }) => {
  const emailInputClass = isAdmin
    ? "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    : "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 cursor-not-allowed";

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          Personal & Contact Information
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isAdmin
            ? "Admin mode: You can view and edit all user interface fields."
            : "User mode: You can view all interface fields, and edit your own profile details."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Full Name (name) *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Email Address (email) *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={formData.email}
              disabled={!isAdmin}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="user@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm ${emailInputClass}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            First Name (firstName)
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Last Name (lastName)
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Phone Number (phone)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;