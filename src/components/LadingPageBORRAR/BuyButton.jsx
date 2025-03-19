import React from 'react';

export default function BuyButton({ onClick }) {
    return (
        <button
            style={{
                fontSize: '24px',
                background: 'none',
                border: '2px solid #FFFFFF',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '12px 40px',
                borderRadius: '12px',
                boxShadow: '0 0 5px #FFFFFF, 0 0 10px #FFFFFF',
                transition: 'all 0.3s ease',
                textShadow: '0 0 3px #FFFFFF',
                marginTop: '10px',
                pointerEvents: 'auto',
            }}
            onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 10px #FFFFFF, 0 0 20px #FFFFFF';
                e.target.style.textShadow = '0 0 5px #FFFFFF';
            }}
            onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 0 5px #FFFFFF, 0 0 10px #FFFFFF';
                e.target.style.textShadow = '0 0 3px #FFFFFF';
            }}
            onClick={onClick}
        >
            Comprar
        </button>
    );
}