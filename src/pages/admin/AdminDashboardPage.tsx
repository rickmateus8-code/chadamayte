import React from "react";
import { ShieldCheck, Database, HardDrive, Palette, Users } from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  return (
    <main className="container" style={{ padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.3rem 0.75rem",
          borderRadius: "999px",
          backgroundColor: "var(--color-primary-light)",
          color: "var(--color-primary-dark)",
          fontSize: "0.75rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
        }}>
          <ShieldCheck size={14} />
          Painel Administrativo • Shell Fase 0
        </div>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2rem",
          fontWeight: 700,
          color: "var(--color-text-main)",
        }}>
          Gestão do Chá de Bebê
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Estrutura administrativa preparada para integração de autenticação, CMS e RSVP nas fases seguintes.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1rem",
      }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-dark)",
            }}>
              <Palette size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Identidade Visual</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 600 }}>CMS / Tema</span>
            </div>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Configuração centralizada de paleta rosa/dourado, coroa, tipografia e mídias do evento.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-dark)",
            }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Lista de Convidados</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 600 }}>RSVP & Grupos</span>
            </div>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Módulo de acompanhantes, convites personalizados e confirmação de presença.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-dark)",
            }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Cloudflare D1</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 600 }}>Binding DB</span>
            </div>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Persistência relacional SQL serverless estruturada via migrations para dados de convidados.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--color-primary-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary-dark)",
            }}>
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Cloudflare R2</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-gold)", fontWeight: 600 }}>Binding MEDIA</span>
            </div>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Armazenamento de objetos para galeria de fotos, upload de mídias e assets estáticos.
          </p>
        </div>
      </div>
    </main>
  );
};
