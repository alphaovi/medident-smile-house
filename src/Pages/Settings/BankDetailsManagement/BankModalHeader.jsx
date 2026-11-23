const BankModalHeader = ({ isEditing, onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
    <div>
      <h3 className="text-lg font-bold tracking-tight">
        {isEditing ? "Update Bank Detail" : "Add New Bank Detail"}
      </h3>
      <p className="text-xs text-sky-100 mt-0.5">
        {isEditing
          ? "Modify bank account information and save changes."
          : "Enter bank account details for payment collection."}
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
      aria-label="Close modal"
    >
      ✕
    </button>
  </div>
);

export default BankModalHeader;