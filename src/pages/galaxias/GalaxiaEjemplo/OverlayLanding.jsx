// OverlayLanding.jsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./ui/OverlayLanding.css"; // asegúrate de que el archivo exista en ./ui/
import RotatingPlanet from './ui/RotatingPlanet'

export default function OverlayLanding({
  open,
  onClose,
  planeta,
  color = "#62d4ff",
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    console.log("textura: ")
    console.log(planeta)
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const handleBackdropClick = () => onClose?.();
  const stop = (e) => e.stopPropagation();

  const InfoItem = ({ label, value }) => (
    <div className="overlay-info-item">
      <span className="overlay-info-label">{label}</span>
      <span className="overlay-info-value">{value ?? "-"}</span>
    </div>
  );

  // Helpers: resumen seguro + campos extra genéricos
  const renderResumen = () => {
    const val = planeta?.resumenCurso;
    if (!val) return null;

    if (typeof val !== "string") return <div>{val}</div>;

    const str = val.trim();
    const hasDangerous =
      /<(script|style|link|iframe|meta|head|html|body|form|input|button)[\s>]/i.test(
        str
      );
    const hasLayoutTags = /<\/?(section|article|header|footer|main)[\s>]/i.test(
      str
    );

    if (hasDangerous || hasLayoutTags) {
      return (
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {str.replace(/<[^>]+>/g, "")}
        </pre>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: str }} />;
  };

  const labelize = (k = "") =>
    k
      .replace(/[_\-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  const ExtraFields = ({ obj, exclude = [] }) => {
    if (!obj || typeof obj !== "object") return null;
    const entries = Object.entries(obj).filter(
      ([k, v]) =>
        !exclude.includes(k) && v !== undefined && v !== null && v !== ""
    );
    if (!entries.length) return null;
    return entries.map(([k, v]) => (
      <p key={k} className="overlay-card-text">
        <b>{labelize(k)}:</b> {String(v)}
      </p>
    ));
  };

  // Normaliza arrays por si llegaran como objeto
  const beneficios = Array.isArray(planeta?.beneficios)
    ? planeta.beneficios
    : planeta?.beneficios
    ? Object.values(planeta.beneficios)
    : [];

  const peligros = Array.isArray(planeta?.peligros)
    ? planeta.peligros
    : planeta?.peligros
    ? Object.values(planeta.peligros)
    : [];

  return createPortal(
    <div className="overlay-backdrop" onClick={handleBackdropClick}>
      <div className="overlay-container" onClick={stop}>
        {/* Hero */}
        <div className="overlay-hero">
          {/*<img src={planeta?.imagenResumen} alt={planeta?.planetaNombre ?? "Planeta"} />*/}
          <div className="overlay-hero-gradient" />
          <button className="overlay-close" onClick={onClose}>
            &lt;  Volver
          </button>
          
        </div>
        {/* Resumen */}
        <section className="overlay-section" id="overlay-titulo-resumen">
          <h1 className="overlay-title">{planeta?.planetaNombre}</h1>
          {/*<h2 className="overlay-heading">Resumen del Curso</h2>*/}
          {renderResumen()}
        </section>
        {/* beneficios y peligros */}
        <div id="overlay-beneficios-peligros">
          {/* Beneficios */}
          {!!beneficios.length && (
            <section className="overlay-section">
              <h2 className="overlay-heading">Beneficios</h2>
              {/* Beneficios
            {planeta?.imagenBeneficios && (
              <div className="overlay-beneficios-hero">
                <img src={planeta.imagenBeneficios} alt="Beneficios" />
              </div>
            )} */}

              <div className="overlay-grid-rows">
                {beneficios.map((b, i) => (
                  <div key={i} className="overlay-card">
                    {b.titulo && (
                      <h3 className="overlay-card-title">{b.titulo}</h3>
                    )}
                    {b.descripcion && (
                      <p className="overlay-card-text">{b.descripcion}</p>
                    )}
                    <ExtraFields obj={b} exclude={["titulo", "descripcion"]} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Peligros */}
          {!!peligros.length && (
            <section className="overlay-section" style={{width: "100%"}}>
              <h2 className="overlay-heading">Peligros</h2>
              <div className="overlay-grid-cols">
                {peligros.map((p, i) => (
                  <div key={i} className="overlay-card">
                    {p.nombre && (
                      <h3 className="overlay-card-title">{p.nombre}</h3>
                    )}
                    {p.descripcion && (
                      <p className="overlay-card-text">{p.descripcion}</p>
                    )}

                    {"nivelRiesgo" in p && (
                      <p className="overlay-card-text">
                        <b>Nivel:</b> {p.nivelRiesgo}
                      </p>
                    )}
                    {"temperatura" in p && (
                      <p className="overlay-card-text">
                        <b>Temperatura:</b> {p.temperatura}
                      </p>
                    )}
                    {"villano" in p && (
                      <p className="overlay-card-text">
                        <b>Villano:</b> {p.villano}
                      </p>
                    )}

                    <ExtraFields
                      obj={p}
                      exclude={[
                        "nombre",
                        "descripcion",
                        "nivelRiesgo",
                        "temperatura",
                        "villano",
                        "cta",
                      ]}
                    />

                    {p.cta && (
                      <div className="overlay-cta">
                        <button type="button" onClick={() => onClose?.()}>
                          {p.cta}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="overlay-bottom">
          <div id="overlay-planet-view"><RotatingPlanet width={1500} height={800} textureUrl={"/public/assets/2k_mars.jpg"}/></div>
          <button>Comprar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
