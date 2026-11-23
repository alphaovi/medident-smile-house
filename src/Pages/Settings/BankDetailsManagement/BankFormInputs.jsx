const FIELD_CLASS =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

const BankFormInputs = ({ formData, isCashAccount, onChange }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Account Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="bankName"
          required
          value={formData.bankName}
          onChange={onChange}
          placeholder="e.g. Dutch-Bangla Bank PLC / Cash"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Account Number {!isCashAccount && <span className="text-rose-500">*</span>}
        </label>
        <input
          type="text"
          name="accountNo"
          required={!isCashAccount}
          value={formData.accountNo}
          onChange={onChange}
          placeholder={isCashAccount ? "Optional for Cash" : "e.g. 123.101.456789"}
          className={`${FIELD_CLASS} font-mono`}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Account Holder <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="accountName"
          required
          value={formData.accountName}
          onChange={onChange}
          placeholder="e.g. Sohel Chawdhory"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
        <input
          type="text"
          name="branch"
          value={formData.branch}
          onChange={onChange}
          placeholder="e.g. Mirpur-10 Branch"
          className={FIELD_CLASS}
        />
      </div>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Additional Details / Routing Info
      </label>
      <textarea
        name="details"
        rows={3}
        value={formData.details}
        onChange={onChange}
        placeholder="Routing number, SWIFT code, or special instructions..."
        className={FIELD_CLASS}
      />
    </div>

    <label className="inline-flex items-center gap-2 pt-1 cursor-pointer select-none">
      <input
        type="checkbox"
        name="isActive"
        checked={formData.isActive}
        onChange={onChange}
        className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
      />
      <span className="text-sm font-medium text-slate-700">Active Account</span>
    </label>
  </>
);

export default BankFormInputs;