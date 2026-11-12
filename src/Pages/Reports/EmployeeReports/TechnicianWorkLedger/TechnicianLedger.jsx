import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechnicianLedgerHeader from './TechnicianLedgerHeader';
import TechnicianLedgerProfileCard from './TechnicianProfileCard';
import TechnicianLedgerTable from './TechnicianLedgerTable';

const TechnicianLedger = () => {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/techniciansData.json')
      .then((res) => res.json())
      .then((data) => {
        setTechnicians(data);
        if (data.length > 0) {
          setSelectedTechnicianId(data[0].technicianId);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading technician data:', err);
        setLoading(false);
      });
  }, []);

  const selectedTechnician = technicians.find(
    (technician) => technician.technicianId === selectedTechnicianId
  );

  // Aggregating item quantities > 0
  const aggregatedItems = selectedTechnician?.scannedOrders
    ? selectedTechnician.scannedOrders.reduce((acc, order) => {
        Object.entries(order.items || {}).forEach(([itemName, qty]) => {
          if (qty > 0) {
            acc[itemName] = (acc[itemName] || 0) + qty;
          }
        });
        return acc;
      }, {})
    : {};

  const itemList = Object.entries(aggregatedItems).map(([name, quantity]) => ({
    name,
    quantity,
  }));

  // Total Quantity Calculation for all products
  const totalQuantity = itemList.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-medium bg-white">
        Loading Technician Ledger Data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-100 font-sans">
      <TechnicianLedgerHeader
        technicians={technicians}
        selectedTechnicianId={selectedTechnicianId}
        onSelectTechnician={setSelectedTechnicianId}
      />

      {selectedTechnician ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTechnician.technicianId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <TechnicianLedgerProfileCard technician={selectedTechnician} />
            <TechnicianLedgerTable itemList={itemList} totalQuantity={totalQuantity} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="p-8 text-center text-gray-400">
          No technician data available.
        </div>
      )}
    </div>
  );
};

export default TechnicianLedger;