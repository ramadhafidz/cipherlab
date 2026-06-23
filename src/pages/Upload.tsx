import { useState, useRef } from "react";
import { useCipher } from "../hooks/useCipher";
import { CipherSelector } from "../components/CipherSelector";
import { CipherForm } from "../components/CipherForm";

export function Upload() {
  const {
    ciphers,
    selectedCipher,
    mode,
    params,
    selectCipher,
    setMode,
    setParam,
  } = useCipher();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".txt")) {
        setError("Harap pilih file teks (.txt)");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError(null);
      }
    }
  };

  const handleProcess = () => {
    if (!selectedFile) {
      setError("Silakan pilih file terlebih dahulu.");
      return;
    }
    if (!selectedCipher) {
      setError("Silakan pilih metode kriptografi.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (text === null || text === undefined) {
          throw new Error("Gagal membaca file.");
        }

        // Jalankan cipher
        let result = "";
        if (mode === "encrypt") {
          result = selectedCipher.encrypt(text, params);
        } else {
          result = selectedCipher.decrypt(text, params);
        }

        // Download hasilnya
        const element = document.createElement("a");
        const blob = new Blob([result], { type: "text/plain" });
        element.href = URL.createObjectURL(blob);
        const prefix = mode === "encrypt" ? "encrypted" : "decrypted";
        element.download = `${prefix}_${selectedFile.name}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        setIsProcessing(false);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memproses file.");
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError("Gagal membaca file.");
      setIsProcessing(false);
    };
    
    reader.readAsText(selectedFile);
  };

  return (
    <div
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-8) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Hero section */}
      <div className="terminal-shell">
        <div className="terminal-header">
          <div className="terminal-dots" aria-hidden="true">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "var(--text-xs)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--text-secondary)",
            }}
          >
            CIPHERLAB // BATCH FILE PROCESSING
          </p>
        </div>
        <div style={{ padding: "var(--space-6)" }}>
          <h1
            className="glow-text"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "var(--text-3xl)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              margin: "0 0 var(--space-2) 0",
              lineHeight: "var(--leading-tight)",
            }}
          >
            Unggah <span style={{ color: "var(--text-accent)" }}>File</span>
          </h1>
          <p
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              margin: 0,
              lineHeight: "var(--leading-normal)",
            }}
          >
            Pilih file .txt, tentukan algoritma, dan unduh hasil konversinya secara instan.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div
        className="terminal-shell"
        style={{
          padding: "var(--space-6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          border: selectedFile ? "1px solid var(--accent)" : "1px dashed var(--border)",
          background: selectedFile ? "rgba(58, 213, 123, 0.05)" : "var(--bg-surface)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          if (!selectedFile) {
            e.currentTarget.style.borderColor = "var(--accent-dim)";
            e.currentTarget.style.background = "var(--bg-elevated)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selectedFile) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "var(--bg-surface)";
          }
        }}
      >
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        
        {selectedFile ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>📄</div>
            <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "var(--text-xl)", color: "var(--text-primary)", margin: 0 }}>
              {selectedFile.name}
            </p>
            <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "var(--text-sm)", color: "var(--text-secondary)", margin: "var(--space-2) 0 0 0" }}>
              Klik untuk mengubah file
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>📁</div>
            <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "var(--text-lg)", margin: 0, textTransform: "uppercase", letterSpacing: "var(--tracking-wide)" }}>
              Pilih File Teks (.txt)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: "var(--space-3)", background: "rgba(255, 51, 51, 0.1)", border: "1px solid var(--error)", borderRadius: "var(--radius-base)", color: "var(--error)", fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}>
          [ERROR] {error}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Cipher selector */}
      <div>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "var(--text-lg)", color: "var(--text-primary)", marginBottom: "var(--space-4)", textTransform: "uppercase", letterSpacing: "var(--tracking-wide)" }}>
          2. Pilih Algoritma
        </p>
        <CipherSelector
          ciphers={ciphers}
          selectedId={selectedCipher?.id ?? null}
          onSelect={selectCipher}
        />
      </div>

      {/* Form parameter + mode toggle */}
      {selectedCipher && (
        <>
          <div style={{ height: "1px", background: "var(--border-subtle)" }} />
          <div className="terminal-shell" style={{ padding: "var(--space-5)" }}>
            <CipherForm
              cipher={selectedCipher}
              params={params}
              mode={mode}
              onParamChange={setParam}
              onModeChange={setMode}
            />
            
            <div style={{ marginTop: "var(--space-6)", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleProcess}
                disabled={isProcessing || !selectedFile}
                style={{
                  padding: "var(--space-3) var(--space-8)",
                  background: isProcessing || !selectedFile ? "var(--bg-elevated)" : "var(--accent)",
                  color: isProcessing || !selectedFile ? "var(--text-muted)" : "var(--bg-base)",
                  border: isProcessing || !selectedFile ? "1px solid var(--border)" : "1px solid var(--accent)",
                  borderRadius: "var(--radius-base)",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "var(--text-lg)",
                  letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase",
                  cursor: isProcessing || !selectedFile ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isProcessing || !selectedFile ? "none" : "0 0 10px var(--accent-glow)",
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing && selectedFile) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 0 15px var(--accent-glow-strong)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && selectedFile) {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 10px var(--accent-glow)";
                  }
                }}
              >
                {isProcessing ? "Memproses..." : "▶ Proses & Unduh"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
