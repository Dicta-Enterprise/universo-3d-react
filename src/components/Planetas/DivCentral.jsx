import React from 'react';

export default function DivCentral({ title, children }) {
    return (
        <div
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pointerEvents: 'none',
            }}
        >
            <h1
                style={{
                    fontSize: 'clamp(28px, 7.5vw, 40px)',
                    lineHeight: 1.1,
                    textAlign: 'center',
                    textWrap: 'balance',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0 16px',
                    margin: 0,
                    top: 'clamp(64px, 8vh, 110px)', // debajo de la fila superior (botón volver + iconos)
                }}
            >
                {title}
            </h1>
            {children} {/* Renderiza los hijos aquí */}
        </div>
    );
}