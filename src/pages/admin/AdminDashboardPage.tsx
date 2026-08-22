import React from "react";
import { ShieldCheck, Database, HardDrive, Palette, Users } from "lucide-react";
import { Crown } from "../../components/brand/Crown";

export const AdminDashboardPage: React.FC = () => {
  return (
    <main className="invitation-section" style={{ minHeight: "85vh", alignItems: "stretch" }}>
      <div className="invitation-container">
        <div style={{ marginBottom: "var(--space-xl)", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.85rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-bg-soft)",
            color: "var(--color-pink-deep)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            marginBottom: "var(--space-sm)",
            border: "1px solid var(--color-pink-soft)",
          }}>
            <ShieldCheck size={14} />
            Painel Administrativo • Shell Fase 1
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "var(--space-xs) 0" }}>
            <Crown size={32} color="var(--color-gold)" />
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--text-3xl)",
            fontWeight: 700,
            color: "var(--color-text)",
          }}>
            Gestão do Chá de Bebê da Maytê
          </h1>
          <p style={{ color: "var(--color-text-soft)", fontSize: "var(--text-sm)", maxWidth: "520px", margin: "0 auto" }}>
            Estrutura administrativa preparada para integração de autenticação, CMS e RSVP nas fases seguintes.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-md)",
        }}>
          <div className="info-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
              <div className="info-icon-wrapper" style={{ width: "42px", height: "42px", marginBottom: 0 }}>
                <Palette size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Identidade Visual</h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-gold-deep)", fontWeight: 600 }}>Tokens & CMS</span>
              </div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)", lineHeight: 1.6 }}>
              Design system estruturado com tokens de cor rosa/dourado, coroa vetorial e componentes desacoplados.
            </p>
          </div>

          <div className="info-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
              <div className="info-icon-wrapper" style={{ width: "42px", height: "42px", marginBottom: 0 }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Lista de Convidados</h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-gold-deep)", fontWeight: 600 }}>RSVP & Grupos</span>
              </div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)", lineHeight: 1.6 }}>
              Módulo de acompanhantes, convites nominais e confirmação de presença (planejado para Fase 2).
            </p>
          </div>

          <div className="info-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
              <div className="info-icon-wrapper" style={{ width: "42px", height: "42px", marginBottom: 0 }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Cloudflare D1</h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-gold-deep)", fontWeight: 600 }}>Binding DB</span>
              </div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)", lineHeight: 1.6 }}>
              Persistência relacional SQL serverless com migrations preparadas para tabelas de convidados e respostas.
            </p>
          </div>

          <div className="info-card" style={{ alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
              <div className="info-icon-wrapper" style={{ width: "42px", height: "42px", marginBottom: 0 }}>
                <HardDrive size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>Cloudflare R2</h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-gold-deep)", fontWeight: 600 }}>Binding MEDIA</span>
              </div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)", lineHeight: 1.6 }}>
              Armazenamento de fotos, galeria de memórias e upload de assets estáticos do evento.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};