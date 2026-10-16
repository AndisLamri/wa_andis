/**
 * knowledgeBase.js
 * SUMBER DATA TUNGGAL & TERPUSAT untuk seluruh informasi bisnis
 * PERINGATAN: JANGAN menulis logika kode atau fungsi di berkas ini
 */

module.exports = {
  // Daftar paket layanan WiFi
  katalog_wifi: `
✨ KATALOG PAKET MYREPUBLIC ✨

PAKET BULANAN:
- 10 Mbps: Rp116.550
- 20 Mbps: Rp127.650
- 30 Mbps: Rp138.750
- 50 Mbps: Rp150.000
- 50 Mbps: Rp166.500
- 75 Mbps: Rp205.350
- 100 Mbps: Rp233.100
- 150 Mbps: Rp277.500
- 300 Mbps: Rp333.000
- 500 Mbps: Rp555.000
- 750 Mbps: Rp721.500
- 1 Gbps: Rp943.500

PROGRAM UPGRADE KECEPATAN:
- Neo: hingga 200 Mbps.
- Velo: dari 150 Mbps menjadi 300 Mbps.
- Nexus: hingga 400 Mbps.

BIAYA ADMIN (BULAN PERTAMA):
- Kontrak 18 bulan: Rp8.323
- Kontrak 24 bulan: Rp11.100
- Kontrak 36 bulan: Rp16.650

Keterangan:
- Harga termasuk PPN 11%.
- Kecepatan simetris (kecepatan upload sama dengan download).
`,

  // Alur pendaftaran
  cara_berlangganan: `
📝 ALUR MULAI BERLANGGANAN:
1. Kirimkan alamat rumah yang ingin dipasangi layanan melalui WhatsApp. Jangan kirim lokasi terkini.
2. Kami akan memeriksa ketersediaan jaringan di lokasi tersebut.
3. Jika lokasi terjangkau, proses registrasi akan dilanjutkan.
4. Lengkapi dan validasi data diri, lalu pilih paket.
5. Lakukan pembayaran sesuai metode resmi dan simpan bukti pembayaran.
6. Setelah pembayaran terkonfirmasi, jadwal pemasangan akan ditentukan.
7. Teknisi akan memasang dan mengaktifkan layanan dalam sekitar 1–2 hari kerja.
`,

  // Format data diri yang diperlukan
  form_pendaftaran: `
📋 SILAKAN KIRIMKAN DATA BERIKUT:
• Nama Lengkap:
• No. KTP/NIK:
• Alamat Lengkap Pemasangan:
• Kecamatan / Kelurahan:
• No. Telepon/WhatsApp Aktif:
• Paket yang Dipilih:
• Foto rumah tampak depan:
• Foto meteran listrik (kWh):
• Foto nomor rumah (jika ada):
`,

  // Metode pembayaran resmi
  cara_pembayaran: `
💳 PANDUAN PEMBAYARAN TAGIHAN MYREPUBLIC

1. MOBILE BANKING DAN APLIKASI (VIRTUAL ACCOUNT)
- m-BCA: Pilih m-Transfer -> BCA Virtual Account, lalu masukkan 1005200 + ID pelanggan.
- wondr by BNI / BNI Mobile: Pilih Transfer -> Virtual Account, lalu masukkan nomor VA BNI MyRepublic Anda.
- Livin' by Mandiri: Pilih Bayar -> TV Berlangganan/Internet, pilih MyRepublic Retail atau masukkan kode instansi 99000, lalu masukkan ID pelanggan.
- BRImo: Pilih BRIVA, lalu masukkan nomor BRIVA MyRepublic Anda.
- BSI Mobile dan bank lain: Pilih Pembayaran -> Internet/TV Kabel, lalu pilih MyRepublic Retail.

2. E-WALLET DAN QRIS
- DANA: Pilih Tagihan -> Internet & TV Kabel -> MyRepublic, lalu masukkan ID pelanggan.
- OVO: Pilih Internet & TV Kabel -> MyRepublic, lalu masukkan ID pelanggan. Jika ID diawali huruf C, masukkan tanpa huruf tersebut.
- QRIS (GoPay, ShopeePay, LinkAja, dan lainnya): Buka area pelanggan di aplikasi MyRepublic atau situs resmi MyRepublic, pilih pembayaran QRIS, lalu pindai kode QR yang ditampilkan.

3. E-COMMERCE / MARKETPLACE
- Tokopedia: Pilih Top-Up & Tagihan -> TV Kabel & Internet -> MyRepublic, masukkan ID pelanggan, lalu selesaikan pembayaran.
- Shopee: Pilih Pulsa, Tagihan & Tiket -> TV Kabel & Internet -> MyRepublic, lalu masukkan ID pelanggan.

4. MINIMARKET (TUNAI / DEBIT)
- Indomaret, Alfamart, Alfamidi, atau Lawson: Sampaikan kepada kasir bahwa Anda ingin membayar tagihan Internet MyRepublic.
- Sebutkan ID pelanggan, periksa nama dan nominal tagihan, lalu lakukan pembayaran.
- Simpan struk pembayaran.

5. MELALUI MESIN ATM
- ATM BCA: Pilih Transaksi Lainnya -> BCA Virtual Account, lalu masukkan 1005200 + ID pelanggan.
- ATM Mandiri: Pilih Bayar/Beli -> Lainnya -> TV Berlangganan/Internet, lalu masukkan kode perusahaan 5011900 atau 99000, diikuti ID pelanggan.

PENTING:
- Bayar sebelum tanggal jatuh tempo untuk menghindari denda keterlambatan atau isolasi jaringan.
- Pembayaran melalui VA atau aplikasi yang terintegrasi diproses otomatis. Untuk metode lain, simpan bukti pembayaran.
- Jangan membayar tunai melalui teknisi/sales atau mentransfer pembayaran ke rekening pribadi.
- Pastikan nama penyedia dan nominal tagihan sesuai sebelum mengonfirmasi pembayaran.
`,

  // Informasi pemasangan & aktivasi
  instalasi_aktivasi: `
🔧 INFORMASI PEMASANGAN & AKTIVASI:
• Biaya pemasangan gratis untuk pelanggan yang berlangganan minimal 12 bulan.
• Jadwal teknisi: Senin–Sabtu, pukul 09.00–18.00 WIB
`,

  // Bantuan sebelum lapor ke CS
  bantuan_layanan: `
🛠️ BANTUAN TEKNIS AWAL:
Jika internet lambat atau putus-nyambung:
1. Jika indikator LOSS berwarna merah, buka aplikasi MyRepublic dan hubungi layanan melalui WhatsApp atau telepon (CALL) untuk meminta ID tiket laporan.
2. Kirimkan ID tiket laporan kepada admin di 0888-0891-1199 untuk memeriksa progres penanganan.
3. Jika masalah berlanjut, hubungi CS. Jangan menghapus aplikasi MyRepublic.

🔐 CARA MENGGANTI KATA SANDI WiFi:
1. Hubungkan ponsel atau komputer ke jaringan WiFi atau gunakan kabel LAN.
2. Buka browser dan akses alamat panel admin yang tertera pada label modem/router atau panduan perangkat.
   Jika alamatnya tidak diketahui, periksa alamat gateway/router di pengaturan jaringan perangkat.
3. Login menggunakan akun administrator yang tertera pada label modem/router atau diberikan oleh penyedia layanan.
   Kombinasi login berbeda untuk setiap perangkat. Jangan menebak kata sandi atau mengubah pengaturan lain.
4. Buka menu Network -> WLAN/WiFi -> Security atau pengaturan keamanan jaringan.
5. Cari kolom WiFi Password, WPA Pre-Shared Key, WPA Key, atau nama serupa.
6. Masukkan kata sandi baru yang kuat, lalu pilih Apply atau Save.
7. Setelah koneksi WiFi terputus, hubungkan kembali perangkat menggunakan kata sandi baru.
Jika alamat panel atau akun administrator tidak diketahui, hubungi CS untuk panduan sesuai perangkat.
`,

  // Aturan berlangganan
  syarat_ketentuan: `
📜 SYARAT & KETENTUAN:
• Masa kontrak minimal: 12 bulan.
• Tidak ada FUP.
• Pembayaran dilakukan di awal bulan.
• Pemutusan sementara dapat diajukan maksimal 1 bulan per tahun.
• Pindah alamat dikenakan biaya administrasi Rp275.000.
`,

  // Pertanyaan yang sering muncul
  qa_list: `
❓ PERTANYAAN UMUM:

T: Apakah ada batasan kuota?
J: Tidak ada FUP.

T: Bisa dipasang di luar kota?
J: Bisa, tetapi perlu diperiksa terlebih dahulu apakah lokasi terjangkau jaringan kami.

T: Bagaimana jika pindah rumah?
J: Layanan dapat dipindahkan jika lokasi baru terjangkau jaringan MyRepublic. Biaya administrasi pindah alamat Rp275.000.

T: Bisa berhenti kapan saja?
J: Penghentian layanan mengikuti masa kontrak minimal 12 bulan. Hubungi CS untuk informasi prosedurnya.
`,

  // Info umum kantor & wilayah
  info_umum: `
🏢 INFORMASI UMUM:
• Jam operasional: Senin–Sabtu, pukul 08.00–17.00 WIB.
• Alamat kantor: Jl. Raya Pajajaran, Bogor.
• Wilayah jangkauan: Cibinong, Citeureup, Sukaraja, dan sekitarnya.
• Kontak registrasi dan laporan tiket (bukan CS): 0851-5665-8082.
• Kontak CS untuk keluhan teknis dan gangguan layanan: 0877-5367-2942.
• Gunakan aplikasi MyRepublic untuk memeriksa status layanan, melaporkan gangguan, dan melihat informasi tagihan.
`
};