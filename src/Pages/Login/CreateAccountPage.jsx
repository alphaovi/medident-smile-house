import { useState } from "react";
import { Link } from "react-router";

const LockIcon = ({ active = false }) => (
  <svg
    className={`w-4 h-4 ${active ? "text-[#1588d8]" : "text-slate-400"}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = ({ open, highlight = false }) =>
  open ? (
    <svg
      className={`w-4 h-4 ${highlight ? "text-[#1588d8]" : "text-slate-400"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.85 21.85 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      className={`w-4 h-4 ${highlight ? "text-[#1588d8]" : "text-slate-400"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export const CreateAccountPage = ({ onSuccess, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service & Privacy Policy");
      return;
    }

    const rawBase =
      import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1";
    const baseUrl = String(rawBase).replace(/\/+$/, "");
    const registerUrl = `${baseUrl}/users/register`;

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const payload = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        clientOrigin: window.location.origin,
      };

      const response = await fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok || resData?.success === false) {
        throw new Error(
          resData?.message || `Server error (${response.status})`,
        );
      }

      const result = resData?.data ?? resData;
      if (result?.token && result?.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      setSuccessMsg(
        result?.message ||
          resData?.message ||
          "Account created! Verification link sent to your email. Account remains pending until admin assigns your role.",
      );
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      onSuccess?.(result);
    } catch (err) {
      setError(err?.message || "Failed to create account");
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
        className="w-full max-w-[460px] bg-white rounded-[4px] px-10 py-9"
        style={{
          boxShadow: "0 24px 60px rgba(4, 24, 78, 0.28)",
        }}
      >
        <h2
          className="text-center text-[24px] font-bold tracking-[0.06em] uppercase mb-6"
          style={{ color: "#1588d8" }}
        >
          SIGN UP
        </h2>

        {error && (
          <div className="mb-4 px-3.5 py-2 rounded bg-rose-50 border border-rose-200 text-[12px] text-rose-600">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] px-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
          />

          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] px-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] px-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] px-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
          />

          <p className="text-[11px] text-center text-[#9ca3af] leading-[1.45] pt-1">
            Account remains pending until admin approval &amp; role assignment.
            <br />
            Your password is 6-20 characters, includes one letter and one number
          </p>

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
              className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] pl-10 pr-10 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password"
              className="absolute right-3.5 hover:opacity-80 transition"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 pointer-events-none">
              <LockIcon active />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] pl-10 pr-10 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label="Toggle confirm password"
              className="absolute right-3.5 hover:opacity-80 transition"
            >
              <EyeIcon open={showConfirm} highlight />
            </button>
          </div>

          <div className="pt-1">
            <label className="inline-flex items-center gap-2 text-[11.5px] text-[#9ca3af] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-3.5 h-3.5 rounded-[2px] accent-[#1588d8]"
              />
              <span>
                I agree to the{" "}
                <span className="text-[#1588d8] hover:underline">
                  Terms of Service
                </span>{" "}
                &amp;{" "}
                <span className="text-[#1588d8] hover:underline">
                  Privacy Policy
                </span>
              </span>
            </label>
          </div>

          <div className="pt-3 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-[220px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg, #0935a8 0%, #0ea5e9 100%)",
                boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
              }}
            >
              {loading ? "CREATING..." : "CREATE AN ACCOUNT"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[12.5px] text-[#9ca3af]">
          Already have an account?{" "}
          <Link
            to="/login"
            onClick={onSwitchToLogin}
            className="text-[#1588d8] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
