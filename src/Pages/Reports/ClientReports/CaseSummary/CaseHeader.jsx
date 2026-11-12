import { motion } from "framer-motion";

const CaseHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-slate-200 pb-4"
    >
      <h1 className="text-2xl font-light tracking-wide text-slate-900">
        Case Summary
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Filter, search and review doctor-wise or clinic-wise case summaries.
      </p>
    </motion.div>
  );
};
export default CaseHeader;
