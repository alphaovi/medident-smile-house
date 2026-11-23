export const AuthAlerts = ({ error, successMsg }) => (
  <>
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
  </>
);