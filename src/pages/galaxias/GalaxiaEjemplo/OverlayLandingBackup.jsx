import React from 'react'

function OverlayLandingBackup() {
  return (
    <div>
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
  )
}

export default OverlayLandingBackup