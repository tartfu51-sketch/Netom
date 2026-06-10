import React, { useState, useRef } from "react";

// ─── COULEURS ────────────────────────────────────────────────────────────────
const BLUE = "#2563a8";
const BLUE_DARK = "#1a4a8a";
const BLUE_LIGHT = "#3b7dd8";
const RED = "#dc2626";
const WHITE = "#ffffff";
const GRAY = "#f1f5f9";
const TEXT = "#1e293b";

// ─── COMPOSANTS DE BASE ───────────────────────────────────────────────────────

// Boutons choix (remplace les selects — zéro clavier)
function ChoixBoutons({ label, options, value, onChange, required, colonnes = 2 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
        {label}{required && <span style={{ color: RED }}> *</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${colonnes}, 1fr)`, gap: 6 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: "10px 8px", borderRadius: 8, border: "none", cursor: "pointer",
            background: value === opt ? BLUE : "#e8f0fe",
            color: value === opt ? WHITE : BLUE_DARK,
            fontSize: 12, fontWeight: value === opt ? 700 : 500,
            textAlign: "center", lineHeight: 1.3,
            boxShadow: value === opt ? "0 2px 8px rgba(37,99,168,0.4)" : "none",
            transition: "all 0.15s"
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

// Champ numérique avec + / - (évite le clavier autant que possible)
function ChampNombre({ label, value, onChange, unit, required, min = 0, step = 1 }) {
  const val = parseFloat(value) || 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
        {label}{required && <span style={{ color: RED }}> *</span>}
        {unit && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>({unit})</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => onChange(Math.max(min, val - step).toString())} style={{
          width: 40, height: 40, borderRadius: 8, border: "none",
          background: BLUE, color: WHITE, fontSize: 20, fontWeight: 700, cursor: "pointer"
        }}>−</button>
        <input
          type="number" value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, textAlign: "center", padding: "10px", fontSize: 18, fontWeight: 700,
            border: `2px solid ${value ? BLUE : "#cbd5e1"}`, borderRadius: 8,
            color: TEXT, background: WHITE, outline: "none"
          }}
        />
        <button onClick={() => onChange((val + step).toString())} style={{
          width: 40, height: 40, borderRadius: 8, border: "none",
          background: BLUE, color: WHITE, fontSize: 20, fontWeight: 700, cursor: "pointer"
        }}>+</button>
      </div>
    </div>
  );
}

// Champ texte simple (uniquement quand nécessaire)
function ChampTexte({ label, value, onChange, required, placeholder, rows }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
        {label}{required && <span style={{ color: RED }}> *</span>}
      </div>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 14, border: `2px solid ${value ? BLUE : "#cbd5e1"}`, borderRadius: 8, resize: "none", outline: "none", fontFamily: "sans-serif" }}
        />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} type="text"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 16, border: `2px solid ${value ? BLUE : "#cbd5e1"}`, borderRadius: 8, outline: "none" }}
        />
      )}
    </div>
  );
}

// Séparateur
function Sep({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 10px" }}>
      <div style={{ height: 1, flex: 1, background: "#cbd5e1" }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <div style={{ height: 1, flex: 1, background: "#cbd5e1" }} />
    </div>
  );
}

// ─── DONNÉES INITIALES ────────────────────────────────────────────────────────
const INIT = {
  // INFOS CLIENT
  client_nom: "", client_tel: "", client_adresse: "", client_cp: "", client_ville: "",
  client_proprietaire: "Oui", nb_occupants: "", revenu_fiscal: "",
  // PROJET
  ref_mission: "", date_visite: "", technicien: "", bet_nom: "", ingenieur_ref: "",
  type_mission: "Pré-audit énergétique",
  // LOGEMENT
  type_batiment: "Maison individuelle", annee_construction: "", regime_occupation: "Résidence principale",
  nb_niveaux: "", surface_habitable: "", surface_plancher: "",
  // SURFACES PIÈCES
  pieces: [],
  // FAÇADES
  facade_nord_largeur: "", facade_nord_hauteur: "", facade_nord_orientation: "Nord",
  facade_nord_materiau: "", facade_nord_etat: "",
  facade_sud_largeur: "", facade_sud_hauteur: "", facade_sud_materiau: "", facade_sud_etat: "",
  facade_est_largeur: "", facade_est_hauteur: "", facade_est_materiau: "", facade_est_etat: "",
  facade_ouest_largeur: "", facade_ouest_hauteur: "", facade_ouest_materiau: "", facade_ouest_etat: "",
  // MURS
  murs_type: "", murs_ep: "", murs_isolation: "Non", murs_iso_type: "", murs_iso_ep: "", murs_iso_annee: "",
  // TOITURE/COMBLES
  toiture_type: "", toiture_surface: "", toiture_isolation: "Non",
  toiture_iso_type: "", toiture_iso_ep: "", toiture_iso_annee: "",
  combles_type: "Perdus", combles_accessibles: "Non",
  // PLANCHER BAS
  plancher_type: "", plancher_isolation: "Non", plancher_iso_type: "", plancher_iso_ep: "",
  // VITRAGE
  vitrage_type: "", vitrage_annee: "", chassis_type: "", chassis_etat: "",
  nb_fenetres: "", surface_vitree_totale: "",
  // CHAUFFAGE
  ch_type: "", ch_energie: "", ch_marque: "", ch_modele: "",
  ch_annee: "", ch_puissance: "", ch_rendement: "",
  ch_regulation: "", ch_rbt: "Non", ch_comptage: "Non",
  ch_entretien_annee: "", ch_contrat_entretien: "Non",
  // ECS
  ecs_type: "", ecs_energie: "", ecs_annee: "", ecs_volume: "",
  ecs_boucle: "Non", ecs_calorifuge: "Non",
  // COMPTEUR ÉLECTRIQUE
  elec_type: "", elec_puissance: "", elec_abonnement: "",
  elec_compteur_linky: "Non", elec_conso_annuelle: "",
  // VENTILATION
  vmc_type: "", vmc_marque: "", vmc_annee: "", vmc_etat: "",
  vmc_entretien: "Non",
  // CLIMATISATION
  clim: "Non", clim_type: "", clim_nb: "", clim_annee: "",
  // PHOTOVOLTAÏQUE / SOLAIRE
  pv: "Non", pv_puissance: "", pv_annee: "", pv_orientation: "",
  solaire_thermique: "Non", solaire_surface: "",
  // ETR ZONES
  mitoyennete: "Isolé",
  eclairage_type: "Mixte LED / fluo", eclairage_detection: "Non",
  conso_gaz: "", conso_fioul: "",
  reseau_elec: "Monophasé",
  zone_radon: "", zone_sismique: "", zone_inondation: "Non",
  zone_argile: "", reseau_gaz: "Non", reseau_fibre: "Non",
  // ANAH
  anah_eligible: "À vérifier", anah_type: "", anah_observations: "", anah_dossier: "Non",
  // DOCUMENTAIRE
  dpe_existant: "Non", dpe_classe: "", dpe_annee: "",
  amiante_dta: "Non", plomb_crep: "Non", titre_propriete: "Non vérifié",
  // OBSERVATIONS
  observations_ext: "", observations_int: "", points_vigilance: "",
  travaux_urgents: "Non", description_urgences: "",
  releves_a_confirmer: "", photos_complementaires: "",
  // VALIDATION
  visite_complete: "Oui", raison_incomplete: "",
  signature_technicien: "", signature_client: "", date_rapport: "",
};

// ─── CONTENU DES SECTIONS ─────────────────────────────────────────────────────

function SecInfosClient({ form, update }) {
  return (<>
    <Sep label="Identité" />
    <ChampTexte label="Nom du client" value={form.client_nom} onChange={v => update("client_nom", v)} required placeholder="Nom Prénom" />
    <ChampTexte label="Téléphone" value={form.client_tel} onChange={v => update("client_tel", v)} required placeholder="06 XX XX XX XX" />
    <Sep label="Adresse du bien" />
    <ChampTexte label="Adresse" value={form.client_adresse} onChange={v => update("client_adresse", v)} required />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
      <ChampTexte label="Code postal" value={form.client_cp} onChange={v => update("client_cp", v)} required />
      <ChampTexte label="Ville" value={form.client_ville} onChange={v => update("client_ville", v)} required />
    </div>
    <ChoixBoutons label="Propriétaire ?" options={["Oui", "Non – locataire", "Bailleur"]} value={form.client_proprietaire} onChange={v => update("client_proprietaire", v)} colonnes={3} />
    <ChampNombre label="Nombre d'occupants" value={form.nb_occupants} onChange={v => update("nb_occupants", v)} min={1} step={1} required />
  </>);
}

function SecProjet({ form, update }) {
  return (<>
    <Sep label="Mission" />
    <ChampTexte label="Référence mission" value={form.ref_mission} onChange={v => update("ref_mission", v)} required placeholder="Ex: NETOM-2024-001" />
    <ChoixBoutons label="Type de mission" options={["Pré-audit énergétique", "Audit Loi Élan", "ETR seul", "Pré-audit + ETR", "Contrôle qualité"]} value={form.type_mission} onChange={v => update("type_mission", v)} colonnes={2} />
    <ChampTexte label="Date de visite" value={form.date_visite} onChange={v => update("date_visite", v)} required />
    <Sep label="Intervenants" />
    <ChampTexte label="Technicien NETOM" value={form.technicien} onChange={v => update("technicien", v)} required />
    <ChampTexte label="Bureau d'études" value={form.bet_nom} onChange={v => update("bet_nom", v)} required />
    <ChampTexte label="Ingénieur référent" value={form.ingenieur_ref} onChange={v => update("ingenieur_ref", v)} />
  </>);
}

function SecExterieur({ form, update }) {
  return (<>
    <Sep label="Tour extérieur" />
    <ChoixBoutons label="Type de bâtiment" options={["Maison individuelle", "Résidentiel collectif", "Tertiaire", "ERP", "Industriel"]} value={form.type_batiment} onChange={v => update("type_batiment", v)} colonnes={2} />
    <ChampNombre label="Année de construction" value={form.annee_construction} onChange={v => update("annee_construction", v)} min={1800} step={1} required />
    <ChampNombre label="Nombre de niveaux" value={form.nb_niveaux} onChange={v => update("nb_niveaux", v)} min={1} step={1} required />
    <ChoixBoutons label="Mitoyenneté" options={["Isolé", "1 côté mitoyen", "2 côtés mitoyens", "En bande"]} value={form.mitoyennete} onChange={v => update("mitoyennete", v)} colonnes={2} />
    <ChoixBoutons label="Régime d'occupation" options={["Résidence principale", "Résidence secondaire", "Location", "Vacant"]} value={form.regime_occupation} onChange={v => update("regime_occupation", v)} colonnes={2} />
    <ChampTexte label="Observations extérieur" value={form.observations_ext} onChange={v => update("observations_ext", v)} rows={3} placeholder="État façades, toiture, menuiseries visibles..." />
  </>);
}

function SecDocumentaire({ form, update }) {
  return (<>
    <Sep label="Documents disponibles" />
    <ChoixBoutons label="DPE existant" options={["Non", "Oui"]} value={form.dpe_existant} onChange={v => update("dpe_existant", v)} colonnes={2} />
    {form.dpe_existant === "Oui" && <>
      <ChoixBoutons label="Classe DPE" options={["A", "B", "C", "D", "E", "F", "G"]} value={form.dpe_classe} onChange={v => update("dpe_classe", v)} colonnes={7} />
      <ChampNombre label="Année DPE" value={form.dpe_annee} onChange={v => update("dpe_annee", v)} min={2006} step={1} />
    </>}
    <ChoixBoutons label="DTA Amiante" options={["Non", "Oui", "En cours"]} value={form.amiante_dta} onChange={v => update("amiante_dta", v)} colonnes={3} />
    <ChoixBoutons label="CREP Plomb" options={["Non", "Oui", "Non applicable"]} value={form.plomb_crep} onChange={v => update("plomb_crep", v)} colonnes={3} />
    <ChoixBoutons label="Titre de propriété vérifié" options={["Non vérifié", "Oui", "Indisponible"]} value={form.titre_propriete} onChange={v => update("titre_propriete", v)} colonnes={3} />
    <Sep label="Relevés à confirmer" />
    <ChampTexte label="Éléments à confirmer avec le client" value={form.releves_a_confirmer} onChange={v => update("releves_a_confirmer", v)} rows={3} placeholder="Ex: surface déclarée à vérifier, permis de construire..." />
  </>);
}

function SecLogement({ form, update }) {
  return (<>
    <Sep label="Surfaces" />
    <ChampNombre label="Surface habitable" value={form.surface_habitable} onChange={v => update("surface_habitable", v)} unit="m²" step={0.5} required />
    <ChampNombre label="Surface plancher" value={form.surface_plancher} onChange={v => update("surface_plancher", v)} unit="m²" step={0.5} />
    <Sep label="Pièces — Relevé pièce par pièce" />
    <PiecesReleveur pieces={form.pieces} onChange={v => update("pieces", v)} />
  </>);
}

function PiecesReleveur({ pieces, onChange }) {
  const types = ["Salon", "Cuisine", "Chambre", "SDB", "WC", "Bureau", "Couloir", "Garage", "Cave", "Autre"];
  const ajouterPiece = (type) => onChange([...pieces, { id: Date.now(), type, surface: "", hauteur: "2.5", orientation: "Sud" }]);
  const modifierPiece = (id, champ, val) => onChange(pieces.map(p => p.id === id ? { ...p, [champ]: val } : p));
  const supprimerPiece = (id) => onChange(pieces.filter(p => p.id !== id));
  const totalSurface = pieces.reduce((acc, p) => acc + (parseFloat(p.surface) || 0), 0);

  return (<>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
      {types.map(t => (
        <button key={t} onClick={() => ajouterPiece(t)} style={{
          padding: "10px 4px", borderRadius: 8, border: `2px dashed ${BLUE}`,
          background: "#eff6ff", color: BLUE, fontSize: 11, fontWeight: 700, cursor: "pointer"
        }}>+ {t}</button>
      ))}
    </div>
    {pieces.length > 0 && <>
      <div style={{ background: "#eff6ff", border: `1px solid ${BLUE}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, textAlign: "center" }}>
        <span style={{ fontWeight: 800, color: BLUE, fontSize: 16 }}>Total : {totalSurface.toFixed(1)} m²</span>
        <span style={{ color: "#64748b", fontSize: 11, marginLeft: 8 }}>{pieces.length} pièce(s)</span>
      </div>
      {pieces.map(p => (
        <div key={p.id} style={{ background: WHITE, border: `1px solid #cbd5e1`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: BLUE, fontSize: 14 }}>{p.type}</span>
            <button onClick={() => supprimerPiece(p.id)} style={{ background: "#fef2f2", color: RED, border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>✕ Supprimer</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Surface (m²)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={() => modifierPiece(p.id, "surface", Math.max(0, (parseFloat(p.surface) || 0) - 0.5).toFixed(1))} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: BLUE, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>−</button>
                <input type="number" value={p.surface} onChange={e => modifierPiece(p.id, "surface", e.target.value)} style={{ flex: 1, textAlign: "center", padding: "6px 4px", fontSize: 16, fontWeight: 700, border: `2px solid ${BLUE}`, borderRadius: 6, outline: "none" }} />
                <button onClick={() => modifierPiece(p.id, "surface", ((parseFloat(p.surface) || 0) + 0.5).toFixed(1))} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: BLUE, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>+</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Hauteur (m)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={() => modifierPiece(p.id, "hauteur", Math.max(2, (parseFloat(p.hauteur) || 2.5) - 0.1).toFixed(1))} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: BLUE, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>−</button>
                <input type="number" value={p.hauteur} onChange={e => modifierPiece(p.id, "hauteur", e.target.value)} style={{ flex: 1, textAlign: "center", padding: "6px 4px", fontSize: 16, fontWeight: 700, border: `2px solid #cbd5e1`, borderRadius: 6, outline: "none" }} />
                <button onClick={() => modifierPiece(p.id, "hauteur", ((parseFloat(p.hauteur) || 2.5) + 0.1).toFixed(1))} style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: BLUE, color: WHITE, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>+</button>
              </div>
            </div>
          </div>
          <ChoixBoutons label="Orientation" options={["Nord", "Sud", "Est", "Ouest"]} value={p.orientation} onChange={v => modifierPiece(p.id, "orientation", v)} colonnes={4} />
        </div>
      ))}
    </>}
  </>);
}

function SecFacades({ form, update }) {
  const facades = [
    { key: "nord", label: "Façade Nord", emoji: "🧭" },
    { key: "sud", label: "Façade Sud", emoji: "☀️" },
    { key: "est", label: "Façade Est", emoji: "→" },
    { key: "ouest", label: "Façade Ouest", emoji: "←" },
  ];
  return (<>
    <Sep label="Relevé des façades" />
    {facades.map(f => {
      const l = form[`facade_${f.key}_largeur`];
      const h = form[`facade_${f.key}_hauteur`];
      const surface = l && h ? (parseFloat(l) * parseFloat(h)).toFixed(1) : "—";
      return (
        <div key={f.key} style={{ background: WHITE, border: `2px solid #cbd5e1`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, color: BLUE, fontSize: 14, marginBottom: 10 }}>{f.emoji} {f.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <ChampNombre label="Largeur" value={form[`facade_${f.key}_largeur`]} onChange={v => update(`facade_${f.key}_largeur`, v)} unit="m" step={0.1} />
            <ChampNombre label="Hauteur" value={form[`facade_${f.key}_hauteur`]} onChange={v => update(`facade_${f.key}_hauteur`, v)} unit="m" step={0.1} />
          </div>
          {l && h && <div style={{ background: "#eff6ff", borderRadius: 6, padding: "6px 10px", textAlign: "center", fontWeight: 700, color: BLUE, fontSize: 14 }}>Surface brute : {surface} m²</div>}
          <ChoixBoutons label="Matériau" options={["Béton banché", "Brique", "Parpaing", "Bois", "Pierre", "Enduit", "Bardage"]} value={form[`facade_${f.key}_materiau`]} onChange={v => update(`facade_${f.key}_materiau`, v)} colonnes={3} />
          <ChoixBoutons label="État" options={["Bon", "Moyen", "Mauvais", "À rénover"]} value={form[`facade_${f.key}_etat`]} onChange={v => update(`facade_${f.key}_etat`, v)} colonnes={4} />
        </div>
      );
    })}
    <Sep label="Isolation murs extérieurs" />
    <ChoixBoutons label="Type de murs" options={["Béton banché", "Béton cellulaire", "Brique pleine", "Brique creuse", "Parpaing", "Ossature bois", "Pierre", "Pisé", "Autre"]} value={form.murs_type} onChange={v => update("murs_type", v)} colonnes={3} />
    <ChampNombre label="Épaisseur murs" value={form.murs_ep} onChange={v => update("murs_ep", v)} unit="cm" step={1} />
    <ChoixBoutons label="Isolation murs" options={["Non", "ITI – Intérieure", "ITE – Extérieure", "Remplissage", "Inconnue"]} value={form.murs_isolation} onChange={v => update("murs_isolation", v)} colonnes={2} />
    {form.murs_isolation !== "Non" && form.murs_isolation !== "Inconnue" && <>
      <ChoixBoutons label="Nature isolant" options={["Laine de verre", "Laine de roche", "PSE", "XPS", "Polyuréthane", "Fibre de bois", "Ouate", "Inconnu"]} value={form.murs_iso_type} onChange={v => update("murs_iso_type", v)} colonnes={3} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <ChampNombre label="Épaisseur isolant" value={form.murs_iso_ep} onChange={v => update("murs_iso_ep", v)} unit="cm" step={1} />
        <ChampNombre label="Année pose" value={form.murs_iso_annee} onChange={v => update("murs_iso_annee", v)} min={1950} step={1} />
      </div>
    </>}
  </>);
}

function SecToiture({ form, update }) {
  return (<>
    <Sep label="Type de toiture" />
    <ChoixBoutons label="Type" options={["Combles perdus", "Combles aménagés", "Toiture-terrasse", "Toit incliné tuiles", "Toit incliné ardoises", "Bac acier", "Autre"]} value={form.toiture_type} onChange={v => update("toiture_type", v)} colonnes={2} required />
    <ChampNombre label="Surface toiture" value={form.toiture_surface} onChange={v => update("toiture_surface", v)} unit="m²" step={0.5} />
    <ChoixBoutons label="Combles" options={["Perdus", "Aménagés", "Non applicable"]} value={form.combles_type} onChange={v => update("combles_type", v)} colonnes={3} />
    <ChoixBoutons label="Combles accessibles" options={["Oui", "Non", "Trappe uniquement"]} value={form.combles_accessibles} onChange={v => update("combles_accessibles", v)} colonnes={3} />
    <Sep label="Isolation toiture" />
    <ChoixBoutons label="Isolation" options={["Non", "Soufflée en vrac", "Rouleaux", "Panneaux rampants", "Sarking", "ITE terrasse", "Inconnue"]} value={form.toiture_isolation} onChange={v => update("toiture_isolation", v)} colonnes={2} required />
    {form.toiture_isolation !== "Non" && form.toiture_isolation !== "Inconnue" && <>
      <ChoixBoutons label="Nature isolant" options={["Laine de verre", "Laine de roche", "Ouate soufflée", "PSE", "XPS", "Polyuréthane", "Fibre de bois", "Inconnu"]} value={form.toiture_iso_type} onChange={v => update("toiture_iso_type", v)} colonnes={3} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <ChampNombre label="Épaisseur" value={form.toiture_iso_ep} onChange={v => update("toiture_iso_ep", v)} unit="cm" step={1} />
        <ChampNombre label="Année pose" value={form.toiture_iso_annee} onChange={v => update("toiture_iso_annee", v)} min={1950} step={1} />
      </div>
    </>}
  </>);
}

function SecVitrage({ form, update }) {
  return (<>
    <Sep label="Type de vitrage" />
    <ChoixBoutons label="Vitrage" options={["Simple vitrage", "Double vitrage standard", "DV récent (>2000)", "DV faible émissivité", "Triple vitrage", "Mixte"]} value={form.vitrage_type} onChange={v => update("vitrage_type", v)} colonnes={2} required />
    <ChampNombre label="Année de remplacement" value={form.vitrage_annee} onChange={v => update("vitrage_annee", v)} min={1950} step={1} />
    <ChoixBoutons label="Matériau chassis" options={["Bois", "PVC", "Alu sans RT", "Alu avec RT", "Mixte", "Acier"]} value={form.chassis_type} onChange={v => update("chassis_type", v)} colonnes={3} />
    <ChoixBoutons label="État menuiseries" options={["Très bon", "Bon", "Acceptable", "Dégradé", "Mauvais"]} value={form.chassis_etat} onChange={v => update("chassis_etat", v)} colonnes={3} />
    <Sep label="Mesures" />
    <ChampNombre label="Nombre de fenêtres" value={form.nb_fenetres} onChange={v => update("nb_fenetres", v)} step={1} />
    <ChampNombre label="Surface vitrée totale" value={form.surface_vitree_totale} onChange={v => update("surface_vitree_totale", v)} unit="m²" step={0.5} />
    <Sep label="Plancher bas" />
    <ChoixBoutons label="Type de plancher bas" options={["Vide sanitaire ventilé", "Vide sanitaire non ventilé", "Terre-plein", "Sur sous-sol chauffé", "Sur sous-sol non chauffé", "Pilotis"]} value={form.plancher_type} onChange={v => update("plancher_type", v)} colonnes={2} required />
    <ChoixBoutons label="Isolation plancher" options={["Non", "Oui – sous plancher", "Oui – terre-plein", "Inconnue"]} value={form.plancher_isolation} onChange={v => update("plancher_isolation", v)} colonnes={2} />
    {form.plancher_isolation !== "Non" && <>
      <ChoixBoutons label="Isolant plancher" options={["Laine de verre", "Laine de roche", "PSE", "XPS", "Polyuréthane", "Inconnu"]} value={form.plancher_iso_type} onChange={v => update("plancher_iso_type", v)} colonnes={3} />
      <ChampNombre label="Épaisseur" value={form.plancher_iso_ep} onChange={v => update("plancher_iso_ep", v)} unit="cm" step={1} />
    </>}
  </>);
}

function SecChauffage({ form, update }) {
  return (<>
    <ChoixBoutons label="Type d'installation" options={["Chaudière gaz collective", "Chaudière gaz individuelle", "Chaudière fioul", "Chaudière bois/granulés", "PAC air/eau", "PAC air/air", "PAC géothermique", "Réseau de chaleur", "Radiateurs électriques", "Plancher chauffant", "Ventilo-convecteurs", "Poêle à bois", "CTA batterie chaude", "Autre"]} value={form.ch_type} onChange={v => update("ch_type", v)} colonnes={2} required />
    <ChoixBoutons label="Énergie" options={["Gaz naturel", "Fioul", "GPL", "Électricité", "Granulés", "Bois bûches", "Réseau chaleur", "Géothermie", "Aérothermie"]} value={form.ch_energie} onChange={v => update("ch_energie", v)} colonnes={3} />
    <Sep label="Équipement" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <ChampTexte label="Marque" value={form.ch_marque} onChange={v => update("ch_marque", v)} placeholder="Ex: Viessmann" />
      <ChampTexte label="Modèle" value={form.ch_modele} onChange={v => update("ch_modele", v)} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      <ChampNombre label="Année" value={form.ch_annee} onChange={v => update("ch_annee", v)} min={1950} step={1} />
      <ChampNombre label="Puissance" value={form.ch_puissance} onChange={v => update("ch_puissance", v)} unit="kW" step={0.5} />
      <ChampNombre label="Rendement" value={form.ch_rendement} onChange={v => update("ch_rendement", v)} unit="%" step={1} />
    </div>
    <Sep label="Régulation & Comptage" />
    <ChoixBoutons label="Régulation" options={["Thermostat simple", "Thermostat programmable", "Robinets thermostatiques", "Sonde extérieure", "GTB/GTC", "Aucune"]} value={form.ch_regulation} onChange={v => update("ch_regulation", v)} colonnes={2} />
    <ChoixBoutons label="Robinets thermostatiques" options={["Non", "Oui – tous", "Oui – partiels"]} value={form.ch_rbt} onChange={v => update("ch_rbt", v)} colonnes={3} />
    <ChoixBoutons label="Comptage individuel chaleur" options={["Non", "Répartiteurs", "Compteurs énergie", "En cours"]} value={form.ch_comptage} onChange={v => update("ch_comptage", v)} colonnes={2} />
    <ChoixBoutons label="Contrat entretien" options={["Non", "Oui", "Expiré"]} value={form.ch_contrat_entretien} onChange={v => update("ch_contrat_entretien", v)} colonnes={3} />
    <ChampNombre label="Dernier entretien (année)" value={form.ch_entretien_annee} onChange={v => update("ch_entretien_annee", v)} min={2000} step={1} />
    <Sep label="Consommations" />
    <ChampNombre label="Conso gaz annuelle" value={form.conso_gaz} onChange={v => update("conso_gaz", v)} unit="kWh/an" step={100} />
    <ChampNombre label="Conso fioul annuelle" value={form.conso_fioul} onChange={v => update("conso_fioul", v)} unit="L/an" step={50} />
  </>);
}

function SecECS({ form, update }) {
  return (<>
    <ChoixBoutons label="Type ECS" options={["Production collective chaudière", "Ballon solaire collectif", "Ballon électrique individuel", "Chauffe-eau thermodynamique", "Semi-collectif", "Instantané gaz", "Mixte"]} value={form.ecs_type} onChange={v => update("ecs_type", v)} colonnes={2} required />
    <ChoixBoutons label="Énergie ECS" options={["Gaz naturel", "Électricité", "Solaire thermique", "Fioul", "Réseau chaleur"]} value={form.ecs_energie} onChange={v => update("ecs_energie", v)} colonnes={3} />
    <ChampNombre label="Année installation" value={form.ecs_annee} onChange={v => update("ecs_annee", v)} min={1950} step={1} />
    <ChampNombre label="Volume ballon" value={form.ecs_volume} onChange={v => update("ecs_volume", v)} unit="L" step={10} />
    <ChoixBoutons label="Boucle retour ECS" options={["Non", "Oui", "Non accessible"]} value={form.ecs_boucle} onChange={v => update("ecs_boucle", v)} colonnes={3} />
    <ChoixBoutons label="Calorifugeage canalisations" options={["Non", "Oui – conforme", "Oui – dégradé", "Partiel"]} value={form.ecs_calorifuge} onChange={v => update("ecs_calorifuge", v)} colonnes={2} />
  </>);
}

function SecElec({ form, update }) {
  return (<>
    <Sep label="Compteur électrique" />
    <ChoixBoutons label="Type de compteur" options={["Monophasé", "Triphasé", "Linky"]} value={form.elec_type} onChange={v => update("elec_type", v)} colonnes={3} />
    <ChampNombre label="Puissance souscrite" value={form.elec_puissance} onChange={v => update("elec_puissance", v)} unit="kVA" step={3} />
    <ChoixBoutons label="Type d'abonnement" options={["Base", "Heures pleines/creuses", "Tempo", "EJP", "Vert"]} value={form.elec_abonnement} onChange={v => update("elec_abonnement", v)} colonnes={3} />
    <ChoixBoutons label="Compteur Linky installé" options={["Non", "Oui"]} value={form.elec_compteur_linky} onChange={v => update("elec_compteur_linky", v)} colonnes={2} />
    <ChampNombre label="Conso électrique annuelle" value={form.elec_conso_annuelle} onChange={v => update("elec_conso_annuelle", v)} unit="kWh/an" step={100} />
    <Sep label="Éclairage" />
    <ChoixBoutons label="Type éclairage majoritaire" options={["LED", "Fluo compacte", "Fluo tube", "Halogène", "Mixte LED/fluo", "Mixte ancien"]} value={form.eclairage_type} onChange={v => update("eclairage_type", v)} colonnes={3} />
    <ChoixBoutons label="Détection présence / minuteries" options={["Non", "Parties communes", "Tout le bâtiment"]} value={form.eclairage_detection} onChange={v => update("eclairage_detection", v)} colonnes={3} />
  </>);
}

function SecVentilation({ form, update }) {
  return (<>
    <ChoixBoutons label="Système de ventilation" options={["VMC SF autoréglable", "VMC SF hygro A", "VMC SF hygro B", "VMC DF avec échangeur", "VMC Gaz", "Ventilation naturelle", "Aucune"]} value={form.vmc_type} onChange={v => update("vmc_type", v)} colonnes={2} required />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <ChampTexte label="Marque" value={form.vmc_marque} onChange={v => update("vmc_marque", v)} />
      <ChampNombre label="Année installation" value={form.vmc_annee} onChange={v => update("vmc_annee", v)} min={1980} step={1} />
    </div>
    <ChoixBoutons label="État VMC" options={["Fonctionnel", "Entretien nécessaire", "Dysfonctionnement", "Hors service", "Non contrôlable"]} value={form.vmc_etat} onChange={v => update("vmc_etat", v)} colonnes={2} />
    <ChoixBoutons label="Dernier entretien réalisé" options={["Non", "Oui", "Inconnu"]} value={form.vmc_entretien} onChange={v => update("vmc_entretien", v)} colonnes={3} />
  </>);
}

function SecClimatisation({ form, update }) {
  return (<>
    <ChoixBoutons label="Climatisation présente" options={["Non", "Oui"]} value={form.clim} onChange={v => update("clim", v)} colonnes={2} />
    {form.clim === "Oui" && <>
      <ChoixBoutons label="Type" options={["Split individuel", "Multi-split", "VRV/VRF", "CTA refroidissement", "Groupe froid + FC", "Climatiseur mobile"]} value={form.clim_type} onChange={v => update("clim_type", v)} colonnes={2} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <ChampNombre label="Nombre d'unités" value={form.clim_nb} onChange={v => update("clim_nb", v)} step={1} />
        <ChampNombre label="Année installation" value={form.clim_annee} onChange={v => update("clim_annee", v)} min={1990} step={1} />
      </div>
    </>}
  </>);
}

function SecPhotovoltaique({ form, update }) {
  return (<>
    <Sep label="Photovoltaïque" />
    <ChoixBoutons label="Installation PV présente" options={["Non", "Oui"]} value={form.pv} onChange={v => update("pv", v)} colonnes={2} />
    {form.pv === "Oui" && <>
      <ChampNombre label="Puissance installée" value={form.pv_puissance} onChange={v => update("pv_puissance", v)} unit="kWc" step={0.5} />
      <ChampNombre label="Année installation" value={form.pv_annee} onChange={v => update("pv_annee", v)} min={2000} step={1} />
      <ChoixBoutons label="Orientation panneaux" options={["Sud", "Sud-Est", "Sud-Ouest", "Est", "Ouest", "Toiture plate"]} value={form.pv_orientation} onChange={v => update("pv_orientation", v)} colonnes={3} />
    </>}
    <Sep label="Solaire thermique" />
    <ChoixBoutons label="Solaire thermique présent" options={["Non", "Oui"]} value={form.solaire_thermique} onChange={v => update("solaire_thermique", v)} colonnes={2} />
    {form.solaire_thermique === "Oui" && <>
      <ChampNombre label="Surface capteurs" value={form.solaire_surface} onChange={v => update("solaire_surface", v)} unit="m²" step={0.5} />
    </>}
  </>);
}

function SecETR({ form, update }) {
  return (<>
    <Sep label="Zones réglementaires (CERFA ETR)" />
    <ChoixBoutons label="Zone Radon (IRSN)" options={["1 – Faible", "2 – Moyen", "3 – Élevé"]} value={form.zone_radon} onChange={v => update("zone_radon", v)} colonnes={3} required />
    <ChoixBoutons label="Zone Sismique" options={["1 – Très faible", "2 – Faible", "3 – Modérée", "4 – Moyenne", "5 – Forte"]} value={form.zone_sismique} onChange={v => update("zone_sismique", v)} colonnes={3} required />
    <ChoixBoutons label="Zone Inondation (PPRi)" options={["Non", "Zone A – fort", "Zone B1 – moyen fort", "Zone B2 – moyen", "Zone C – faible", "À vérifier"]} value={form.zone_inondation} onChange={v => update("zone_inondation", v)} colonnes={2} />
    <ChoixBoutons label="Aléa Argile (BRGM)" options={["Faible", "Moyen", "Fort"]} value={form.zone_argile} onChange={v => update("zone_argile", v)} colonnes={3} />
    <Sep label="Réseaux" />
    <ChoixBoutons label="Réseau Gaz" options={["Non", "Oui"]} value={form.reseau_gaz} onChange={v => update("reseau_gaz", v)} colonnes={2} />
    <ChoixBoutons label="Réseau Fibre" options={["Non", "Oui – FTTH", "Oui – FTTB"]} value={form.reseau_fibre} onChange={v => update("reseau_fibre", v)} colonnes={3} />
    <ChoixBoutons label="Réseau électrique" options={["Monophasé", "Triphasé"]} value={form.reseau_elec} onChange={v => update("reseau_elec", v)} colonnes={2} />
  </>);
}

function SecANAH({ form, update }) {
  return (<>
    <Sep label="Analyse éligibilité ANAH" />
    <ChoixBoutons label="Éligibilité ANAH" options={["À vérifier", "Éligible MaPrimeRénov'", "Éligible Sérénité", "Non éligible", "Copropriété fragile"]} value={form.anah_eligible} onChange={v => update("anah_eligible", v)} colonnes={2} />
    <ChoixBoutons label="Type d'aide envisageable" options={["MaPrimeRénov' Parcours accompagné", "MaPrimeRénov' Parcours par geste", "Éco-PTZ", "CEE", "Aides locales", "Combinaison"]} value={form.anah_type} onChange={v => update("anah_type", v)} colonnes={2} />
    <ChampTexte label="Observations ANAH" value={form.anah_observations} onChange={v => update("anah_observations", v)} rows={3} placeholder="Conditions particulières, dossier à monter..." />
    <Sep label="Demande départementale" />
    <ChoixBoutons label="Dossier ANAH à monter" options={["Non", "Oui – à initier", "En cours", "Déposé"]} value={form.anah_dossier} onChange={v => update("anah_dossier", v)} colonnes={2} />
  </>);
}

function SecObservations({ form, update }) {
  return (<>
    <Sep label="Observations intérieur" />
    <ChampTexte label="Observations intérieur" value={form.observations_int} onChange={v => update("observations_int", v)} rows={4} placeholder="État général, anomalies constatées..." />
    <Sep label="Points de vigilance" />
    <ChampTexte label="Points d'attention à signaler au BET" value={form.points_vigilance} onChange={v => update("points_vigilance", v)} rows={3} placeholder="Éléments prioritaires à traiter..." />
    <ChoixBoutons label="Travaux urgents identifiés" options={["Non", "Oui"]} value={form.travaux_urgents} onChange={v => update("travaux_urgents", v)} colonnes={2} />
    {form.travaux_urgents === "Oui" && <ChampTexte label="Description des urgences" value={form.description_urgences} onChange={v => update("description_urgences", v)} rows={3} placeholder="Fuite, corrosion, danger électrique..." />}
    <Sep label="Photos complémentaires" />
    <ChampTexte label="Zones à photographier / photos prises" value={form.photos_complementaires} onChange={v => update("photos_complementaires", v)} rows={3} placeholder="Façade N, chaudière, tableau élec, étiquettes..." />
  </>);
}

function SecValidation({ form, update }) {
  const filled = Object.keys(INIT).filter(k => {
    if (k === "pieces") return form.pieces.length > 0;
    return form[k] && form[k] !== "";
  }).length;
  const pct = Math.round(filled / Object.keys(INIT).length * 100);

  return (<>
    <div style={{ background: pct >= 80 ? "#f0fdf4" : "#fffbeb", border: `2px solid ${pct >= 80 ? "#22c55e" : "#f59e0b"}`, borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "center" }}>
      <div style={{ fontSize: 40, fontWeight: 900, color: pct >= 80 ? "#16a34a" : "#d97706" }}>{pct}%</div>
      <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Formulaire complété ({filled}/{Object.keys(INIT).length} champs)</div>
      {pct < 80 && <div style={{ color: "#d97706", fontSize: 12, marginTop: 8 }}>⚠️ Recommandé : ≥ 80% avant validation</div>}
    </div>
    <ChoixBoutons label="Visite complète ?" options={["Oui", "Non – partielle"]} value={form.visite_complete} onChange={v => update("visite_complete", v)} colonnes={2} required />
    {form.visite_complete !== "Oui" && <ChampTexte label="Raison de la visite incomplète" value={form.raison_incomplete} onChange={v => update("raison_incomplete", v)} rows={2} />}
    <Sep label="Signatures" />
    <ChampTexte label="Technicien NETOM (nom)" value={form.signature_technicien} onChange={v => update("signature_technicien", v)} required />
    <ChampTexte label="Client / Contact site (nom)" value={form.signature_client} onChange={v => update("signature_client", v)} />
    <ChampTexte label="Date de remise au BET" value={form.date_rapport} onChange={v => update("date_rapport", v)} placeholder="JJ/MM/AAAA" />
  </>);
}

// ─── RAPPORT PDF ──────────────────────────────────────────────────────────────
function RapportPDF({ form, onClose }) {
  const today = new Date();
  const validite = new Date(today); validite.setFullYear(validite.getFullYear() + 5);
  const fmt = (d) => d.toLocaleDateString("fr-FR");
  const totalSurface = form.pieces.reduce((a, p) => a + (parseFloat(p.surface) || 0), 0);

  const Row = ({ label, value, alert }) => (
    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
      <td style={{ padding: "6px 12px", fontSize: 12, color: "#6b7280", width: "45%", fontWeight: 600 }}>{label}</td>
      <td style={{ padding: "6px 12px", fontSize: 12, color: alert ? RED : "#111827", fontWeight: alert ? 700 : 400 }}>{value || "—"}</td>
    </tr>
  );

  const Bloc = ({ num, title, color, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: color, color: "#fff", padding: "8px 16px", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{num}</span>
        {title}
      </div>
      <div style={{ border: `1px solid ${color}40`, borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>{children}</tbody></table>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#fff", overflowY: "auto", zIndex: 1000, fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "sticky", top: 0, background: BLUE, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="no-print">
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>📄 Rapport — {form.client_nom || "NETOM"}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.print()} style={{ background: "#fff", color: BLUE, border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🖨️ Imprimer / PDF</button>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "8px 10px", fontWeight: 700, cursor: "pointer" }}>✕</button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 80px" }}>
        {/* EN-TÊTE */}
        <div style={{ borderBottom: `3px solid ${BLUE}`, paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ background: BLUE, color: "#fff", fontWeight: 900, fontSize: 22, padding: "4px 14px", borderRadius: 4, display: "inline-block", marginBottom: 8 }}>NETOM</div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Pré-rapport de visite<br /><span style={{ fontSize: 15, fontWeight: 400, color: "#6b7280" }}>{form.type_mission}</span></h1>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280", lineHeight: 1.8 }}>
              <div style={{ color: "#111827", fontWeight: 700 }}>N° : {form.ref_mission || "—"}</div>
              <div>Date visite : {form.date_visite || "—"}</div>
              <div>Établi le : {fmt(today)}</div>
              <div style={{ color: RED, fontWeight: 700 }}>Valable jusqu'au : {fmt(validite)}</div>
            </div>
          </div>
        </div>

        {/* FICHE IDENTITÉ */}
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: BLUE, textTransform: "uppercase", marginBottom: 6 }}>Client / Bâtiment</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{form.client_nom || "—"}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{form.client_adresse}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{form.client_cp} {form.client_ville}</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{form.type_batiment} — {form.annee_construction ? form.annee_construction + "" : "—"}</div>
            {form.surface_habitable && <div style={{ fontSize: 12, color: "#6b7280" }}>Surface : {form.surface_habitable} m²</div>}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: BLUE, textTransform: "uppercase", marginBottom: 6 }}>Intervenants</div>
            <div style={{ fontSize: 12 }}><b>Technicien :</b> {form.technicien || "—"}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}><b>BET :</b> {form.bet_nom || "—"}</div>
            <div style={{ fontSize: 12 }}><b>Ingénieur :</b> {form.ingenieur_ref || "—"}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}><b>DPE :</b> {form.dpe_existant === "Oui" ? `Classe ${form.dpe_classe} (${form.dpe_annee})` : "Non disponible"}</div>
          </div>
        </div>

        {/* RELEVÉ SURFACES */}
        {form.pieces.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: "#1d4ed8", color: "#fff", padding: "8px 16px", fontWeight: 800, fontSize: 13, borderRadius: "6px 6px 0 0" }}>
              📐 Relevé des surfaces — Total : {totalSurface.toFixed(1)} m²
            </div>
            <div style={{ border: "1px solid #1d4ed840", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "left", color: "#1d4ed8", fontWeight: 800 }}>Pièce</th>
                    <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "center", color: "#1d4ed8", fontWeight: 800 }}>Surface</th>
                    <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "center", color: "#1d4ed8", fontWeight: 800 }}>Hauteur</th>
                    <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "center", color: "#1d4ed8", fontWeight: 800 }}>Orientation</th>
                    <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "right", color: "#1d4ed8", fontWeight: 800 }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {form.pieces.map((p, i) => {
                    const vol = p.surface && p.hauteur ? (parseFloat(p.surface) * parseFloat(p.hauteur)).toFixed(1) : "—";
                    return (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "7px 12px", fontSize: 12, fontWeight: 600 }}>{p.type}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, textAlign: "center", fontWeight: 700, color: "#1d4ed8" }}>{p.surface || "—"} m²</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, textAlign: "center" }}>{p.hauteur || "—"} m</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, textAlign: "center", color: "#64748b" }}>{p.orientation}</td>
                        <td style={{ padding: "7px 12px", fontSize: 12, textAlign: "right", color: "#64748b" }}>{vol} m³</td>
                      </tr>
                    );
                  })}
                  <tr style={{ background: "#eff6ff", borderTop: "2px solid #1d4ed8" }}>
                    <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 800, color: "#1d4ed8" }}>TOTAL</td>
                    <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 800, color: "#1d4ed8", textAlign: "center" }}>{totalSurface.toFixed(1)} m²</td>
                    <td colSpan={3} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAÇADES */}
        {["nord", "sud", "est", "ouest"].some(f => form[`facade_${f}_largeur`]) && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: "#0891b2", color: "#fff", padding: "8px 16px", fontWeight: 800, fontSize: 13, borderRadius: "6px 6px 0 0" }}>🧭 Relevé des façades</div>
            <div style={{ border: "1px solid #0891b240", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#ecfeff" }}>
                  {["Façade", "Largeur", "Hauteur", "Surface brute", "Matériau", "État"].map(h => (
                    <th key={h} style={{ padding: "7px 10px", fontSize: 11, color: "#0891b2", fontWeight: 800, textAlign: "center" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {["nord", "sud", "est", "ouest"].map((f, i) => {
                    const l = parseFloat(form[`facade_${f}_largeur`]);
                    const h = parseFloat(form[`facade_${f}_hauteur`]);
                    const surf = l && h ? (l * h).toFixed(1) + " m²" : "—";
                    return (
                      <tr key={f} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "7px 10px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>{f.charAt(0).toUpperCase() + f.slice(1)}</td>
                        <td style={{ padding: "7px 10px", fontSize: 12, textAlign: "center" }}>{form[`facade_${f}_largeur`] || "—"} m</td>
                        <td style={{ padding: "7px 10px", fontSize: 12, textAlign: "center" }}>{form[`facade_${f}_hauteur`] || "—"} m</td>
                        <td style={{ padding: "7px 10px", fontSize: 12, fontWeight: 700, color: "#0891b2", textAlign: "center" }}>{surf}</td>
                        <td style={{ padding: "7px 10px", fontSize: 11, textAlign: "center" }}>{form[`facade_${f}_materiau`] || "—"}</td>
                        <td style={{ padding: "7px 10px", fontSize: 11, textAlign: "center" }}>{form[`facade_${f}_etat`] || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Bloc num="1" title="Enveloppe thermique" color="#0891b2">
          <Row label="Murs extérieurs" value={`${form.murs_type || "—"}${form.murs_ep ? " – " + form.murs_ep + " cm" : ""}`} />
          <Row label="Isolation murs" value={form.murs_isolation} alert={form.murs_isolation === "Non"} />
          {form.murs_isolation !== "Non" && <Row label="Isolant murs" value={`${form.murs_iso_type || "—"}${form.murs_iso_ep ? " – " + form.murs_iso_ep + " cm" : ""}`} />}
          <Row label="Toiture / Combles" value={`${form.toiture_type || "—"} — ${form.combles_type || "—"}`} />
          <Row label="Isolation toiture" value={form.toiture_isolation} alert={form.toiture_isolation === "Non"} />
          {form.toiture_isolation !== "Non" && <Row label="Isolant toiture" value={`${form.toiture_iso_type || "—"}${form.toiture_iso_ep ? " – " + form.toiture_iso_ep + " cm" : ""}`} />}
          <Row label="Plancher bas" value={form.plancher_type} />
          <Row label="Isolation plancher" value={form.plancher_isolation} alert={form.plancher_isolation === "Non"} />
          <Row label="Vitrage" value={form.vitrage_type} />
          <Row label="Chassis" value={`${form.chassis_type || "—"} – ${form.chassis_etat || "—"}`} />
          {form.nb_fenetres && <Row label="Nb fenêtres / Surface vitrée" value={`${form.nb_fenetres} fenêtres – ${form.surface_vitree_totale || "?"} m²`} />}
        </Bloc>

        <Bloc num="2" title="Équipements techniques" color="#d97706">
          <Row label="Chauffage" value={`${form.ch_type || "—"} – ${form.ch_energie || "—"}`} />
          <Row label="Marque / Modèle / Année" value={`${form.ch_marque || "—"} ${form.ch_modele || ""} (${form.ch_annee || "?"})`} />
          <Row label="Puissance / Rendement" value={`${form.ch_puissance || "?"} kW – ${form.ch_rendement || "?"} %`} />
          <Row label="Régulation" value={form.ch_regulation} />
          <Row label="Robinets thermostatiques" value={form.ch_rbt} />
          <Row label="Contrat entretien" value={form.ch_contrat_entretien} alert={form.ch_contrat_entretien === "Non"} />
          <Row label="ECS" value={`${form.ecs_type || "—"} – ${form.ecs_energie || "—"}${form.ecs_volume ? " – " + form.ecs_volume + " L" : ""}`} />
          <Row label="Calorifugeage ECS" value={form.ecs_calorifuge} alert={form.ecs_calorifuge === "Non"} />
          <Row label="Ventilation" value={`${form.vmc_type || "—"} – ${form.vmc_etat || "—"}`} />
          <Row label="Climatisation" value={form.clim} />
          {form.pv === "Oui" && <Row label="Photovoltaïque" value={`${form.pv_puissance || "?"} kWc (${form.pv_annee || "?"})`} />}
          {form.solaire_thermique === "Oui" && <Row label="Solaire thermique" value={`${form.solaire_surface || "?"} m²`} />}
        </Bloc>

        <Bloc num="3" title="ETR – Zones réglementaires" color="#dc2626">
          <Row label="Zone Radon (IRSN)" value={form.zone_radon} />
          <Row label="Zone Sismique" value={form.zone_sismique} />
          <Row label="Zone Inondation (PPRi)" value={form.zone_inondation} />
          <Row label="Aléa Argile (BRGM)" value={form.zone_argile} />
          <Row label="Réseau Gaz" value={form.reseau_gaz} />
          <Row label="Réseau Fibre" value={form.reseau_fibre} />
          <Row label="Compteur électrique" value={form.elec_type} />
          <Row label="Conso élec annuelle" value={form.elec_conso_annuelle ? form.elec_conso_annuelle + " kWh/an" : "—"} />
          <Row label="Conso gaz annuelle" value={form.conso_gaz ? form.conso_gaz + " kWh/an" : "—"} />
        </Bloc>

        <Bloc num="4" title="Analyse ANAH & Aides" color="#7c3aed">
          <Row label="Éligibilité ANAH" value={form.anah_eligible} />
          <Row label="Type d'aide envisageable" value={form.anah_type} />
          <Row label="DTA Amiante" value={form.amiante_dta} alert={form.amiante_dta === "Non"} />
          <Row label="CREP Plomb" value={form.plomb_crep} />
          <Row label="DPE" value={form.dpe_existant === "Oui" ? `Classe ${form.dpe_classe} (${form.dpe_annee})` : "Non disponible"} alert={form.dpe_existant === "Non"} />
        </Bloc>

        {(form.observations_int || form.points_vigilance || form.travaux_urgents === "Oui") && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: "#16a34a", color: "#fff", padding: "8px 16px", fontWeight: 800, fontSize: 13, borderRadius: "6px 6px 0 0" }}>
              <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, marginRight: 8 }}>5</span>
              Observations terrain
            </div>
            <div style={{ border: "1px solid #16a34a40", borderTop: "none", borderRadius: "0 0 6px 6px", padding: 16 }}>
              {form.observations_int && <><div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", marginBottom: 4 }}>Observations intérieur</div><div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, marginBottom: 10, whiteSpace: "pre-wrap" }}>{form.observations_int}</div></>}
              {form.points_vigilance && <><div style={{ fontSize: 11, fontWeight: 700, color: "#d97706", textTransform: "uppercase", marginBottom: 4 }}>Points de vigilance</div><div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, marginBottom: 10, whiteSpace: "pre-wrap" }}>{form.points_vigilance}</div></>}
              {form.travaux_urgents === "Oui" && form.description_urgences && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 4 }}>⚠️ TRAVAUX URGENTS</div><div style={{ fontSize: 12, color: "#374151", whiteSpace: "pre-wrap" }}>{form.description_urgences}</div></div>}
            </div>
          </div>
        )}

        <Bloc num="6" title="Validation & Signatures" color="#0d9488">
          <Row label="Visite complète" value={form.visite_complete} />
          {form.raison_incomplete && <Row label="Raison incomplète" value={form.raison_incomplete} alert />}
          <Row label="Date remise BET" value={form.date_rapport} />
          <Row label="Technicien NETOM" value={form.signature_technicien} />
          <Row label="Client / Contact" value={form.signature_client} />
        </Bloc>

        {/* PIED */}
        <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div><div style={{ fontWeight: 800, color: BLUE, fontSize: 14 }}>NETOM</div><div style={{ fontSize: 11, color: "#9ca3af" }}>Assistant de Bureau d'Études · Audit Énergétique & ETR</div></div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#9ca3af" }}><div>Relevé terrain préliminaire — à valider par l'ingénieur certifié RGE</div><div>Généré le {fmt(today)}</div></div>
        </div>
      </div>
      <style>{`@media print { .no-print { display: none !important; } @page { margin: 15mm; size: A4; } }`}</style>
    </div>
  );
}

// ─── LISTE DES SECTIONS ───────────────────────────────────────────────────────
const LISTE_SECTIONS = [
  { id: "infos_client", label: "Informations client & projet", icon: "👤", color: BLUE, component: SecInfosClient },
  { id: "projet", label: "Mission & Technicien", icon: "📋", color: BLUE, component: SecProjet },
  { id: "exterieur", label: "1. Tour rapide extérieur", icon: "🏠", color: BLUE, component: SecExterieur },
  { id: "documentaire", label: "2. Étude documentaire", icon: "📂", color: BLUE, component: SecDocumentaire },
  { id: "logement", label: "3. Informations sur le logement", icon: "📐", color: BLUE, component: SecLogement },
  { id: "demande_anah", label: "Demande départementale ANAH", icon: "🏛️", color: BLUE, component: SecANAH },
  { id: "chauffage", label: "4. 🔥 Chauffage principal", icon: "🔥", color: BLUE, component: SecChauffage },
  { id: "ecs", label: "5. Eau chaude sanitaire", icon: "🚿", color: BLUE, component: SecECS },
  { id: "elec", label: "6. Compteur électrique", icon: "⚡", color: BLUE, component: SecElec },
  { id: "plancher", label: "7. Plancher bas", icon: "⬛", color: BLUE, component: SecVitrage },
  { id: "facades", label: "8. 🧱 Murs extérieurs & Façades", icon: "🧱", color: BLUE, component: SecFacades },
  { id: "toiture", label: "9. Combles / Toiture", icon: "🏗️", color: BLUE, component: SecToiture },
  { id: "ventilation", label: "10. Ventilation", icon: "💨", color: BLUE, component: SecVentilation },
  { id: "clim", label: "11. Climatisation", icon: "❄️", color: BLUE, component: SecClimatisation },
  { id: "pv", label: "12. Photovoltaïque / Solaire thermique", icon: "☀️", color: BLUE, component: SecPhotovoltaique },
  { id: "etr", label: "13. 📋 Analyse ETR", icon: "📋", color: BLUE, component: SecETR },
  { id: "observations", label: "Relevés à vérifier & observations", icon: "📝", color: BLUE, component: SecObservations },
  { id: "validation", label: "Fin de parcours avec client", icon: "✅", color: BLUE, component: SecValidation },
];

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function PreChantier() {
  const [form, setForm] = useState({ ...INIT, pieces: [] });
  const [ouvert, setOuvert] = useState(null);
  const [showPDF, setShowPDF] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const rempliCount = (secId) => {
    const sec = LISTE_SECTIONS.find(s => s.id === secId);
    return sec ? "●" : "";
  };

  if (showPDF) return <RapportPDF form={form} onClose={() => setShowPDF(false)} />;

  return (
    <div style={{ background: BLUE_DARK, minHeight: "100svh", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: BLUE_DARK, padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: WHITE, color: BLUE_DARK, fontWeight: 900, fontSize: 16, padding: "4px 10px", borderRadius: 4 }}>NETOM</div>
            <div style={{ color: WHITE, fontSize: 13, fontWeight: 700 }}>Pré-audit terrain</div>
          </div>
          <button onClick={() => setShowPDF(true)} style={{
            background: WHITE, color: BLUE_DARK, border: "none", borderRadius: 8,
            padding: "8px 14px", fontSize: 12, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>📄 PDF</button>
        </div>
      </div>

      {/* LISTE ACCORDÉON style Kizeo */}
      <div style={{ padding: "8px 0 80px" }}>
        {LISTE_SECTIONS.map((sec) => {
          const isOpen = ouvert === sec.id;
          const Comp = sec.component;
          return (
            <div key={sec.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {/* EN-TÊTE SECTION */}
              <button onClick={() => setOuvert(isOpen ? null : sec.id)} style={{
                width: "100%", background: "transparent", border: "none",
                padding: "18px 20px", display: "flex", justifyContent: "space-between",
                alignItems: "center", cursor: "pointer", textAlign: "left"
              }}>
                <span style={{ color: WHITE, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
                  {sec.label}
                  {sec.label.includes("*") && <span style={{ color: RED }}> *</span>}
                </span>
                <span style={{
                  color: WHITE, fontSize: 28, fontWeight: 300, lineHeight: 1,
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s", display: "inline-block", width: 28, textAlign: "center"
                }}>+</span>
              </button>

              {/* CONTENU SECTION */}
              {isOpen && (
                <div style={{ background: WHITE, padding: 20, borderTop: `3px solid ${BLUE_LIGHT}` }}>
                  <Comp form={form} update={update} />
                  <button onClick={() => setOuvert(null)} style={{
                    width: "100%", marginTop: 12, padding: "12px", background: BLUE,
                    color: WHITE, border: "none", borderRadius: 8, fontSize: 14,
                    fontWeight: 800, cursor: "pointer"
                  }}>✓ Valider cette section</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOUTON PDF BAS */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: BLUE_DARK, borderTop: "1px solid rgba(255,255,255,0.2)",
        padding: "12px 16px", display: "flex", gap: 8
      }}>
        <button style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.1)", color: WHITE, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🔒 Verrouiller
        </button>
        <button style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.1)", color: WHITE, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          📋 Brouillon
        </button>
        <button onClick={() => setShowPDF(true)} style={{ flex: 1, padding: 12, background: WHITE, color: BLUE_DARK, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
          📤 Transférer
        </button>
      </div>
    </div>
  );
}
