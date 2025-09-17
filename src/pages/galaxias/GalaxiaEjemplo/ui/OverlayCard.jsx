import React from "react";

function OverlayCard({p, i, peligro}) {
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
  return (
    <div key={i} className={peligro?"overlay-card overlay-card-peligro":"overlay-card"}>
      {p.nombre && <h3 className="overlay-card-title" style={{fontSize:"20px"}}>{p.nombre}</h3>}
      {p.descripcion && <p className="overlay-card-text">{p.descripcion}</p>}
    <br />
      {"nivelRiesgo" in p && (
        <div className={"overlay-riesgo riesgo-"+p.nivelRiesgo.split(" ")[1]}>
          
        </div>
      )}
      {/**<p className="overlay-card-text">
          <b>Nivel:</b> {p.nivelRiesgo}
        </p> */}
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
  );
}

export default OverlayCard;
