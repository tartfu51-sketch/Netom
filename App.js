import React, { useState } from "react";
import PreChantier from "./PreChantier";

const C = {
  bg: "#1a4a8a", card: "#2563a8", border: "rgba(255,255,255,0.15)",
  accent: "#ffffff", text: "#ffffff", sub: "rgba(255,255,255,0.6)",
};

const FORMS = [
  { id: "prechantier",   label: "Pré-chantier",              icon: "🔍", color: "#00c2ff", component: PreChantier, ready: true },
  { id: "postchantier",  label: "Post-chantier",             icon: "✅", color: "#22c55e", component: null,        ready: false },
  { id: "dim_chauffage", label: "Dimensionnement Chauffage", icon: "🔥", color: "#ef4444", component: null,        ready: false },
  { id: "dim_froid",     label: "Dimensionnement Froid",     icon: "❄️", color: "#6366f1", component: null,        ready: false },
  { id: "etr",           label: "Pré-audit ETR",             icon: "⚡", color: "#f59e0b", component: null,        ready: false },
];

export default function App() {
  const [current, setCurrent] = useState(null);

  if (current) {
    const F = FORMS.find(f => f.id === current);
    const Comp = F.component;
    return (
      <div>
        <button
          onClick={() => setCurrent(null)}
          style={{
            position: "fixed", top: 12, left: 12, zIndex: 999,
            background: "#1a4a8a", color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8, padding: "8px 14px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          ← Accueil
        </button>
        <Comp />
      </div>
    );
  }

  return (
    <div style={{
      background: C.bg, minHeight: "100svh", color: C.text,
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: 500, margin: "0 auto",
    }}>

      {/* HEADER */}
      <div style={{
        padding: "40px 20px 28px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            background: "#fff", color: C.bg,
            fontWeight: 900, fontSize: 22,
            padding: "5px 14px", borderRadius: 5, letterSpacing: "-1px",
          }}>
            NETOM
          </div>
          <div>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 18 }}>Terrain App</div>
            <div style={{ color: C.sub, fontSize: 11 }}>
              Assistant Bureau d'Études · Audit Énergétique & ETR
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(0,0,0,0.2)",
          border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "12px 14px",
        }}>
          <div style={{ color: C.sub, fontSize: 11, lineHeight: 1.8 }}>
            📍 Formulaires terrain conformes aux exigences BET<br />
            📄 Génération automatique de pré-rapports PDF<br />
            📱 Optimisé mobile · Navigation sans clavier
          </div>
        </div>
      </div>

      {/* FORMULAIRES */}
      <div style={{ padding: "24px 16px 100px" }}>
        <div style={{
          color: C.sub, fontSize: 10, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16,
        }}>
          Formulaires disponibles
        </div>

        {FORMS.map(f => (
          <button
            key={f.id}
            onClick={() => f.ready && setCurrent(f.id)}
            style={{
              width: "100%",
              background: f.ready ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${f.ready ? f.color + "60" : C.border}`,
              borderRadius: 12, padding: "16px", marginBottom: 10,
              cursor: f.ready ? "pointer" : "default",
              textAlign: "left", opacity: f.ready ? 1 : 0.5,
              boxShadow: f.ready ? `0 0 20px ${f.color}20` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 28 }}>{f.icon}</div>
                <div>
                  <div style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>{f.label}</div>
                  <div style={{ color: C.sub, fontSize: 11, marginTop: 3 }}>
                    {f.ready ? "Disponible · Appuyer pour ouvrir" : "En cours de développement"}
                  </div>
                </div>
              </div>
              <div style={{
                background: f.ready ? f.color + "25" : "rgba(255,255,255,0.05)",
                color: f.ready ? f.color : C.sub,
                border: `1px solid ${f.ready ? f.color + "50" : C.border}`,
                borderRadius: 6, padding: "4px 10px",
                fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {f.ready ? "PRÊT" : "BIENTÔT"}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "100%", maxWidth: 500,
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        padding: "14px 20px",
        textAlign: "center", boxSizing: "border-box",
      }}>
        <div style={{ color: C.sub, fontSize: 10, lineHeight: 1.7 }}>
          NETOM – Assistant de Bureau d'Études<br />
          Audit Énergétique & ETR · v2.0
        </div>
      </div>
    </div>
  );
}
