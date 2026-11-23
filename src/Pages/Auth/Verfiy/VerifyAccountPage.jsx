import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import { AUTH_PRIMARY_BTN_STYLE, AuthCardLayout } from "../Shared/AuthCardLayout";

export const VerifyAccountPage = ({ onGoToLogin }) => {
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyAccount(token);
        setStatus("success");
        setMessage(res?.message || "Email verified successfully!");
        navigate("/", { replace: true });
      } catch (err) {
        setStatus("error");
        setMessage(err?.message || "Invalid or expired verification link.");
      }
    };

    verify();
  }, [verifyAccount, navigate]);

  const badgeStyle =
    status === "loading"
      ? "bg-sky-50 text-sky-700 border border-sky-200"
      : status === "success"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-rose-50 text-rose-600 border border-rose-200";

  return (
    <AuthCardLayout title="EMAIL VERIFICATION" className="text-center">
      <div className={`mt-3 px-4 py-3 rounded text-[13px] mb-6 ${badgeStyle}`}>
        {message}
      </div>

      <Link
        to="/login"
        onClick={() => (onGoToLogin ? onGoToLogin() : navigate("/login"))}
        style={AUTH_PRIMARY_BTN_STYLE}
        className="inline-flex items-center justify-center w-[190px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105"
      >
        GO TO SIGN IN
      </Link>
    </AuthCardLayout>
  );
};