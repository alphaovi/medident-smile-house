import { useState } from "react";
import CapitalHeader from "./CapitalHeader";
import ShareholderCard from "./ShareHolderCard";
import AddCapitalModal from "./AddCapitalModal";

const StructureOfShareHolders = () => {
  const [totalCapital, setTotalCapital] = useState(200000);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ৫ জন শেয়ারহোল্ডারের ডেমো ডেটা
  const [shareholders, setShareholders] = useState([
    { id: 1, name: "Rahim Ahmed", percent: 40 },
    { id: 2, name: "Tanvir Hossain", percent: 25 },
    { id: 3, name: "Nusrat Jahan", percent: 15 },
    { id: 4, name: "Sajid Hasan", percent: 12 },
    { id: 5, name: "Arian Kabir", percent: 8 },
  ]);

  // শেয়ারহোল্ডারের ম্যানুয়াল পারসেন্ট চেঞ্জ লজিক
  const handleUpdatePercent = (id, newPercent) => {
    setShareholders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, percent: Number(newPercent) } : item))
    );
  };

  // শেয়ার ট্রান্সফার এর মাধ্যমে নতুন শেয়ারহোল্ডার অ্যাড লজিক
  const handleAddShareholder = ({ sellerId, buyerName, percent }) => {
    setShareholders((prev) => {
      const updatedList = prev
        .map((s) => {
          if (s.id === sellerId) {
            // সেলারের শেয়ার কমানো হলো
            return { ...s, percent: s.percent - percent };
          }
          return s;
        })
        // যদি সেলারের শেয়ার ০ হয়ে যায় তবে তাকে লিস্ট থেকে রিমুভ করে দেওয়া যাবে (ঐচ্ছিক)
        .filter((s) => s.percent > 0);

      // নতুন ক্রেতাকে লিস্টে যোগ করা হলো
      return [...updatedList, { id: Date.now(), name: buyerName, percent }];
    });
  };

  const handleDeleteShareholder = (id) => {
    setShareholders((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPercentage = shareholders.reduce((sum, item) => sum + Number(item.percent || 0), 0);
  const calculatedTotalAmount = (totalCapital * totalPercentage) / 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* ১. টোটাল ক্যাপিটাল হেডার (200k) */}
      <CapitalHeader
        totalCapital={totalCapital}
        setTotalCapital={setTotalCapital}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* ২. ভিজ্যুয়াল ডিস্ট্রিবিউশন প্রোগ্রেস বার */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Allocation Summary</span>
          <span className={totalPercentage > 100 ? "text-rose-500 font-bold" : "text-slate-700"}>
            {totalPercentage}% / 100%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {shareholders.map((person, idx) => {
            const colors = [
              "bg-slate-900",
              "bg-indigo-600",
              "bg-sky-500",
              "bg-emerald-500",
              "bg-amber-500",
              "bg-purple-500",
              "bg-rose-500",
            ];
            return (
              <div
                key={person.id}
                style={{ width: `${person.percent}%` }}
                className={`h-full ${colors[idx % colors.length]} transition-all duration-300`}
              />
            );
          })}
        </div>
      </div>

      {/* ৩. মডার্ন লিস্ট উইজেট */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center px-1 pb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Shareholder</span>
          <div className="flex gap-8 items-center">
            <span>Share %</span>
            <span>Value (BDT)</span>
            <span></span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {shareholders.map((person) => (
            <ShareholderCard
              key={person.id}
              person={person}
              totalCapital={totalCapital}
              onUpdatePercent={handleUpdatePercent}
              onDelete={handleDeleteShareholder}
            />
          ))}
        </div>

        {/* ফুটার মোট হিসেব */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-500">Total Capital Value</span>
          <span className="text-sm font-black text-slate-900">
            ৳{calculatedTotalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ৪. শেয়ার ট্রান্সফার মোডাল */}
      <AddCapitalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddShareholder}
        shareholders={shareholders}
        totalCapital={totalCapital}
      />
    </div>
  );
};

export default StructureOfShareHolders;