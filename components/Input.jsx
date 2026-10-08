export default function Input({
  label,
  name,
  type = "text",
  textarea = false,
  className = "",
  ...props
}) {
  const baseKelas =
    "w-full rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-base text-teks placeholder:text-teks-lembut/70 focus:border-utama focus:ring-2 focus:ring-utama/20 focus:outline-none transition-colors duration-150";

  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-teks">
      <span>{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className={`${baseKelas} min-h-[110px] resize-y ${className}`}
          {...props}
        />
      ) : (
        <input
          name={name}
          type={type}
          className={`${baseKelas} min-h-[44px] ${className}`}
          {...props}
        />
      )}
    </label>
  );
}
