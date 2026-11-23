import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PaymentSearchHeader from "./PaymentSearchHeader";
import PaymentTable from "./PaymentTable";
import PaymentSummary from "./PaymentSummary";
import { useCreatePayment } from "../../../services/createPayment/useCreatePayment";

const CreatePayment = () => {
  const {
    customersList,
    statesList,
    selectedState,
    clientName,
    setClientName,
    address,
    cases,
    selectedCases,
    totalAmount,
    usersList,
    selectedOwnerId,
    userAccounts,
    selectedBankId,
    setSelectedBankId,
    note,
    setNote,
    receiptFile,
    setReceiptFile,
    submitting,
    maxPayableAmount,
    handleSelectState,
    handleSelectCustomer,
    handleSelectAll,
    handleSelectCase,
    handleTotalAmountChange,
    handleSelectOwner,
    handleSubmit,
  } = useCreatePayment();

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <PaymentSearchHeader
        selectedState={selectedState}
        onSelectState={handleSelectState}
        statesList={statesList}
        clientName={clientName}
        setClientName={setClientName}
        address={address}
        customersList={customersList}
        onSelectCustomer={handleSelectCustomer}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <PaymentTable
          cases={cases}
          selectedCases={selectedCases}
          onSelectAll={handleSelectAll}
          onSelectCase={handleSelectCase}
        />

        <PaymentSummary
          totalAmount={totalAmount}
          onTotalAmountChange={handleTotalAmountChange}
          maxPayableAmount={maxPayableAmount}
          usersList={usersList}
          selectedOwnerId={selectedOwnerId}
          onSelectOwner={handleSelectOwner}
          userAccounts={userAccounts}
          selectedBankId={selectedBankId}
          setSelectedBankId={setSelectedBankId}
          note={note}
          setNote={setNote}
          receiptFile={receiptFile}
          onFileChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default CreatePayment;