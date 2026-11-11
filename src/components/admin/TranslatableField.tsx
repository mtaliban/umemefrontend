'use client';

interface TranslatableFieldProps {
  label: string;
  enValue: string;
  swValue: string;
  onEnChange: (v: string) => void;
  onSwChange: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
  error?: string;
}

export default function TranslatableField({
  label,
  enValue,
  swValue,
  onEnChange,
  onSwChange,
  multiline = false,
  required = false,
  error,
}: TranslatableFieldProps) {
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {/* English */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            EN
          </label>
          {multiline ? (
            <textarea
              value={enValue}
              onChange={(e) => onEnChange(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={enValue}
              onChange={(e) => onEnChange(e.target.value)}
              className={inputClass}
            />
          )}
        </div>

        {/* Kiswahili */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            SW
          </label>
          {multiline ? (
            <textarea
              value={swValue}
              onChange={(e) => onSwChange(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={swValue}
              onChange={(e) => onSwChange(e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
