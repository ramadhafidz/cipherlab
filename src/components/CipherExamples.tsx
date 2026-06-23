import React from "react";
import { useCipher } from "../hooks/useCipher";

type Example = {
  id: string;
  cipherId: string;
  name: string;
  description: string;
  params?: Record<string, string>;
  input: string;
  mode?: "encrypt" | "decrypt";
};

const EXAMPLES: Example[] = [
  {
    id: "caesar-hello",
    cipherId: "caesar",
    name: "Caesar: HELLO",
    description: "Shift 3 (classic)",
    params: { shift: "3" },
    input: "HELLO WORLD",
    mode: "encrypt",
  },
  {
    id: "vigenere-attack",
    cipherId: "vigenere",
    name: "Vigenère: ATTACK",
    description: "Key: LEMON",
    params: { key: "LEMON" },
    input: "ATTACK AT DAWN",
    mode: "encrypt",
  },
  {
    id: "enigma-hello",
    cipherId: "enigma",
    name: "Enigma: HELLO",
    description: "Rotors I II III, pos AAA",
    params: { rotors: "I II III", positions: "AAA", key: "B" },
    input: "HELLO",
    mode: "encrypt",
  },
  {
    id: "hill-hill",
    cipherId: "hill",
    name: "Hill: HILL",
    description: "Key: HILL (2x2)",
    params: { key: "HILL" },
    input: "HELP",
    mode: "encrypt",
  },
];

export const CipherExamples: React.FC = () => {
  const {
    selectCipher,
    setParam,
    setInputText,
    setMode,
    reset,
    selectedCipher,
  } = useCipher();

  function loadExample(e: Example) {
    // pilih cipher
    selectCipher(e.cipherId);
    // reset dulu untuk menghindari parameter sisa
    reset();
    // set mode
    if (e.mode) setMode(e.mode);
    // set params
    if (e.params) {
      Object.entries(e.params).forEach(([k, v]) => setParam(k, v));
    }
    // set input
    setInputText(e.input);
  }

  // Hanya tampilkan contoh jika cipher yang dipilih sama dengan contoh
  const relevantExamples = EXAMPLES.filter((e) => e.cipherId === selectedCipher?.id);

  if (relevantExamples.length === 0) return null;

  return (
    <div style={{ marginTop: "var(--space-4)" }}>
      <p
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "var(--text-xs)",
          letterSpacing: "var(--tracking-wider)",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          marginBottom: "var(--space-2)",
        }}
      >
        Contoh Penggunaan:
      </p>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {relevantExamples.map((ex) => (
          <button
            key={ex.id}
            onClick={() => loadExample(ex)}
            style={{
              padding: "var(--space-2) var(--space-4)",
              background: "rgba(58, 213, 123, 0.1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-glow)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(58, 213, 123, 0.1)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {ex.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CipherExamples;
