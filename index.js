/**
 * index.js — WhatsApp AI Bot (Versi Anti-Crash Total)
 * Menghindari SEMUA panggilan getChat() / sendStateTyping() yang memicu error "r: r"
 */

require('dotenv').config();
const http = require('node:http');
const KNOWLEDGE_BASE = require('./knowledgeBase');

const Groq = require('groq-sdk');
const qrcode = require('qrcode-terminal');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = 'openai/gpt-oss-120b';

// ==== STATUS SISTEM ====
let isReady = false;
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

function extractTextMessage(message) {
  let content = message;
  while (content) {
    const text = content.conversation || content.extendedTextMessage?.text;
    if (text) return text;

    content = content.ephemeralMessage?.message
      || content.viewOnceMessage?.message
      || content.viewOnceMessageV2?.message
      || content.documentWithCaptionMessage?.message;
  }
  return '';
}

async function handleIncomingMessage(sock, message) {
  try {
    const nomorPengirim = message.key.remoteJid;
    if (!isReady || message.key.fromMe || !nomorPengirim) return;
    if (nomorPengirim.endsWith('@g.us') || nomorPengirim.endsWith('@broadcast')) return;

    const teksPesan = extractTextMessage(message.message).trim();
    if (!teksPesan) return;

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 1000)));
    const jawaban = await tanyaGroq(nomorPengirim, teksPesan);
    await sock.sendMessage(nomorPengirim, { text: jawaban }, { quoted: message });
    console.log(`✅ [${nomorPengirim}] Balasan terkirim (${jawaban.length} karakter)`);
  } catch (err) {
    console.error('[PEMROSESAN GAGAL]', err.message || err);
  }
}

async function startWhatsApp() {
  const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState
  } = await import('@whiskeysockets/baileys');
  const { state, saveCreds } = await useMultiFileAuthState('./.baileys_session');
  const sock = makeWASocket({
    auth: state,
    browser: ['wa_ai', 'Chrome', '1.0.0'],
    logger: require('pino')({ level: 'silent' }),
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n========================================');
      console.log('  SILAKAN SCAN QR CODE DI BAWAH INI');
      console.log('  Gunakan menu "Perangkat Tertaut" di WhatsApp');
      console.log('========================================\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      isReady = true;
      console.log('\nBOT SIAP BEROPERASI — WhatsApp terhubung!');
      console.log(`Waktu mulai: ${getCurrentTimeWIB()}`);
      console.log('--------------------------------------------------');
    }

    if (connection === 'close') {
      isReady = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        console.error('[WHATSAPP] Sesi keluar. Hapus .baileys_session lalu mulai ulang untuk mendapatkan QR baru.');
        return;
      }

      console.error(`[WHATSAPP] Koneksi terputus (${statusCode || 'tidak diketahui'}); mencoba menyambung kembali.`);
      setTimeout(() => {
        startWhatsApp().catch(err => {
          console.error('[INISIALISASI GAGAL]', err);
          process.exit(1);
        });

      }, 3000);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const message of messages) {
      await handleIncomingMessage(sock, message);
    }
  });
}

startWhatsApp().catch(err => {
  console.error('[INISIALISASI GAGAL]', err);
  process.exit(1);
});