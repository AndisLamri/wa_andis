/**
 * index.js — WhatsApp AI Bot (Versi Anti-Crash Total)
 * Menghindari SEMUA panggilan getChat() / sendStateTyping() yang memicu error "r: r"
 */

require('dotenv').config();
const http = require('node:http');
const KNOWLEDGE_BASE = require('./knowledgeBase');

const { Client, LocalAuth } = require('whatsapp-web.js');
const Groq = require('groq-sdk');
const qrcode = require('qrcode-terminal');

// ==== INISIALISASI ====
const waClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wa_session'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  }
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = 'openai/gpt-oss-120b';

// ==== STATUS SISTEM ====
let isReady = false;
const pausedUsers = new Set();
const conversationHistory = new Map();
const MAX_HISTORY_LENGTH = 5;

const healthServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  res.writeHead(404);
  res.end();
});

healthServer.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('[HTTP] Health check aktif');
});

// ==== FUNGSI BANTUAN ====
function updateHistory(phoneNumber, role, content) {
  const history = conversationHistory.get(phoneNumber) || [];
  history.push({ role, content });
  conversationHistory.set(phoneNumber, history.slice(-MAX_HISTORY_LENGTH * 2));
}

function getCurrentTimeWIB() {
  return new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function buildSystemPrompt() {
  const waktuSekarang = getCurrentTimeWIB();
  return `Anda adalah asisten WiFi MoraRepublic yang cerdas ramah dan membantu.

📅 Waktu Sistem: ${waktuSekarang}

--- DATA INFORMASI BISNIS ---
Katalog WiFi:
${KNOWLEDGE_BASE.katalog_wifi}

Cara Berlangganan:
${KNOWLEDGE_BASE.cara_berlangganan}

Formulir Pendaftaran:
${KNOWLEDGE_BASE.form_pendaftaran}

Cara Pembayaran:
${KNOWLEDGE_BASE.cara_pembayaran}

Pemasangan & Aktivasi:
${KNOWLEDGE_BASE.instalasi_aktivasi}

Bantuan Teknis Awal:
${KNOWLEDGE_BASE.bantuan_layanan}

Syarat & Ketentuan:
${KNOWLEDGE_BASE.syarat_ketentuan}

FAQ:
${KNOWLEDGE_BASE.qa_list}

Info Umum:
${KNOWLEDGE_BASE.info_umum}

--- ATURAN TANGGAPAN ---

PRIORITAS 1 — KELUHAN/GANGGUAN:
Jika pelanggan mengeluh internet lambat, putus, mati, atau kendala teknis → berikan empati, sarankan langkah perbaikan mandiri, lalu arahkan: "Silakan hubungi CS kami di: 0877-5367-2942 untuk penanganan lebih lanjut." JANGAN menawarkan produk.

PRIORITAS 2 — MINAT BERLANGGANAN:
Jika ingin daftar/pasang baru → jelaskan paket lalu arahkan: "Untuk pendaftaran silakan hubungi nomor: 0888-0891-1199 Terima kasih atas minat Anda!"

PRIORITAS 3 — INFO BISNIS:
Untuk harga, paket, pembayaran, cakupan jaringan, kebijakan, jadwal, kontak, dan informasi khusus MoraRepublic/MyRepublic, gunakan hanya data bisnis di atas. Jangan menambah, mengubah, atau menebak informasi yang tidak tercantum.

PRIORITAS 4 — PERTANYAAN DI LUAR DATA:
Untuk pertanyaan umum di luar data bisnis, gunakan pengetahuan umum yang sudah mapan hanya jika Anda yakin jawabannya benar. Jawab langsung, relevan, dan jangan menyajikan dugaan sebagai fakta.
Jika jawabannya tidak diketahui, meragukan, membutuhkan informasi terkini, atau bergantung pada kondisi/lokasi pengguna, katakan dengan jujur bahwa informasinya belum dapat dipastikan dan jangan mengarang.
Untuk informasi bisnis yang tidak tercantum atau belum dapat dipastikan, jelaskan bahwa data tersebut belum tersedia dan arahkan pelanggan untuk konfirmasi ke CS di 0877-5367-2942. Jangan gunakan pengetahuan umum untuk menebak kebijakan atau kondisi layanan perusahaan.
Jika pertanyaan kurang jelas, ajukan pertanyaan singkat untuk memperoleh konteks yang diperlukan.
Jangan paksa jualan jika tidak relevan.

--- GAYA BAHASA ---
• Bahasa Indonesia sopan & akrab
• Emoji secukupnya
• Langsung ke inti
`;
}

async function tanyaGroq(nomorPengirim, pesanPengguna) {
  try {
    updateHistory(nomorPengirim, 'user', pesanPengguna);
    const daftarPesan = [
      { role: 'system', content: buildSystemPrompt() },
      ...(conversationHistory.get(nomorPengirim) || [])
    ];
    const respons = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: daftarPesan,
      temperature: 0.7,
      max_tokens: 1024
    });
    const jawaban = respons.choices[0]?.message?.content || 'Maaf, sistem sedang sibuk. Coba lagi sebentar.';
    updateHistory(nomorPengirim, 'assistant', jawaban);
    return jawaban;
  } catch (err) {
    console.error('[GROQ ERROR]', err.message);
    return 'Maaf, sedang ada gangguan. Silakan coba lagi.';
  }
}

// ==== EVENT: QR CODE ====
waClient.on('qr', (qrcodeData) => {
  console.log('\n========================================');
  console.log('  SILAKAN SCAN QR CODE DI BAWAH INI');
  console.log('  Gunakan menu "Perangkat Tertaut" di WhatsApp');
  console.log('========================================\n');
  qrcode.generate(qrcodeData, { small: true });
});

// ==== EVENT: SIAP BEROPERASI ====
waClient.on('ready', () => {
  isReady = true;
  console.log('\n✅ BOT SIAP BEROPERASI — WhatsApp terhubung!');
  console.log(`🕒 Waktu mulai: ${getCurrentTimeWIB()}`);
  console.log('--------------------------------------------------');
});

// ==== EVENT: PESAN DIBACA (JEDA OTOMATIS) ====
waClient.on('message_ack', (pesan, status) => {
  if (status === 3 && pesan.from && !pesan.fromMe) {
    pausedUsers.add(pesan.from);
    console.log(`⏸️ [JEDA] ${pesan.from} — Dibaca manusia`);
  }
});

// ==== EVENT: PESAN MASUK — TANPA PANGGILAN getChat() SAMA SEKALI ====
waClient.on('message', async (msg) => {
  try {
    // ------ LEWATI JIKA BELUM SIAP / DARI DIRI SENDIRI ------
    if (!isReady || msg.fromMe) return;

    // ------ LEWATI PESAN GRUP — Cek langsung dari ID tanpa panggil fungsi ------
    if (msg.from.endsWith('@g.us')) return;

    // ------ HANYA PROSES PESAN TEKS ------
    if (msg.type !== 'chat' || !msg.body) return;

    const nomorPengirim = msg.from;
    const teksPesan = msg.body.trim();
    if (!teksPesan) return;

    // ------ KELOLA STATUS JEDA ------
    if (pausedUsers.has(nomorPengirim)) {
      pausedUsers.delete(nomorPengirim);
      console.log(`▶️ [LANJUT] ${nomorPengirim} — Pesan baru, AI aktif kembali`);
      return; // Aktifkan kembali tanpa balas pesan pemicu
    }

    // ------ SIMULASI MENGETIK — TANPA panggil sendStateTyping() ------
    // Tunda alami 1–2 detik sebagai pengganti efek mengetik
    await new Promise(r => setTimeout(r, 1000 + Math.floor(Math.random() * 1000)));

    if (pausedUsers.has(nomorPengirim)) return;

    // ------ PANGGIL AI & KIRIM BALASAN ------
    const jawaban = await tanyaGroq(nomorPengirim, teksPesan);
    await msg.reply(jawaban);

    console.log(`✅ [${nomorPengirim}] Balasan terkirim (${jawaban.length} karakter)`);

  } catch (err) {
    console.error('[PEMROSESAN GAGAL]', err.message || err);
  }
});

// ==== MULAIKAN ====
waClient.initialize().catch(err => {
  console.error('[INISIALISASI GAGAL]', err);
  process.exit(1);
});