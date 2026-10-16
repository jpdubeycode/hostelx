const StatCard = ({ icon: Icon, title, value, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        text-left
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-blue-200
        hover:bg-blue-50/20
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">
        {/* Content */}
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              transition-colors
              duration-200
              group-hover:bg-blue-100
            "
          >
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>
    </button>
  );
};

export default StatCard;