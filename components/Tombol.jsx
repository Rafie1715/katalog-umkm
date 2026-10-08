import Link from "next/link";

const gaya = {
  utama:
    "bg-utama text-white shadow-xs hover:bg-utama-gelap hover:shadow-sm active:bg-utama-gelap",
  garis:
    "border border-garis bg-latar text-teks hover:border-utama hover:bg-permukaan/60 hover:text-utama active:bg-permukaan",
  bahaya:
    "border border-garis bg-latar text-bahaya hover:border-bahaya hover:bg-red-50/60 active:bg-red-100/60",
};

export default function Tombol({
  href,
  varian = "utama",
  className = "",
  children,
  ...props
}) {
  const kelas = `inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none ${gaya[varian]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={kelas}>
        {children}
      </Link>
    );
  }

  return (
    <button className={kelas} {...props}>
      {children}
    </button>
  );
}
