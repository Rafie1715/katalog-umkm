# Dokumentasi Aset Gambar Produk

Dokumen ini mencatat standar visual, daftar aset yang tersedia, pemetaan path bawaan, status ilustrasi, dan panduan pengelolaan foto produk katalog UMKM **Toko Rafie**.

---

## 1. Standar Visual Foto Katalog

Seluruh gambar produk dibuat dengan arahan artistik yang konsisten untuk menciptakan etalase UMKM yang hangat, otentik, dan bernilai tinggi:

- **Pencahayaan**: Cahaya alami lembut dari samping (*soft natural side lighting*) dengan bayangan halus (*soft diffused shadows*).
- **Latar Belakang**: Latar krem lembut (*warm soft cream*) atau permukaan kayu alami terang yang selaras dengan palet tema token proyek.
- **Warna & Objek**: Warna alami, objek utama tajam, dan properti pendukung secukupnya yang relevan dengan produk lokal Indonesia.
- **Komposisi**: Rasio persegi 1:1 (1000 × 1000 px) dengan margin aman (*safe margins*) di sekeliling objek agar produk tidak terpotong saat ditampilkan pada kartu katalog maupun layar ponsel.
- **Kebersihan Visual**: Tanpa teks buatan, tanpa watermark, tanpa logo sintetis, dan tanpa kemasan bermerek luar.

---

## 2. Daftar Aset & Pemetaan Otomatis

Aset foto resolusi tinggi telah dioptimalkan dalam format **WebP** dengan dimensi 1000 × 1000 px dan ukuran berkas di bawah 150 KB (jauh di bawah batas 250 KB) untuk kecepatan pemuatan halaman maksimal.

| ID | Nama Produk | Path Bawaan Database | Path Aset Baru (WebP) | Ukuran Berkas | Status Aset | Deskripsi Visual & Properti |
|---|---|---|---|---|---|---|
| 1 | Kopi Bubuk Robusta 250 g | `/produk/kopi.svg` | `/produk/kopi-robusta.webp` | 47.2 KB | Gambar ilustrasi | Pouch kemasan kraft polos berdiri dengan taburan bubuk kopi robusta halus dan biji kopi sangrai di atas latar krem lembut. |
| 2 | Keripik Singkong Balado | `/produk/keripik.svg` | `/produk/keripik-balado.webp` | 130.1 KB | Gambar ilustrasi | Irisan singkong renyah berbalut bumbu balado merah dalam mangkuk keramik sederhana dengan aksen cabai merah segar. |
| 3 | Sambal Bawang Botol 150 ml | `/produk/sambal.svg` | `/produk/sambal-bawang.webp` | 103.4 KB | Gambar ilustrasi | Toples kaca bening berisi sambal bawang merah pedas berminyak dengan cabai rawit dan bawang merah utuh di sisinya. |
| 4 | Kue Nastar Toples 500 g | `/produk/nastar.svg` | `/produk/kue-nastar.webp` | 102.3 KB | Gambar ilustrasi | Tumpukan kue nastar bulat keemasan mengkilap dengan cengkih, toples kaca bersih, dan satu kue dibelah memperlihatkan selai nanas asli. |
| 5 | Tas Anyaman Pandan | `/produk/tas.svg` | `/produk/tas-pandan.webp` | 65.5 KB | Gambar ilustrasi | Tas jinjing anyaman serat daun pandan alami berdiri tegak, memperlihatkan tekstur anyaman rapi dengan margin aman penuh. |
| 6 | Kain Batik Cap 2 m | `/produk/batik.svg` | `/produk/kain-batik.webp` | 89.6 KB | Gambar ilustrasi | Kain katun batik cap terlipat rapi dengan bentangan pola motif parang tradisional Jawa bernuansa cokelat soga dan krem gading. |

---

## 3. Mekanisme Resolver (`lib/produk-gambar.js`)

Aplikasi menggunakan fungsi bersama `resolveFotoProduk(fotoUrl)` di sisi klien dan server:

1. **Pemetaan Transparan**: Jika database masih berisi path awal seperti `/produk/kopi.svg`, resolver otomatis mengarahkannya ke `/produk/kopi-robusta.webp` tanpa mengharuskan pembaruan paksa pada database.
2. **Prioritas Foto Asli Admin**: Jika pemilik toko menginput URL foto sendiri (baik URL eksternal `https://...` maupun path aset lokal kustom), URL tersebut langsung dipakai dan **tidak akan pernah ditimpa** oleh pencocokan nama atau kategori.
3. **Penanda Transparansi Konsumen**: Aset yang berstatus ilustrasi otomatis memunculkan lencana halus *"Gambar ilustrasi"* pada kartu katalog dan halaman detail untuk keterbukaan informasi konsumen. Foto asli yang dimasukkan admin tidak akan memiliki label ilustrasi.
4. **Pencegahan Galat & Fallback**: Jika `foto_url` kosong atau berkas gambar eksternal gagal dimuat (misalnya tautan rusak), komponen [components/FotoProduk.jsx](file:///c:/Users/user/Downloads/Ekraf%20CHAT/katalog-umkm/components/FotoProduk.jsx) secara aman menampilkan penampung *"Foto belum tersedia"* tanpa memicu perulangan galat (*error loop*) dan tanpa menyamarkannya dengan produk lain.

---

## 4. Panduan untuk Pemilik Toko / Admin

Pemilik toko dapat memperbarui foto produk kapan saja melalui antarmuka admin yang terlindungi login (`/admin`):

1. Buka menu **Produk** di halaman admin.
2. Klik tombol **Ubah** pada baris produk yang ingin diganti fotonya.
3. Pada kolom **Link foto**, pemilik toko dapat:
   - Mengklik salah satu tombol pintasan aset lokal yang disediakan di bawah kolom isian (misalnya `kopi-robusta.webp`).
   - Atau memasukkan URL foto asli produk hasil pemotretan sendiri (misalnya yang diunggah ke hosting gambar publik).
4. Klik **Simpan produk**. Perubahan langsung tersinkronisasi ke katalog dan halaman detail.

---

## 5. Asal Gambar & Lisensi

- Seluruh 6 aset visual WebP awal dibuat khusus sebagai ilustrasi katalog UMKM menggunakan generator gambar beresolusi tinggi (1024 × 1024 kemudian dioptimasi ke 1000 × 1000 WebP).
- Tidak menggunakan materi berhak cipta pihak ketiga atau foto bermerek dagang.
- Status hukum: Aset ilustrasi internal bebas royalti untuk etalase Toko Rafie.

