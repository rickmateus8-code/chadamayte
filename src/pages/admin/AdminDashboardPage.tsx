import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Image as ImageIcon,
  LogOut,
  RefreshCw,
} from "lucide-react";
import {
  fetchAdminOverview,
  fetchAdminInvitations,
  deleteAdminInvitation,
  fetchAdminRsvps,
  fetchAdminMedia,
  type AdminOverview,
  type AdminInvitation,
  type AdminRsvp,
  type AdminMedia,
} from "../../lib/adminApi";
import { AdminLogin } from "./components/AdminLogin";
import { OverviewTab } from "./components/OverviewTab";
import { InvitationsTab } from "./components/InvitationsTab";
import { RsvpsTab } from "./components/RsvpsTab";
import { MediaTab } from "./components/MediaTab";
import { CreateInvitationModal } from "./components/CreateInvitationModal";

export const AdminDashboardPage: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem("mayte_admin_token") || "");
  const [loading, setLoading] = useState(false);

  // Tabs: 'overview' | 'invitations' | 'rsvps' | 'media'
  const [activeTab, setActiveTab] = useState<"overview" | "invitations" | "rsvps" | "media">("overview");

  // Data states
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [rsvps, setRsvps] = useState<AdminRsvp[]>([]);
  const [mediaList, setMediaList] = useState<AdminMedia[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const loadAllData = async () => {
    if (!token) return;
    setLoading(true);
    const [ov, invs, rsv, med] = await Promise.all([
      fetchAdminOverview(token),
      fetchAdminInvitations(token),
      fetchAdminRsvps(token),
      fetchAdminMedia(token),
    ]);

    if (!ov && !invs.length && !rsv.length) {
      handleLogout();
      return;
    }

    setOverview(ov);
    setInvitations(invs);
    setRsvps(rsv);
    setMediaList(med);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("mayte_admin_token");
    setToken("");
    setOverview(null);
    setInvitations([]);
    setRsvps([]);
  };

  const handleDeleteInvitation = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o convite de "${name}"?`)) return;
    const ok = await deleteAdminInvitation(token, id);
    if (ok) {
      loadAllData();
    }
  };

  if (!token) {
    return <AdminLogin onSuccess={(t) => setToken(t)} />;
  }

  return (
    <main style={{ minHeight: "90vh", padding: "1.5rem 1rem", maxWidth: "980px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1.5rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--color-pink-soft)",
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--color-pink-deep)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <ShieldCheck size={16} />
            Painel de Gestão dos Papais
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--color-text)", margin: "0.25rem 0 0 0" }}>
            Chá de Fraldas da Maitê
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={loadAllData}
            title="Atualizar dados"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0.6rem 0.9rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-pink-soft)",
              background: "var(--color-paper)",
              color: "var(--color-text)",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            Atualizar
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0.6rem 0.9rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-pink-soft)",
              background: "var(--color-paper)",
              color: "#e74c3c",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "4px" }}>
        {[
          { id: "overview", label: "Visão Geral", icon: Users },
          { id: "invitations", label: `Convites (${invitations.length})`, icon: Users },
          { id: "rsvps", label: `Respostas (${rsvps.length})`, icon: CheckCircle2 },
          { id: "media", label: `Fotos (${mediaList.length})`, icon: ImageIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.25rem",
                borderRadius: "var(--radius-full)",
                border: isSelected ? "1.5px solid var(--color-gold)" : "1px solid var(--color-pink-soft)",
                background: isSelected ? "var(--color-pink-light)" : "var(--color-paper)",
                color: isSelected ? "var(--color-pink-dark)" : "var(--color-text-soft)",
                fontWeight: isSelected ? 700 : 500,
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && overview && (
        <OverviewTab
          overview={overview}
          onNewInvitation={() => {
            setActiveTab("invitations");
            setShowCreateModal(true);
          }}
        />
      )}

      {activeTab === "invitations" && (
        <InvitationsTab
          invitations={invitations}
          onOpenCreateModal={() => setShowCreateModal(true)}
          onDeleteInvitation={handleDeleteInvitation}
        />
      )}

      {activeTab === "rsvps" && <RsvpsTab rsvps={rsvps} />}

      {activeTab === "media" && <MediaTab mediaList={mediaList} />}

      {/* Modal */}
      {showCreateModal && (
        <CreateInvitationModal
          token={token}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadAllData();
          }}
        />
      )}
    </main>
  );
};