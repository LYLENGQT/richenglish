export function CalendarLegend({ config }) {
  return (
    <div className="space-y-3">
      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded ${value.colorClass}`} />
          <div>
            <p className="font-medium text-slate-900">{value.label}</p>
            {/* {value.redirectUrl && (
              <p className="text-xs text-slate-500">
                Redirects to: {value.redirectUrl}
              </p>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
}
