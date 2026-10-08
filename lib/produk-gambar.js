/**
 * Metadata dan pemetaan aset gambar produk.
 * Digunakan bersama oleh katalog, halaman detail, hero showcase, dan tabel admin.
 *
 * Aturan:
 * - foto_url dari database tetap menjadi acuan utama.
 * - Pemetaan hanya berlaku untuk path bawaan awal (.svg).
 * - URL foto asli yang dimasukkan admin diprioritaskan dan tidak boleh ditimpa.
 * - Penanda "isIlustrasi" disimpan di metadata lokal tanpa menambah kolom database.
 */

export const PEMETAAN_ASET_BAWAAN = {
  "/produk/kopi.svg": {
    id: 1,
    nama: "Kopi Bubuk Robusta 250 g",
    pathLama: "/produk/kopi.svg",
    pathBaru: "/produk/kopi-robusta.webp",
    altDefault: "Kopi bubuk robusta dalam kemasan polos dengan taburan biji kopi sangrai",
    isIlustrasi: true,
    deskripsiVisual: "Bubuk kopi robusta, biji kopi sangrai sebagai properti, dan kemasan polos.",
  },
  "/produk/keripik.svg": {
    id: 2,
    nama: "Keripik Singkong Balado",
    pathLama: "/produk/keripik.svg",
    pathBaru: "/produk/keripik-balado.webp",
    altDefault: "Keripik singkong balado renyah berbumbu merah dalam mangkuk",
    isIlustrasi: true,
    deskripsiVisual: "Irisan singkong renyah berbumbu balado merah dalam mangkuk sederhana.",
  },
  "/produk/sambal.svg": {
    id: 3,
    nama: "Sambal Bawang Botol 150 ml",
    pathLama: "/produk/sambal.svg",
    pathBaru: "/produk/sambal-bawang.webp",
    altDefault: "Sambal bawang merah dalam toples kaca bening dengan cabai dan bawang",
    isIlustrasi: true,
    deskripsiVisual: "Toples kaca bening berisi sambal bawang berminyak dengan cabai dan bawang.",
  },
  "/produk/nastar.svg": {
    id: 4,
    nama: "Kue Nastar Toples 500 g",
    pathLama: "/produk/nastar.svg",
    pathBaru: "/produk/kue-nastar.webp",
    altDefault: "Kue nastar keemasan dengan satu kue dibelah memperlihatkan selai nanas",
    isIlustrasi: true,
    deskripsiVisual: "Kue nastar keemasan dan toples, dengan satu kue dibelah memperlihatkan isian selai nanas.",
  },
  "/produk/tas.svg": {
    id: 5,
    nama: "Tas Anyaman Pandan",
    pathLama: "/produk/tas.svg",
    pathBaru: "/produk/tas-pandan.webp",
    altDefault: "Tas anyaman pandan alami berdiri tegak dengan serat anyaman detail",
    isIlustrasi: true,
    deskripsiVisual: "Tas anyaman pandan sebagai objek utama, detail serat jelas, dan latar bersih.",
  },
  "/produk/batik.svg": {
    id: 6,
    nama: "Kain Batik Cap 2 m",
    pathLama: "/produk/batik.svg",
    pathBaru: "/produk/kain-batik.webp",
    altDefault: "Kain batik cap terlipat rapi dengan bentangan pola motif parang",
    isIlustrasi: true,
    deskripsiVisual: "Kain batik terlipat dengan sebagian bentangan motif parang agar tekstur dan pola terlihat.",
  },
};

/**
 * Daftar path aset lokal siap pakai untuk dimasukkan admin melalui form produk.
 */
export const DAFTAR_ASET_TERSEDIA = Object.values(PEMETAAN_ASET_BAWAAN).map((item) => ({
  path: item.pathBaru,
  nama: item.nama,
  deskripsi: item.deskripsiVisual,
  isIlustrasi: item.isIlustrasi,
}));

/**
 * Resolver bersama untuk mendapatkan sumber dan metadata foto produk.
 *
 * @param {string | null | undefined} fotoUrl - URL/path dari database atau form
 * @returns {{
 *   src: string | null,
 *   isFallback: boolean,
 *   isIlustrasi: boolean,
 *   altDefault: string,
 *   deskripsiVisual: string
 * }}
 */
export function resolveFotoProduk(fotoUrl) {
  if (!fotoUrl || typeof fotoUrl !== "string" || !fotoUrl.trim()) {
    return {
      src: null,
      isFallback: true,
      isIlustrasi: false,
      altDefault: "Foto belum tersedia",
      deskripsiVisual: "Foto belum tersedia untuk produk ini.",
    };
  }

  const cleanUrl = fotoUrl.trim();

  // 1. Cek apakah cocok dengan path lama bawaan (.svg)
  if (PEMETAAN_ASET_BAWAAN[cleanUrl]) {
    const meta = PEMETAAN_ASET_BAWAAN[cleanUrl];
    return {
      src: meta.pathBaru,
      isFallback: false,
      isIlustrasi: meta.isIlustrasi,
      altDefault: meta.altDefault,
      deskripsiVisual: meta.deskripsiVisual,
    };
  }

  // 2. Cek apakah cocok dengan path baru yang terdaftar
  const foundByPathBaru = Object.values(PEMETAAN_ASET_BAWAAN).find(
    (meta) => meta.pathBaru === cleanUrl
  );
  if (foundByPathBaru) {
    return {
      src: cleanUrl,
      isFallback: false,
      isIlustrasi: foundByPathBaru.isIlustrasi,
      altDefault: foundByPathBaru.altDefault,
      deskripsiVisual: foundByPathBaru.deskripsiVisual,
    };
  }

  // 3. Foto asli/eksternal yang dimasukkan admin: prioritaskan tanpa penimpaan
  return {
    src: cleanUrl,
    isFallback: false,
    isIlustrasi: false,
    altDefault: "",
    deskripsiVisual: "Foto produk dari pemilik toko.",
  };
}

