import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  title,
  description,
  icon: Icon,
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 py-12 border border-dashed border-border rounded-2xl bg-surface/30 hover:bg-surface/50 transition-colors"
    >
      <div className="p-4 bg-surface rounded-full text-text-muted mb-4 shadow-sm border border-border">
        {Icon ? <Icon className="h-10 w-10" /> : <Inbox className="h-10 w-10" />}
      </div>
      
      <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
//
