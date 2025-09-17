// OverlayLanding.jsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./ui/OverlayLanding.css"; // asegúrate de que el archivo exista en ./ui/
import RotatingPlanet from "./ui/RotatingPlanet";
import DivCentrado from "./ui/DivCentrado";
import Visualizer from "./ui/3dVisualizer";
import OverlayCard from "./ui/OverlayCard";

export default function OverlayLanding({
  open,
  onClose,
  planeta,
  color = "#62d4ff",
}) {
  const [mounted, setMounted] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(200);

  const [overlayStyles, setOverlayStyles] = useState("overlay-container-img");

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

  const handleScroll = (e) => {
    var maxScroll = e.target.scrollHeight - e.target.clientHeight;
    const position = e.target.scrollTop;
    setScroll(position);
    setMaxScroll(maxScroll);

    if (position > 1477) {
      setOverlayStyles("overlay-container-color");
    } else {
      setOverlayStyles("overlay-container-img");
    }
  };

  useEffect(() => {
    if (mounted) return;
    console.log("textura: ");
    console.log(planeta);
    setMounted(true);
    
  });

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
  return createPortal(
    <div className="overlay-backdrop" onClick={handleBackdropClick}>
      <div
        className={"overlay-container " + overlayStyles}
        onClick={stop}
        onScroll={(e) => handleScroll(e)}
      >
        {/* Hero */}
        <div className="overlay-hero">
          {/*<img src={planeta?.imagenResumen} alt={planeta?.planetaNombre ?? "Planeta"} />*/}
          <div className="overlay-hero-gradient" />
          <button className="overlay-close" onClick={onClose}>
            &lt; Volver
          </button>
        </div>
        <section>
          <div
            className="div-centered div-full-height"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h2 className="overlay-huge-title" style={{textAlign:"center"}}>{planeta?.planetaNombre}</h2>
            <p className="texto texto-centrado" style={{ margin: "0 5rem" }}>
              {planeta?.resumenCurso}
            </p>
          </div>
        </section>

        <section id="overlay-sec-benefs">
          <div className="div-two-part-dif div-full-height" id="overlay-astronauta">
            <div className="div-full-height">
              <Visualizer
                color={color}
                modelo="/assets/planeta_astronauta/scene.gltf"
                pos={{ x: 0, y: -2, z: -3 }}
                intensidad_luz={2}
              ></Visualizer>
            </div>
            <div className="div-full-height">
              {/* Beneficios */}
              <h2 className="overlay-big-title">Beneficios</h2>
              <div className="overlay-grid-cols">
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
            </div>
          </div>
        </section>
        <section style={{ position: "relative" }}>
          <div className="overlay-separator"></div>
          <div className="div-mid-height overlay-danger">
            <h2 className="overlay-big-title">Peligros</h2>
            <div className="overlay-grid-cols">
              {peligros.map((p, i) => (
                <OverlayCard key={i} p={p} i={i} peligro={true}></OverlayCard>
              ))}
            </div>
            <img id="overlay-prof" src="/assets/prof.png" alt="" />
          </div>
        </section>
        <section>
          <div
            className="div-three-part"
            style={{ position: "relative", maxHeight: "60vh" }}
          >
            <div className="div-max-height" style={{ position: "relative" }}>
              {/**<button className="overlay-comprar">Comprar</button> */}
              <div className="overlay-planet-comprar">
                <RotatingPlanet
                  width={1000}
                  height={800}
                  textureUrl={planeta?.textura}
                />
              </div>
            </div>
            <div className="div-max-height" id="overlay-comprar-3d" style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <h2 className="overlay-big-title" style={{lineHeight:"normal", textAlign:"center"}}>{planeta?.planetaNombre}</h2>
              <button className="overlay-comprar">Comprar</button>
              {/**<Visualizer
                modelo="/assets/planeta_perro_espacial/scene.gltf"
                pos={{ x: 10, y: -5, z: -15 }}
                rot={{ x: 0, y: -45, z: 0 }}
              ></Visualizer> */}
            </div>
            
            <div className="overlay-trazos"></div>
          </div>
        </section>

        <div className="div-centered div-planeta">
          <div
            id="overlay-planet-view"
            style={{ transform: "translateY(" + (scroll / 2 + 100) + "px)" }}
          >
            <RotatingPlanet
              width={1400}
              height={800}
              textureUrl={planeta?.textura}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
