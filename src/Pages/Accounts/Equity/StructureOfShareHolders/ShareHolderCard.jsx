const ShareholderCard = ({ person, totalCapital, onUpdatePercent, onDelete }) => {
  const calculatedAmount = (totalCapital * (person.percent || 0)) / 100;

  return (
    <div className="py-2.5 flex justify-between items-center text-xs group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
          {person.name.charAt(0)}
        </div>
        <span className="font-semibold text-slate-800">{person.name}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus-within:ring-1 focus-within:ring-slate-400">
          <input
            type="number"
            value={person.percent}
            onChange={(e) => onUpdatePercent(person.id, e.target.value)}
            className="w-10 text-center font-bold text-slate-900 bg-transparent focus:outline-none"
          />
          <span className="text-slate-400 text-[10px] font-bold">%</span>
        </div>

        <span className="w-24 text-right font-black text-slate-900">
          ৳{calculatedAmount.toLocaleString()}
        </span>

        <button
          onClick={() => onDelete(person.id)}
          className="text-slate-300 hover:text-rose-500 transition-colors px-1 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ShareholderCard;