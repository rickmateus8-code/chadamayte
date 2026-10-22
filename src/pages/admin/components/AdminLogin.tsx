import React, { useState } from "react";
import { Mail, Lock, Crown, Sparkles, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { adminLogin } from "../../../lib/adminApi";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../../../components/brand/RoyalOrnaments";

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await adminLogin({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem("mayte_admin_token", res.token);
      onSuccess(res.token);
    } else {
      setError(res.message || "Credenciais inválidas. Verifique seu e-mail e senha.");
    }
  };

  return (
    <div
      className="invitation-canvas"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="floral-welcome-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "450px",
          padding: "2.75rem 2.25rem",
          border: "2px solid var(--color-gold)",
          boxShadow: "0 28px 65px rgba(201, 155, 59, 0.24)",
        }}
      >
        <RoyalCornerFiligree position="tl" size={50} />
        <RoyalCornerFiligree position="tr" size={50} />
        <RoyalCornerFiligree position="bl" size={50} />
        <RoyalCornerFiligree position="br" size={50} />

        <RoyalCrestOrnament width={175} />

        <img
          src="/images/mayte-royal-crown.png"
          alt="Coroa Real da Maytê"
          style={{
            width: "100px",
            height: "auto",
            margin: "0 auto 0.75rem auto",
            display: "block",
            filter: "drop-shadow(0 8px 18px rgba(201,155,59,0.3))",
          }}
        />

        <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
          <Crown size={13} /> Gabinete Real dos Papais
        </span>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            color: "var(--color-text)",
            marginBottom: "0.4rem",
            marginTop: 0,
          }}
        >
          Painel Real da Maytê
        </h1>

        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--color-text-soft)",
            marginBottom: "1.75rem",
          }}
        >
          Acesso administrativo exclusivo dos papais para a gestão segura do convite e memórias reais.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Campo E-mail */}
          <div className="royal-input-group">
            <span className="royal-input-icon">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="E-mail dos Papais"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="rsvp-field-input with-icon"
            />
          </div>

          {/* Campo Senha com Toggle Ver/Ocultar */}
          <div className="royal-input-group" style={{ position: "relative" }}>
            <span className="royal-input-icon">
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha dos Papais"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rsvp-field-input with-icon"
              style={{ paddingRight: "42px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--color-text-soft)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={showPassword ? "Ocultar senha" : "Ver senha"}
              aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="rsvp-error-banner" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-floral-gold btn-shimmer-gold"
            style={{ width: "100%", padding: "0.95rem" }}
          >
            <Sparkles size={16} />
            <span>{loading ? "Autenticando com Segurança..." : "Entrar no Painel Real"}</span>
          </button>
        </form>

        <div style={{ marginTop: "1.25rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "var(--color-gold-deep)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Voltar para o Convite da Maytê
          </Link>
        </div>
      </div>
    </div>
  );
};
