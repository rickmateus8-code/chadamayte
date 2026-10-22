import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Crown,
  Users,
  CheckCircle2,
  Image as ImageIcon,
  Settings,
  LogOut,
  RefreshCw,
  Sliders,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  fetchAdminOverview,
  fetchAdminInvitations,
  deleteAdminInvitation,
  fetchAdminRsvps,
  fetchAdminMedia,
  fetchAdminEventSettings,
  type AdminOverview,
  type AdminInvitation,
  type AdminRsvp,
  type AdminMedia,
  type AdminEventSettings,
} from "../../lib/adminApi";
import { AdminLogin } from "./components/AdminLogin";
import { OverviewTab } from "./components/OverviewTab";
import { InvitationsTab } from "./components/InvitationsTab";
import { RsvpsTab } from "./components/RsvpsTab";
import { MediaTab } from "./components/MediaTab";
import { SettingsTab } from "./components/SettingsTab";
import { PortalBuilderTab } from "./components/PortalBuilderTab";
import { CreateInvitationModal } from "./components/CreateInvitationModal";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../../components/brand/RoyalOrnaments";

type AdminTabId = "overview" | "invitations" | "builder" | "rsvps" | "media" | "settings";

export const AdminDashboardPage: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem("mayte_admin_token") || "");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTabId>("overview");

  // Data states
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [rsvps, setRsvps] = useState<AdminRsvp[]>([]);
  const [mediaList, setMediaList] = useState<AdminMedia[]>([]);
  const [eventSettings, setEventSettings] = useState<AdminEventSettings | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const loadAllData = async () => {
    if (!token) return;
    setLoading(true);
    const [ov, invs, rsv, med, cfg] = await Promise.all([
      fetchAdminOverview(token),
      fetchAdminInvitations(token),
      fetchAdminRsvps(token),
      fetchAdminMedia(token),
      fetchAdminEventSettings(token),
    ]);

    if (!ov && !invs.length && !rsv.length && !cfg) {
      handleLogout();
      return;
    }

    setOverview(ov);
    setInvitations(invs);
    setRsvps(rsv);
    setMediaList(med);
    setEventSettings(cfg);
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
    <div className="admin-page-canvas">
      <main className="admin-page-card" aria-label="Painel Administrativo Real">
        <RoyalCornerFiligree position="tl" size={60} />
        <RoyalCornerFiligree position="tr" size={60} />
        <RoyalCornerFiligree position="bl" size={60} />
        <RoyalCornerFiligree position="br" size={60} />

        {/* Topo / Header Real */}
        <header className="admin-header-row">
          <div className="admin-header-brand">
            <img
              src="/images/mayte-royal-crown.png"
              alt="Coroa Real da Maytê"
              className="admin-header-crown"
            />
            <div>
              <div className="admin-header-eyebrow">
                <Crown size={14} />
                <span>Gabinete Real de Gestão • Papais da Maytê</span>
              </div>
              <h1 className="admin-header-title">
                Portal & Chá de Fraldas da Maytê
              </h1>
            </div>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/"
              className="btn-mini-luxury admin-action-btn"
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={14} />
              <span>Ver Convite ao Vivo</span>
            </Link>

            <button
              type="button"
              onClick={loadAllData}
              title="Atualizar dados"
              className="btn-mini-luxury admin-action-btn"
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>Atualizar</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Sair"
              className="btn-remove-companion admin-action-btn admin-logout-btn"
              style={{ width: "auto", padding: "0.45rem 0.9rem", borderRadius: "var(--radius-full)", gap: "5px", display: "inline-flex", alignItems: "center", fontSize: "0.8rem", fontWeight: 700 }}
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </header>

        <RoyalCrestOrnament width={180} />

        {/* Navegação de Abas Reais */}
        <nav
          aria-label="Seções do painel administrativo"
          className="admin-tabs-nav"
        >
          {[
            { id: "overview", label: "Fase & Nascimento", icon: Crown },
            { id: "invitations", label: `Kanban & Convites (${invitations.length})`, icon: Users },
            { id: "builder", label: "Construtor Arrastável & Seções", icon: Sliders },
            { id: "rsvps", label: `Respostas & Mimos (${rsvps.length})`, icon: CheckCircle2 },
            { id: "media", label: `Álbum Polaroid (${mediaList.length})`, icon: ImageIcon },
            { id: "settings", label: "Datas, Local & PIX", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTabId)}
                className={`boutique-filter-pill admin-tab-pill ${isSelected ? "is-active" : ""}`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Conteúdo da Aba Selecionada */}
        {activeTab === "overview" && overview && (
          <OverviewTab
            token={token}
            overview={overview}
            eventSettings={eventSettings}
            onNewInvitation={() => {
              setActiveTab("invitations");
              setShowCreateModal(true);
            }}
            onSaved={loadAllData}
          />
        )}

        {activeTab === "invitations" && (
          <InvitationsTab
            token={token}
            invitations={invitations}
            onOpenCreateModal={() => setShowCreateModal(true)}
            onDeleteInvitation={handleDeleteInvitation}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "builder" && (
          <PortalBuilderTab
            token={token}
            initialPortalConfig={eventSettings?.portalConfig}
            onSaved={loadAllData}
          />
        )}

        {activeTab === "rsvps" && <RsvpsTab rsvps={rsvps} />}

        {activeTab === "media" && (
          <MediaTab
            token={token}
            mediaList={mediaList}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            token={token}
            initialSettings={eventSettings}
            onSaved={loadAllData}
          />
        )}

        {/* Rodapé Real do Admin */}
        <footer style={{ textAlign: "center", marginTop: "2.5rem", paddingTop: "1rem", borderTop: "1px dashed rgba(212,169,89,0.4)", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
          <Sparkles size={12} color="var(--color-gold-deep)" style={{ verticalAlign: "middle", marginRight: "6px" }} />
          Painel Real da Princesa Maytê • Conectado ao Cloudflare D1 & R2
        </footer>

        {/* Modal de Novo Convite */}
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
    </div>
  );
};
