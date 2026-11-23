import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../../Contexts/AuthContext"; //[cite: 16]
import { AuthService } from "../../../services/auth/auth.service"; //[cite: 17]
import {
  apiRequest,
  getAuthToken,
  getStoredUser,
  setAuthSession,
} from "../../../services/auth/api"; 
import { buildFormState, decodeJwtPayload } from "./ProfileHelpers";
import ProfileHeaderCard from "./ProfileHeaderCard";
import PersonalInfoSection from "./PersonalInfoSection";
import AccountStatusSection from "./AccountStatusSection";
import ProfileToast from "./ProfileToast";
import ProfileFormActions from "./ProfileFormActions";

const ProfileSettings = () => {
  const { user: contextUser } = useAuth(); //[cite: 16]
  const token = getAuthToken(); 
  const jwtPayload = useMemo(() => decodeJwtPayload(token), [token]);

  const jwtRole = useMemo(() => {
    const raw = jwtPayload?.role ?? contextUser?.role ?? getStoredUser()?.role ?? ""; 
    return String(raw).toLowerCase();
  }, [jwtPayload, contextUser]);

  const isAdmin = jwtRole === "admin";
  const initialSource = contextUser || getStoredUser() || {}; 

  const [formData, setFormData] = useState(() =>
    buildFormState(initialSource, jwtPayload)
  );
  const [baselineData, setBaselineData] = useState(() =>
    buildFormState(initialSource, jwtPayload)
  );
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ id: Date.now(), type, message });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;
    const loadMe = async () => {
      if (!token) return;
      setLoadingProfile(true);
      try {
        const res = await AuthService.getMe?.(); //[cite: 17]
        const latest = res?.user ?? res;
        if (active && latest && typeof latest === "object") {
          const next = buildFormState(latest, jwtPayload);
          setFormData(next);
          setBaselineData(next);
          setAuthSession(token, { ...(getStoredUser() || {}), ...latest }); 
        }
      } catch {
        // Fallback to stored/JWT data
      } finally {
        if (active) setLoadingProfile(false);
      }
    };
    loadMe();
    return () => {
      active = false;
    };
  }, [token, jwtPayload]);

  useEffect(() => {
    if (!contextUser) return;
    const next = buildFormState(contextUser, jwtPayload);
    setFormData((prev) => ({ ...prev, ...next }));
    setBaselineData((prev) => ({ ...prev, ...next }));
  }, [contextUser, jwtPayload]);

  const handleFieldChange = (field, value) => {
    setFeedback(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData(baselineData);
    setFeedback({ type: "info", message: "Changes reverted." });
    showToast("info", "Changes reverted.");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const computedName =
      formData.name.trim() ||
      `${formData.firstName || ""} ${formData.lastName || ""}`.trim() ||
      formData.email.split("@")[0];

    const payload = isAdmin
      ? {
          name: computedName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          role: formData.role,
          status: formData.status,
          isActive: Boolean(formData.isActive),
          isEmailVerified: Boolean(formData.isEmailVerified),
        }
      : {
          name: computedName,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
        };

    let synced = false;
    if (token) {
      try {
        const endpoint =
          isAdmin && formData._id ? `/users/${formData._id}` : "/users/me";
        const res = await apiRequest(endpoint, {
          method: "PATCH",
          body: JSON.stringify(payload),
        }); 
        const updated = res?.data?.user ?? res?.data ?? res;
        if (updated && typeof updated === "object") {
          const merged = buildFormState({ ...formData, ...updated }, jwtPayload);
          setFormData(merged);
          setBaselineData(merged);
          setAuthSession(token, { ...(getStoredUser() || {}), ...updated }); 
          synced = true;
        }
      } catch {
        synced = false;
      }
    }

    if (!synced) {
      const localNext = { ...formData, ...payload, name: computedName };
      setFormData(localNext);
      setBaselineData(localNext);
      if (token) {
        setAuthSession(token, { ...(getStoredUser() || {}), ...localNext }); 
      }
    }

    setSaving(false);
    const msg = synced
      ? "Profile settings saved to server."
      : "Updated locally (connect PATCH /users/me or /users/:id on backend to persist).";
    setFeedback({ type: "success", message: msg });
    showToast("success", msg);
  };

  return (
    <div className="w-full px-5 sm:px-8 lg:px-10 py-8">
      <ProfileToast toast={toast} onClose={() => setToast(null)} />

      <form
        onSubmit={handleSave}
        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <ProfileHeaderCard
          formData={formData}
          jwtRole={jwtRole}
          isAdmin={isAdmin}
          loadingProfile={loadingProfile}
        />

        {feedback && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-800 text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-9">
          <PersonalInfoSection
            formData={formData}
            isAdmin={isAdmin}
            onChange={handleFieldChange}
          />
          <hr className="border-gray-200 dark:border-gray-800 my-2" />
          <AccountStatusSection
            formData={formData}
            isAdmin={isAdmin}
            onChange={handleFieldChange}
          />
        </div>

        <ProfileFormActions saving={saving} onReset={handleReset} />
      </form>
    </div>
  );
};

export default ProfileSettings;