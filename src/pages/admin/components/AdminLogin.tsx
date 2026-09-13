import React, { useState } from "react";
import { Lock } from "lucide-react";
import { adminLogin } from "../../../lib/adminApi";

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await adminLogin(passcode);
    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem("mayte_admin_token", res.token);
      onSuccess(res.token);
    } else {
      setError(res.message || "Senha incorreta.");
    }
  };

  return (
    <main style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--color-paper)",
        padding: "2.5rem 2rem",
        borderRadius: "var(--radius-xl)",
        border: "1.5px solid var(--color-gold)",
        boxShadow: "var(--shadow-sheet)",
        textAlign: "center",
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          margin: "0 auto 1.25rem auto",
          borderRadius: "50%",
          backgroundColor: "var(--color-pink-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-pink-deep)",
        }}>
          <Lock size={26} />
        </div>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--color-text)", marginBottom: "0.5rem" }}>
          Acesso dos Pais
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-soft)", marginBottom: "1.5rem" }}>
          Digite a senha de administrador para gerenciar o Chá de Fraldas da Maitê.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="password"
            placeholder="Senha de acesso"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-pink-soft)",
              outline: "none",
              fontSize: "1rem",
              textAlign: "center",
            }}
          />

          {error && (
            <span style={{ fontSize: "0.8rem", color: "#e74c3c" }}>{error}</span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-floral-gold"
            style={{ width: "100%", padding: "0.9rem" }}
          >
            {loading ? "Entrando..." : "Acessar Painel"}
          </button>
        </form>
      </div>
    </main>
  );
};