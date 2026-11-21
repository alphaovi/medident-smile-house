import { useState } from "react";

const AddCapitalModal = ({ isOpen, onClose, onAdd, shareholders, totalCapital }) => {
  const [sellerId, setSellerId] = useState("");
  const [newBuyerName, setNewBuyerName] = useState("");
  const [transferPercent, setTransferPercent] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // সিলেক্ট করা সেলারের অবজেক্ট
  const selectedSeller = shareholders.find((s) => s.id === Number(sellerId));
  const sellerMaxPercent = selectedSeller ? selectedSeller.percent : 0;
  const sellerCurrentAmount = (totalCapital * sellerMaxPercent) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const percentNum = Number(transferPercent);

    if (!sellerId) {
      setError("শেয়ার প্রদানকারী (Seller) সিলেক্ট করুন");
      return;
    }

    if (percentNum <= 0) {
      setError("পারসেন্ট ০ এর বেশি হতে হবে");
      return;
    }

    if (percentNum > sellerMaxPercent) {
      setError(`সেলার এর কাছে ${sellerMaxPercent}% এর বেশি শেয়ার নেই!`);
      return;
    }

    // অল গুড, ডেটা প্যারেন্টে পাঠানো
    onAdd({
      sellerId: Number(sellerId),
      buyerName: newBuyerName,
      percent: percentNum,
    });

    // ফর্ম রিসেট
    setSellerId("");
    setNewBuyerName("");
    setTransferPercent("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Transfer / Sell Share</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* ১. সেলার সিলেক্ট ড্রপডাউন */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Select Share Seller (কার থেকে শেয়ার কিনবে) *
            </label>
            <select
              value={sellerId}
              onChange={(e) => {
                setSellerId(e.target.value);
                setError("");
              }}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-800"
              required
            >
              <option value="">-- Choose Seller --</option>
              {shareholders.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.percent}%)
                </option>
              ))}
            </select>
          </div>

          {/* সেলারের বর্তমান শেয়ারের তথ্য (প্রিভিউ) */}
          {selectedSeller && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Seller Available Share:</span>
                <strong className="text-slate-800">{sellerMaxPercent}%</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Seller Current Value:</span>
                <strong className="text-emerald-600">৳{sellerCurrentAmount.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* ২. নতুন শেয়ারহোল্ডারের নাম */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              New Shareholder Name *
            </label>
            <input
              type="text"
              required
              value={newBuyerName}
              onChange={(e) => setNewBuyerName(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-800"
              placeholder="e.g. Shakib Al Hasan"
            />
          </div>

          {/* ৩. কত পারসেন্ট শেয়ার বিক্রি করবে */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Share Percent to Sell (%) *
            </label>
            <input
              type="number"
              required
              max={sellerMaxPercent}
              value={transferPercent}
              onChange={(e) => {
                setTransferPercent(e.target.value);
                setError("");
              }}
              className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-800"
              placeholder={`Max ${sellerMaxPercent}%`}
            />
          </div>

          {/* ভ্যালিডেশন এরর মেসেজ */}
          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-md"
            >
              Transfer & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCapitalModal;