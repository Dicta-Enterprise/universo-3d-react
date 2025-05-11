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
                    fontSize: '40px',
                    textAlign: 'center',
                    pointerEvents: 'auto',
                    position: 'absolute',
                    left: '50%',
                    top: '5%',
                    transform: 'translate(-50%, 0%)',
                }}
            >
                {title}
            </h1>
            {children} {/* Renderiza los hijos aquí */}
        </div>
    );
}