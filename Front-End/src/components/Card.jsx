import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  glow = null,
  hover = true,
  animated = true,
  ...props
}) => {
  const glowClasses = {
    primary: "glow-primary",
    success: "glow-success",
    danger: "glow-danger",
    warning: "glow-warning",
  };

  const glowStyle = glow ? glowClasses[glow] : "";

  const cardContent = (
    <div
      className={`premium-panel bg-surface border border-border rounded-2xl p-6 shadow-sm transition-shadow duration-300 ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileTap={{ scale: 0.98 }}
        whileHover={
          hover
            ? { y: -3, boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.12)" }
            : {}
        }
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default Card;
