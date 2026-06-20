// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n";

export function PageTransition({ children, pageKey }) {
  const lang = useLang();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey + lang}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
