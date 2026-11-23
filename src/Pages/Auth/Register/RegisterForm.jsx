import { useState } from "react";
import { EyeIcon, LockIcon } from "../Shared/AuthIcons";
import { AUTH_PRIMARY_BTN_STYLE } from "../Shared/AuthCardLayout";

const INPUT_CLASS =
  "w-full h-[42px] bg-[#f3f4f6] text-slate-700 placeholder-[#9ca3af] text-[13px] px-4 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-sky-400/70 transition";

export const RegisterForm = ({ form, onChange, loading, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="First name"
        value={form.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
        required
        className={INPUT_CLASS}
      />
      <input
        type="text"
        placeholder="Last name"
        value={form.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
        required
        className={INPUT_CLASS}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
        className={INPUT_CLASS}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        className={INPUT_CLASS}
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
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
          className={`${INPUT_CLASS} pl-10 pr-10`}
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
          value={form.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          required
          className={`${INPUT_CLASS} pl-10 pr-10`}
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

      <label className="pt-1 inline-flex items-center gap-2 text-[11.5px] text-[#9ca3af] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => onChange("agreed", e.target.checked)}
          className="w-3.5 h-3.5 rounded-[2px] accent-[#1588d8]"
        />
        <span>
          I agree to the <span className="text-[#1588d8] hover:underline">Terms of Service</span> &amp;{" "}
          <span className="text-[#1588d8] hover:underline">Privacy Policy</span>
        </span>
      </label>

      <div className="pt-3 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          style={AUTH_PRIMARY_BTN_STYLE}
          className="w-[220px] h-[42px] rounded-full text-white text-[11.5px] font-bold tracking-[0.08em] uppercase transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? "CREATING..." : "CREATE AN ACCOUNT"}
        </button>
      </div>
    </form>
  );
};