import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const rawBase =
  import.meta.env.VITE_Test_API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5002/api/v1";
const API_BASE_URL = String(rawBase).replace(/\/+$/, "");

export const VerifyAccountPage = ({ onGoToLogin }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users/verify-account?token=${encodeURIComponent(token)}`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Verification failed");
        }
        setStatus("success");
        setMessage(data?.data?.message || data?.message || "Email verified successfully!");
        navigate("/", {replace: true});
      } catch (err) {
        setStatus("error");
        setMessage(err?.message || "Invalid or expired verification link.");
      }
    };

    verify();
  }, []);

  const handleLoginClick = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      navigate("/login");
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
        className="w-full max-w-[460px] bg-white rounded-[4px] px-10 py-10 text-center"
        style={{ boxShadow: "0 24px 60px rgba(4, 24, 78, 0.28)" }}
      >
        <h2
          className="text-[22px] font-bold tracking-[0.06em] uppercase mb-4"
          style={{ color: "#1588d8" }}
        >
          EMAIL VERIFICATION
        </h2>

        <div
          className={`px-4 py-3 rounded text-[13px] mb-6 ${
            status === "loading"
              ? "bg-sky-50 text-sky-700 border border-sky-200"
              : status === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-600 border border-rose-200"
          }`}
        >
          {message}
        </div>

        <Link
          to="/login"
          onClick={handleLoginClick}
          className="inline-flex items-center justify-center w-[190px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105"
          style={{
            background: "linear-gradient(90deg, #0935a8 0%, #0ea5e9 100%)",
            boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
          }}
        >
          GO TO SIGN IN
        </Link>
      </div>
    </div>
  );
};