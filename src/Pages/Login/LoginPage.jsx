import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { apiRequest, setAuthSession } from "../../services/auth/api";

const MailIcon = () => (
  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.85 21.85 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export const LoginPage = ({
  onSuccess,
  onSwitchToCreateAccount,
  onSwitchToRecovery,
}) => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      let res = await login?.(email.trim(), password);

      if (!res) {
        res = await apiRequest("/users/login", {
          method: "POST",
          body: JSON.stringify({ email: email.trim(), password }),
        });
      }

      const payload = res?.data ?? res;
      const token = payload?.token || res?.token || null;
      const loggedInUser = payload?.user || res?.user || null;

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
    <div
      className="-m-5 min-h-[calc(100vh-4rem)] w-[calc(100%+2.5rem)] flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 20% 15%, #22e1f0 0%, #0b7ad8 52%, #0635ad 100%)",
      }}
    >
      <div
        className="w-full max-w-[460px] bg-white rounded-[4px] px-10 py-10"
        style={{
          boxShadow: "0 24px 60px rgba(4, 24, 78, 0.28)",
        }}
      >
        <h2
          className="text-center text-[24px] font-bold tracking-[0.06em] uppercase mb-7"
          style={{ color: "#1588d8" }}
        >
          SIGN IN
        </h2>

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

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded bg-rose-50 border border-rose-200 text-[12px] text-rose-600">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none">
              <MailIcon />
            </span>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[46px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13.5px] pl-10 pr-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            />
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[46px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13.5px] pl-10 pr-10 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password"
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 pb-2 text-[12.5px]">
            <label className="inline-flex items-center gap-2 text-[#8b95a5] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded-[2px] border-slate-300 accent-[#1588d8]"
              />
              <span>Remember</span>
            </label>

            <Link
              to="/forget"
              onClick={onSwitchToRecovery}
              className="text-[#1588d8] hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="pt-1 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-[190px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg, #0935a8 0%, #0ea5e9 100%)",
                boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
              }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </form>

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
    </div>
  );
};