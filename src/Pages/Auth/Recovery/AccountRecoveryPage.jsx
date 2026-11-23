import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import { AUTH_PRIMARY_BTN_STYLE, AuthCardLayout } from "../Shared/AuthCardLayout";
import { AuthAlerts } from "../Shared/AuthAlerts";
import { MailIcon } from "../Shared/AuthIcons";

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
      setError(err?.message || "Failed to send recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="ACCOUNT RECOVERY"
      subtitle="Enter your e-mail address below to reset your password"
    >
      <AuthAlerts error={error} successMsg={successMsg} />

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
            style={AUTH_PRIMARY_BTN_STYLE}
            className="h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </AuthCardLayout>
  );
};