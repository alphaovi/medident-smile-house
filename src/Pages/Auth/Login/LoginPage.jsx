import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import { setAuthSession } from "../../../services/auth/api";
import { AuthCardLayout } from "../Shared/AuthCardLayout";
import { AuthAlerts } from "../Shared/AuthAlerts";
import { LoginForm } from "./LoginForm";

export const LoginPage = ({
  onSuccess,
  onSwitchToCreateAccount,
  onSwitchToRecovery,
}) => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      const payload = res?.data ?? res;
      const token = payload?.token || payload?.accessToken || res?.token || null;
      const loggedInUser = payload?.user || res?.user || (payload?.email ? payload : null);

      if (token || loggedInUser) {
        setAuthSession(token, loggedInUser);
      }

      if (remember) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setSuccessMsg("Signed in successfully!");
      onSuccess?.(payload);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardLayout title="SIGN IN">
      <div className="mt-5">
        {user && (
          <div className="mb-4 px-3.5 py-2 rounded bg-sky-50 border border-sky-100 text-[12px] text-slate-600 flex items-center justify-between">
            <span className="truncate pr-2">
              Active: <strong className="text-slate-800">{user.name}</strong> ({user.email})
            </span>
            <button
              type="button"
              onClick={logout}
              className="text-rose-600 font-semibold hover:underline shrink-0"
            >
              Logout
            </button>
          </div>
        )}

        <AuthAlerts error={error} successMsg={successMsg} />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          remember={remember}
          setRemember={setRemember}
          loading={loading}
          onSubmit={handleSubmit}
          onSwitchToRecovery={onSwitchToRecovery}
        />

        <p className="mt-7 text-center text-[12.5px] text-[#9ca3af]">
          New member?{" "}
          <Link
            to="/create-login-account"
            onClick={onSwitchToCreateAccount}
            className="text-[#1588d8] hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthCardLayout>
  );
};