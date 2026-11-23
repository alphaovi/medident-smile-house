export const AUTH_PRIMARY_BTN_STYLE = {
  background: "linear-gradient(90deg, #0935a8 0%, #0ea5e9 100%)",
  boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
};

export const AuthCardLayout = ({ title, subtitle, children, className = "" }) => (
  <div
    className="-m-5 min-h-[calc(100vh-4rem)] w-[calc(100%+2.5rem)] flex items-center justify-center p-6"
    style={{
      background:
        "radial-gradient(circle at 20% 15%, #22e1f0 0%, #0b7ad8 52%, #0635ad 100%)",
    }}
  >
    <div
      className={`w-full max-w-[460px] bg-white rounded-[4px] px-10 py-10 ${className}`}
      style={{ boxShadow: "0 24px 60px rgba(4, 24, 78, 0.28)" }}
    >
      <h2
        className="text-center text-[24px] font-bold tracking-[0.06em] uppercase mb-2"
        style={{ color: "#1588d8" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-center text-[12.5px] text-[#9ca3af] mb-7">{subtitle}</p>
      )}
      {children}
    </div>
  </div>
);