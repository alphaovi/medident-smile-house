import { useState } from "react";
import { Link } from "react-router";
import { EyeIcon, LockIcon, MailIcon } from "../Shared/AuthIcons";
import { AUTH_PRIMARY_BTN_STYLE } from "../Shared/AuthCardLayout";

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  remember,
  setRemember,
  loading,
  onSubmit,
  onSwitchToRecovery,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          style={AUTH_PRIMARY_BTN_STYLE}
          className="w-[190px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </div>
    </form>
  );
};