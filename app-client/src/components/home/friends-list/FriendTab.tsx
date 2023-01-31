import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

function FriendTab({
  expandedByDefault,
  title,
  children,
  notifCount,
  className,
}: {
  expandedByDefault: boolean;
  title: string;
  children: ReactNode;
  className?: string;
  notifCount?: number;
}) {
  const [expanded, setExpanded] = useState(expandedByDefault);
  if (!notifCount) notifCount = 0;

  return (
    <div className={className}>
      <div
        className={
          "flex items-center select-none cursor-pointer mx-4 mt-2 px-2 py-1 bg-black"
        }
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
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
          {notifCount > 0 && (
            <p className="bg-blue-500 px-1.5 rounded-full text-sm">
              {notifCount}
            </p>
          )}
        </div>
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
