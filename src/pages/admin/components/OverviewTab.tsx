import React from "react";
import { Heart, Plus } from "lucide-react";
import type { AdminOverview } from "../../../lib/adminApi";

interface OverviewTabProps {
  overview: AdminOverview;
  onNewInvitation: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ overview, onNewInvitation }) => {
  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        <div className="floral-welcome-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-soft)", textTransform: "uppercase" }}>Total de Convites</span>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--color-text)" }}>
            {overview.totalInvitations}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>{overview.totalNominalGuests} convidados nominais</span>
        </div>

        <div className="floral-welcome-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "#27ae60" }}>
          <span style={{ fontSize: "0.8rem", color: "#27ae60", textTransform: "uppercase", fontWeight: 600 }}>Total Confirmados</span>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "#27ae60" }}>
            {overview.totalConfirmedPeople}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-soft)" }}>
            {overview.confirmedAdults} adultos • {overview.confirmedChildren} crianças
          </span>
        </div>

        <div className="floral-welcome-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "#e74c3c" }}>
          <span style={{ fontSize: "0.8rem", color: "#e74c3c", textTransform: "uppercase", fontWeight: 600 }}>Não Poderão Ir</span>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "#e74c3c" }}>
            {overview.declinedInvitations}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-soft)" }}>convites recusados</span>
        </div>

        <div className="floral-welcome-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "var(--color-gold)", boxShadow: "var(--shadow-gold)" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--color-gold-deep)", textTransform: "uppercase", fontWeight: 600 }}>Pendentes</span>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 700, color: "var(--color-gold-deep)" }}>
            {overview.pendingInvitations}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-soft)" }}>aguardando resposta</span>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "2rem", background: "var(--color-paper-warm)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--color-gold)" }}>
        <Heart size={28} color="var(--color-pink-deep)" style={{ margin: "0 auto 0.5rem auto" }} />
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--color-text)", margin: 0 }}>
          Tudo pronto para receber os convidados da Maitê!
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-soft)", maxWidth: "480px", margin: "0.5rem auto 1rem auto" }}>
          Utilize a aba "Convites" para cadastrar os amigos e familiares e gerar os links exclusivos para envio via WhatsApp.
        </p>
        <button
          type="button"
          onClick={onNewInvitation}
          className="btn-floral-gold"
        >
          <Plus size={16} /> Cadastrar Novo Convite
        </button>
      </div>
    </div>
  );
};