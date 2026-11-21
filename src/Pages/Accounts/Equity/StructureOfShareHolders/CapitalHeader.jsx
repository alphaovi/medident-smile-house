const CapitalHeader = ({ totalCapital, setTotalCapital, onOpenModal }) => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex justify-between items-center gap-4">
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
          Total Capital
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xl font-medium text-slate-400">৳</span>
          <input
            type="number"
            value={totalCapital}
            onChange={(e) => setTotalCapital(Number(e.target.value) || 0)}
            className="text-2xl font-black bg-transparent focus:outline-none w-40 border-b border-dashed border-slate-700 focus:border-white transition-colors"
          />
        </div>
      </div>

      <button
        onClick={onOpenModal}
        className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
      >
        + Add / Transfer Share
      </button>
    </div>
  );
};

export default CapitalHeader;