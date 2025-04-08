//Este componente es para las galaxias
import React from 'react';

export default function CentralText({ selectedGalaxy, onConfirm }) {
    const colors = ['#FF746C', '#cc99ff', '#69b6d9', '#55DDBB'];
    const galaxyIndex = selectedGalaxy ? selectedGalaxy.index : -1;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 38, 44, 0.5)',
            padding: '20px',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '400px',
            border: galaxyIndex !== -1 ? `2px solid ${colors[galaxyIndex]}` : '2px solid transparent',
            zIndex: 1000,
        }}>
            <p>{selectedGalaxy ? `Iremos a ${selectedGalaxy.title}, ¿Correcto?` : "¿A dónde vamos a ir hoy? <> (Seleccione una de las siguientes galaxias)"}</p>
            {selectedGalaxy && (
                <button
                    style={{
                        marginTop: '10px',
                        padding: '12px 25px',
                        backgroundColor: colors[galaxyIndex],
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                    }}
                    onClick={onConfirm} // para de que esté conectado
                >
                    Confirmar
                </button>
            )}
        </div>
    );
}