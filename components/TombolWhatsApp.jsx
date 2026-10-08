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

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-utama opacity-50 px-5 py-3 font-semibold text-white sm:w-auto"
      >
        Pesan via WhatsApp
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
