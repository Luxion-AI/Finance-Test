
const Skeleton = ({ className = '', count = 1, height = 'h-4' }) => {
  const widths = ['w-full', 'w-[90%]', 'w-[75%]', 'w-[85%]', 'w-[60%]'];

  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, idx) => {
        // Vary the width of subsequent lines to make it look like a text paragraph
        const widthClass = count > 1 ? widths[idx % widths.length] : 'w-full';
        
        return (
          <div
            key={idx}
            className={`skeleton ${height} ${widthClass} ${className}`}
          />
        );
      })}
    </div>
  );
};

export default Skeleton;
