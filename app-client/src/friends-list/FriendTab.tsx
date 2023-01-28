import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

function FriendTab({
  expandedByDefault,
  title,
  children,
}: {
  expandedByDefault: boolean;
  title: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(expandedByDefault);

  return (
    <div>
      <div
        className="flex items-center gap-2 select-none cursor-pointer mx-4 mt-2 px-2 py-1 bg-black"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <AnimatePresence>
            <motion.div
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.1 }}
            >
              <FiChevronDown className="text-lg" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ rotate: 90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.1 }}
          >
            <FiChevronRight className="text-lg" />
          </motion.div>
        )}
        <p className="font-semibold text-lg">{title}</p>
      </div>
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default FriendTab;
