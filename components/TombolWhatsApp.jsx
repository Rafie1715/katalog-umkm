import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk, jumlah = 1, disabled = false }) {
  if (!produk) return null;

  const validJumlah =
    typeof jumlah === "number" && Number.isInteger(jumlah) && jumlah >= 1 && jumlah <= 999
      ? jumlah
      : 1;

  const hargaSatuan = formatRupiah(produk.harga);
  const totalHarga = formatRupiah(produk.harga * validJumlah);

  const pesan = `Halo, saya ingin memesan ${produk.nama}. Harga satuan: ${hargaSatuan}. Jumlah: ${validJumlah}. Total: ${totalHarga}.`;
  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  const iconWhatsApp = (
    <svg
      className="h-5 w-5 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.74 0.965 1.2 0.664.591 1.224.774 1.397.86.173.086.274.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
    </svg>
  );

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex min-h-[48px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-utama px-6 py-3.5 text-base font-bold text-white opacity-50 shadow-xs sm:w-auto"
      >
        {iconWhatsApp}
        <span>Pesan via WhatsApp</span>
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-utama px-6 py-3.5 text-base font-bold text-white shadow-xs transition-all duration-150 hover:bg-utama-gelap hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
    >
      {iconWhatsApp}
      <span>Pesan via WhatsApp</span>
    </a>
  );
}
