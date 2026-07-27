import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle } from "lucide-react";

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Pilih...",
  icon: Icon,
  error,
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`flex flex-col w-full ${className}`} ref={ref}>
      {label && (
        <label className="text-text-secondary text-sm font-semibold mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={`w-full bg-input-bg border rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between gap-2 transition-all duration-200 shadow-sm cursor-pointer
            ${Icon ? "pl-12" : "pl-4"}
            ${error ? "border-danger/80" : "border-border"}
            ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary focus:border-primary"}
            ${open ? "border-primary ring-2 ring-primary/20" : ""}
            ${selected ? "text-text" : "text-text-muted"}
          `}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 z-[100] bg-surface border border-border rounded-xl shadow-xl overflow-hidden origin-top"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors hover:bg-surface-hover
                    ${opt.value === value ? "bg-primary/10 text-primary font-semibold" : "text-text"}
                  `}
                >
                  {opt.label}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-text-muted">
                  Tidak ada pilihan
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center text-danger text-xs mt-1.5"
          >
            <AlertCircle className="h-4 w-4 mr-1 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
