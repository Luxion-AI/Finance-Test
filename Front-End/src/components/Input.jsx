import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  ...rest
}) => {
  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && (
        <label className="text-text-secondary text-sm font-semibold mb-1.5 text-left">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`bg-input-bg border border-border rounded-lg px-4 py-2.5 text-text w-full input-glow transition-all duration-200 shadow-sm
            ${Icon ? 'pl-12' : 'pl-4'}
            ${RightIcon ? 'pr-12' : 'pr-4'}
            ${error ? 'border-danger/80 focus:border-danger/80 focus:ring-danger/20' : 'focus:border-primary'}
          `}
          {...rest}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label="Tampilkan atau sembunyikan password"
            className="absolute right-3 text-text-muted hover:text-text p-1 transition-colors"
          >
            <RightIcon className="h-5 w-5" />
          </button>
        )}
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
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-left">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
