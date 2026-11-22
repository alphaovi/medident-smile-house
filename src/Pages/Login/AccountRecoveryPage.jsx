import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { Link } from "react-router";

const MailIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const AccountRecoveryPage = ({ onBack }) => {
  const { recoverAccount } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await recoverAccount(email.trim());
      setSuccessMsg(
        res?.message ||
          "Account recovery instructions have been sent to your e-mail address."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send recovery email");
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
          className="text-center text-[24px] font-bold tracking-[0.06em] uppercase mb-2"
          style={{ color: "#1588d8" }}
        >
          ACCOUNT RECOVERY
        </h2>

        <p className="text-center text-[12.5px] text-[#9ca3af] mb-7">
          Enter your e-mail address below to reset your password
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4 pt-1">
            <Link
              to="/login"
              onClick={onBack}
              className="h-[42px] rounded-full bg-[#f3f4f6] hover:bg-slate-200 text-[#9ca3af] text-[11.5px] font-bold tracking-[0.08em] uppercase transition flex items-center justify-center"
            >
              BACK
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg, #0935a8 0%, #0ea5e9 100%)",
                boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
              }}
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};