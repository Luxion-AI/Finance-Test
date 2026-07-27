const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6" role="status" aria-busy="true" aria-label="Memuat data dashboard">
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-border/70 p-8 sm:p-10">
        <div className="skeleton h-10 w-80 mb-3" />
        <div className="skeleton h-4 w-64 mb-4" />
        <div className="skeleton h-9 w-36 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border/70 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton h-9 w-9 rounded-xl" />
            </div>
            <div className="skeleton h-7 w-32 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border/70 rounded-2xl p-6">
        <div className="skeleton h-4 w-48 mb-1" />
        <div className="skeleton h-3 w-64 mb-6" />
        <div className="skeleton h-72 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border/70 rounded-2xl p-6">
            <div className="skeleton h-4 w-48 mb-1" />
            <div className="skeleton h-3 w-56 mb-4" />
            <div className="skeleton h-48 w-full" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border/70 rounded-2xl p-6">
        <div className="skeleton h-4 w-40 mb-1" />
        <div className="skeleton h-3 w-56 mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div>
                <div className="skeleton h-3.5 w-32 mb-1.5" />
                <div className="skeleton h-2.5 w-24" />
              </div>
            </div>
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
