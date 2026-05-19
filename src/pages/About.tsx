/**
 * Halaman About — penjelasan singkat tentang CipherLab
 * dan cara menggunakan aplikasi ini.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface CipherCard {
  name: string;
  era: string;
  type: string;
  desc: string;
}

const CIPHER_INFO: CipherCard[] = [
  {
    name: "Caesar Cipher",
    era: "~58 SM",
    type: "Substitusi Monoalfabetik",
    desc: "Dikaitkan dengan Julius Caesar. Menggeser setiap huruf dalam alfabet sejauh N posisi. Mudah dipecahkan dengan analisis frekuensi.",
  },
  {
    name: "Atbash Cipher",
    era: "~600 SM",
    type: "Substitusi Monoalfabetik",
    desc: "Berasal dari tradisi Ibrani kuno. Mencerminkan alfabet: A↔Z, B↔Y, dll. Digunakan dalam teks religius seperti Kitab Yeremia.",
  },
  {
    name: "ROT13",
    era: "~1980-an",
    type: "Substitusi Monoalfabetik",
    desc: "Varian Caesar dengan shift 13. Populer di forum internet awal untuk menyembunyikan spoiler. Enkripsi dan dekripsi adalah operasi yang sama.",
  },
  {
    name: "Vigenère Cipher",
    era: "1553",
    type: "Substitusi Polialfabetik",
    desc: "Dipublikasikan oleh Giovan Battista Bellaso, keliru dikaitkan ke Blaise de Vigenère. Menggunakan kata kunci berulang. Disebut \"le chiffre indéchiffrable\" selama berabad-abad.",
  },
  {
    name: "Rail Fence Cipher",
    era: "~abad 19",
    type: "Transposisi",
    desc: "Teknik transposisi zigzag. Teks ditulis bergelombang melintasi beberapa baris, lalu dibaca per baris. Digunakan di masa Perang Saudara Amerika.",
  },
  {
    name: "Playfair Cipher",
    era: "1854",
    type: "Substitusi Digraf",
    desc: "Diciptakan oleh Charles Wheatstone, dipopulerkan oleh Lord Playfair. Mengenkripsi pasangan huruf (digraf) menggunakan matriks 5×5. Digunakan oleh Inggris dalam Perang Dunia I dan II.",
  },
];

export function About() {
  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: 700,
    fontSize: "var(--text-xl)",
    letterSpacing: "var(--tracking-wide)",
    textTransform: "uppercase",
    color: "var(--text-accent)",
    margin: "0 0 var(--space-4) 0",
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "Rajdhani, sans-serif",
    fontSize: "var(--text-base)",
    color: "var(--text-secondary)",
    lineHeight: "var(--leading-normal)",
    margin: 0,
  };

  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-10)",
      }}
    >
      {/* Hero */}
      <div>
        <h1
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "var(--text-3xl)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            margin: "0 0 var(--space-3) 0",
            lineHeight: "var(--leading-tight)",
          }}
        >
          Tentang <span style={{ color: "var(--text-accent)" }}>CipherLab</span>
        </h1>
        <p style={{ ...bodyStyle, fontSize: "var(--text-lg)" }}>
          CipherLab adalah playground edukatif untuk bereksperimen dengan cipher-cipher klasik.
          Semua proses berjalan di browser (client-side) sehingga Anda dapat mencoba enkripsi
          dan dekripsi secara langsung tanpa perlu backend.
        </p>
      </div>

      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Apa itu CipherLab */}
      <section>
        <h2 style={sectionTitleStyle}>Apa Itu CipherLab?</h2>
        <p style={bodyStyle}>
          CipherLab dirancang sebagai alat pembelajaran interaktif untuk memahami prinsip dasar
          kriptografi klasik melalui contoh langsung. Pengguna dapat memilih metode, mengisi
          parameter (mis. kunci atau shift), lalu melihat hasil enkripsi/dekripsi secara real-time.
        </p>
      </section>

      {/* Cara Menggunakan */}
      <section>
        <h2 style={sectionTitleStyle}>Cara Menggunakan</h2>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            margin: 0,
            paddingLeft: 0,
            listStyle: "none",
          }}
        >
          {[
            "Pilih cipher dari daftar di halaman utama.",
            "Isi parameter yang diperlukan pada form (mis. shift, key).",
            "Pilih mode: Enkripsi atau Dekripsi.",
            "Ketik teks pada area input dan lihat hasil di output secara real-time.",
            "Gunakan tombol Salin untuk menyalin hasil ke clipboard.",
          ].map((step, idx) => (
            <li
              key={idx}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "var(--space-2) 0" }}
            >
              <FontAwesomeIcon
                icon={faCaretRight}
                aria-hidden={true}
                style={{ color: "var(--text-accent)", fontSize: "1rem", lineHeight: 1 }}
              />
              <p style={{ ...bodyStyle, margin: 0 }}>{step}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Cipher cards */}
      <section>
        <h2 style={sectionTitleStyle}>Cipher yang Tersedia di CipherLab</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {CIPHER_INFO.map((cipher) => (
            <div
              key={cipher.name}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-base)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {/* Header card */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "var(--text-base)",
                      letterSpacing: "var(--tracking-wide)",
                      textTransform: "uppercase",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {cipher.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {cipher.era}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "var(--tracking-wider)",
                    textTransform: "uppercase",
                    color: "var(--accent-dim)",
                    background: "var(--accent-glow)",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {cipher.type}
                </span>
              </div>

              {/* Deskripsi */}
              <p style={bodyStyle}>{cipher.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kelemahan */}
      <section>
        <h2 style={sectionTitleStyle}>Mengapa Cipher Klasik Tidak Aman?</h2>
        <p style={{ ...bodyStyle, marginBottom: "var(--space-4)" }}>
          Semua cipher klasik rentan terhadap teknik analisis modern:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[
            {
              label: "Analisis Frekuensi",
              desc: "Huruf dan kata dalam sebuah bahasa memiliki frekuensi kemunculan yang khas. Dengan menganalisis frekuensi simbol dalam ciphertext, penyerang dapat menebak pola enkripsi.",
            },
            {
              label: "Brute Force",
              desc: "Caesar Cipher hanya memiliki 25 kemungkinan shift — komputer modern dapat mencoba semuanya dalam hitungan milidetik.",
            },
            {
              label: "Known Plaintext Attack",
              desc: "Jika penyerang mengetahui sepasang plaintext-ciphertext, mereka dapat merekonstruksi kunci enkripsi.",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderLeft: "2px solid var(--accent-dim)",
                paddingLeft: "var(--space-4)",
              }}
            >
              <p
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: "0 0 var(--space-1) 0",
                }}
              >
                {item.label}
              </p>
              <p style={bodyStyle}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div
        style={{
          border: "1px solid var(--warning)",
          borderRadius: "var(--radius-base)",
          background: "rgba(224, 168, 74, 0.05)",
          padding: "var(--space-5)",
        }}
      >
        <p
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-sm)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            color: "var(--warning)",
            margin: "0 0 var(--space-2) 0",
          }}
        >
          ⚠ Perhatian
        </p>
        <p style={bodyStyle}>
          CipherLab adalah alat edukatif. Cipher klasik <strong style={{ color: "var(--text-primary)" }}>tidak aman</strong> untuk
          melindungi informasi sensitif di era modern. Untuk keamanan data nyata, gunakan
          enkripsi modern seperti AES-256 atau RSA.
        </p>
      </div>
    </div>
  );
}
