import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LiabilitySearchHeader from "./LiabilitySearchHeader";
import LiabilityTable from "./LiabilityTable";
import LiabilitySummary from "./LiabilitySummary";
import { dummyLiabilities } from "../../../../services/liabilityData";

const CreatePaidLiability = () => {
  // Source default empty রাখা হয়েছে যাতে শুরুতে সব ডেটা দেখায়
  const [headName, setHeadName] = useState("");
  const [subHeadName, setSubHeadName] = useState("");
  const [sourceName, setSourceName] = useState("");

  const [liabilities, setLiabilities] = useState([]);
  const [filteredLiabilities, setFilteredLiabilities] = useState([]);
  const [selectedLiabilities, setSelectedLiabilities] = useState([]);
  const [payingAmounts, setPayingAmounts] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [otherMfsName, setOtherMfsName] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  // Load Initial Dummy Data
  useEffect(() => {
    setLiabilities(dummyLiabilities);
    setFilteredLiabilities(dummyLiabilities);
  }, []);

  // Updated Dynamic Filter Logic
  useEffect(() => {
    let result = liabilities;

    // 1. Head Select করলে ওই Head অনুযায়ী ফিল্টার হবে
    if (headName.trim() !== "") {
      result = result.filter(
        (item) => item.head.toLowerCase() === headName.toLowerCase()
      );
    }

    // 2. Sub Head Select করলে ওই Sub Head অনুযায়ী ফিল্টার হবে
    if (subHeadName.trim() !== "") {
      result = result.filter(
        (item) => item.subHead.toLowerCase() === subHeadName.toLowerCase()
      );
    }

    // 3. Source (Service/Supplier/Cash/Bank) Select করলে নির্দিষ্ট Source অনুযায়ী ফিল্টার হবে
    if (sourceName.trim() !== "") {
      result = result.filter(
        (item) => item.source.toLowerCase() === sourceName.toLowerCase()
      );
    }

    setFilteredLiabilities(result);
  }, [headName, subHeadName, sourceName, liabilities]);

  const handleSelectHead = (head) => {
    setHeadName(head);
    setSubHeadName(""); // Head পাল্টালে Sub Head রিসেট হবে
  };

  const handleSelectSubHead = (subHead) => {
    setSubHeadName(subHead);
  };

  const handleSelectSource = (source) => {
    setSourceName(source);
  };

  const handleResetFilters = () => {
    setHeadName("");
    setSubHeadName("");
    setSourceName("");
  };

  const handleSelectAll = () => {
    if (selectedLiabilities.length === filteredLiabilities.length) {
      setSelectedLiabilities([]);
    } else {
      setSelectedLiabilities(filteredLiabilities.map((item) => item.id));
    }
  };

  const handleSelectLiability = (id) => {
    if (selectedLiabilities.includes(id)) {
      setSelectedLiabilities(selectedLiabilities.filter((item) => item !== id));
    } else {
      setSelectedLiabilities([...selectedLiabilities, id]);
    }
  };

  const handleAmountChange = (id, val) => {
    setPayingAmounts((prev) => ({
      ...prev,
      [id]: Number(val),
    }));
  };

  const totalAmount = selectedLiabilities.reduce((sum, id) => {
    const item = liabilities.find((l) => l.id === id);
    const customAmount = payingAmounts[id];
    return sum + (customAmount !== undefined ? customAmount : item ? item.amount : 0);
  }, 0);

  const handleSubmit = () => {
    if (selectedLiabilities.length === 0) {
      toast.warn("Please select at least one liability entry!");
      return;
    }

    const selectedMethodName =
      paymentMethod === "Other MFS"
        ? `Other MFS (${otherMfsName || "Not specified"})`
        : paymentMethod;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to pay ৳${totalAmount} via ${selectedMethodName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Confirm Payment",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Paid!",
          text: "Liability payment recorded successfully.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        toast.success("Liability payment recorded successfully!");
        setSelectedLiabilities([]);
        setPayingAmounts({});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.error("Payment submission cancelled!");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <LiabilitySearchHeader
        headName={headName}
        setHeadName={setHeadName}
        subHeadName={subHeadName}
        setSubHeadName={setSubHeadName}
        sourceName={sourceName}
        setSourceName={setSourceName}
        onSelectHead={handleSelectHead}
        onSelectSubHead={handleSelectSubHead}
        onSelectSource={handleSelectSource}
        onReset={handleResetFilters}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <LiabilityTable
          liabilities={filteredLiabilities}
          selectedLiabilities={selectedLiabilities}
          payingAmounts={payingAmounts}
          onSelectAll={handleSelectAll}
          onSelectLiability={handleSelectLiability}
          onAmountChange={handleAmountChange}
        />

        <LiabilitySummary
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          otherMfsName={otherMfsName}
          setOtherMfsName={setOtherMfsName}
          onFileChange={(e) => setReceiptFile(e.target.files[0])}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreatePaidLiability;