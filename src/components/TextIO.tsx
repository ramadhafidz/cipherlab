import { useState, useRef } from "react";
import type { CSSProperties } from "react";
import type { CipherMode } from "../hooks/useCipher";

interface TextIOProps {
  mode: CipherMode;
  inputText: string;
  outputText: string;
  error: string | null;
  livePreviewEnabled: boolean;
  onInputChange: (text: string) => void;
  onConvert: () => void;
  onSwap: () => void;
  onReset: () => void;
  onToggleLivePreview: (enabled: boolean) => void;
  onChangeCipher?: () => void;
}

/**
 * Komponen dua textarea berdampingan (atau bertumpuk di mobile):
 * kiri untuk input, kanan untuk output hasil konversi.
 * Dilengkapi tombol Konversi, Salin, Swap, dan Reset.
 */
export function TextIO({
  mode,
  inputText,
  outputText,
  error,
  livePreviewEnabled,
  onInputChange,
  onConvert,
  onSwap,
  onReset,
  onToggleLivePreview,
  onChangeCipher,
}: TextIOProps) {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Salin output ke clipboard
  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback diam-diam jika browser tidak mendukung clipboard API
    }
  };

  // Download hasil sebagai file .txt
  const handleDownload = () => {
    if (!outputText) return;
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cipherlab-result-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Impor teks dari file .txt
  const handleImportText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        onInputChange(text);
      }
    };
    reader.readAsText(file);
    // Reset nilai input agar bisa mengunggah file yang sama lagi jika perlu
    event.target.value = "";
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: "160px",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-base)",
    padding: "var(--space-4)",
    color: "var(--text-primary)",
    fontFamily: "'JetBrains Mono', 'Share Tech Mono', monospace",
    fontSize: "var(--text-base)",
    lineHeight: "var(--leading-code)",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "var(--text-xs)",
    letterSpacing: "var(--tracking-wider)",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "var(--space-2)",
    fontFamily: "Rajdhani, sans-serif",
  };

  const inputLabel = mode === "encrypt" ? "Plaintext" : "Ciphertext";
  const outputLabel = mode === "encrypt" ? "Ciphertext" : "Plaintext";

  return (
    <div>
        {/* Bagian Atas: Tombol Upload/Impor */}
      <div style={{ marginBottom: "var(--space-4)", display: "flex", justifyContent: "flex-start" }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "var(--accent-glow)",
            color: "var(--text-primary)",
            border: "1px dashed var(--accent)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(58, 213, 123, 0.25)";
            e.currentTarget.style.borderStyle = "solid";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent-glow)";
            e.currentTarget.style.borderStyle = "dashed";
          }}
        >
          <span>[↑] Impor File Teks (.txt)</span>
        </button>
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          style={{ display: "none" }}
          onClick={(e) => {
            // Reset value so selecting the same file works
            (e.target as HTMLInputElement).value = "";
          }}
          onChange={handleImportText}
        />
      </div>

      {/* Area dua textarea berdampingan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
        }}
        className="text-io-grid"
      >
        {/* Textarea input (plaintext atau ciphertext) */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-2)" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>{inputLabel}</label>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Ketik ${inputLabel.toLowerCase()} di sini...`}
            style={textareaStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--border-active)";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px var(--accent-glow), inset 0 0 10px rgba(58, 213, 123, 0.05)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Textarea output (read-only) */}
        <div>
          <label style={{ ...labelStyle, height: "18px" }}>{outputLabel}</label>
          <textarea
            readOnly
            value={outputText}
            placeholder={`Hasil ${outputLabel.toLowerCase()} akan muncul di sini...`}
            style={{
              ...textareaStyle,
              background: outputText
                ? "var(--bg-elevated)"
                : "var(--bg-surface)",
              color: outputText ? "var(--text-accent)" : "var(--text-muted)",
              boxShadow: outputText
                ? "0 0 20px var(--accent-glow), inset 0 0 10px rgba(58, 213, 123, 0.1)"
                : "none",
              borderColor: outputText ? "var(--accent-dim)" : "var(--border)",
              cursor: "default",
            }}
          />
        </div>
      </div>

      {/* Pesan error inline */}
      {error && (
        <p
          style={{
            marginTop: "var(--space-3)",
            fontSize: "var(--text-sm)",
            color: "var(--error)",
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          <span style={{ color: "var(--error)", fontWeight: "bold" }}>[ERROR]</span> {error}
        </p>
      )}

      {/* Baris tombol aksi */}
      <div
        style={{
          marginTop: "var(--space-4)",
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
        }}
      >
        {/* Tombol Konversi (utama) */}
        <button
          onClick={onConvert}
          style={{
            padding: "var(--space-3) var(--space-6)",
            background: "var(--accent)",
            color: "var(--bg-base)",
            border: "1px solid var(--accent)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: "0 0 10px var(--accent-glow)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "var(--bg-base)";
            e.currentTarget.style.boxShadow = "0 0 15px var(--accent-glow-strong)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.color = "var(--bg-base)";
            e.currentTarget.style.boxShadow = "0 0 10px var(--accent-glow)";
          }}
        >
          {mode === "encrypt" ? "▶ Enkripsi" : "▶ Dekripsi"}
        </button>

        {/* Toggle live preview */}
        <button
          onClick={() => onToggleLivePreview(!livePreviewEnabled)}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: livePreviewEnabled ? "rgba(58,213,123,0.14)" : "transparent",
            color: livePreviewEnabled ? "var(--accent)" : "var(--text-secondary)",
            border: livePreviewEnabled
              ? "1px solid var(--accent)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
            boxShadow: livePreviewEnabled ? "inset 0 0 10px var(--accent-glow)" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = livePreviewEnabled
              ? "rgba(58,213,123,0.25)"
              : "var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = livePreviewEnabled
              ? "rgba(58,213,123,0.14)"
              : "transparent";
          }}
        >
          {livePreviewEnabled ? "Live: On" : "Live: Off"}
        </button>

        {/* Tombol Salin Hasil */}
        <button
          onClick={handleCopy}
          disabled={!outputText}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: outputText ? "var(--accent)" : "var(--text-muted)",
            border: outputText
              ? "1px solid var(--accent-dim)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: outputText ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (outputText)
              e.currentTarget.style.background = "var(--accent-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {copied ? "[✓] Tersalin" : "[C] Salin"}
        </button>

        {/* Tombol Swap — tukar input ↔ output dan balik mode */}
        <button
          onClick={onSwap}
          disabled={!outputText}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: outputText ? "var(--text-primary)" : "var(--text-muted)",
            border: outputText
              ? "1px solid var(--text-muted)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: outputText ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (outputText)
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          [⇄] Balik
        </button>

        {/* Tombol Download Hasil */}
        <button
          onClick={handleDownload}
          disabled={!outputText}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: outputText ? "var(--text-primary)" : "var(--text-muted)",
            border: outputText
              ? "1px solid var(--text-muted)"
              : "1px solid var(--border)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: outputText ? "pointer" : "not-allowed",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (outputText)
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          [↓] Ekspor
        </button>

        {/* Tombol Ubah Metode — kembali ke selector cipher */}
        {onChangeCipher && (
          <button
            onClick={onChangeCipher}
            style={{
              padding: "var(--space-3) var(--space-5)",
              background: "transparent",
              color: "var(--warning)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-base)",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              fontSize: "var(--text-base)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
              marginLeft: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--warning)";
              e.currentTarget.style.background = "rgba(224, 168, 74, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            [⟳] Ubah Metode
          </button>
        )}

        {/* Tombol Reset — bersihkan semua teks dan parameter */}
        <button
          onClick={onReset}
          style={{
            padding: "var(--space-3) var(--space-5)",
            background: "transparent",
            color: "var(--error)",
            border: "1px dashed var(--error)",
            borderRadius: "var(--radius-base)",
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            letterSpacing: "var(--tracking-wide)",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.15s ease, opacity 0.15s ease",
            opacity: 0.7,
            marginLeft: onChangeCipher ? "0" : "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.background = "rgba(255, 51, 51, 0.1)";
            e.currentTarget.style.borderStyle = "solid";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderStyle = "dashed";
          }}
        >
          [X] Reset
        </button>
      </div>
    </div>
  );
}
