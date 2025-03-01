import React from 'react';

export default function ControlButtons({ onPrev, onNext, onViewMore, color = '#ff0000', clickSoundRef, planetSoundRef }) {
    const buttonStyle = {
        fontSize: '24px',
        background: 'none',
        border: `2px solid ${color}`,
        color: color,
        cursor: 'pointer',
        padding: '12px 20px',
        borderRadius: '20px',
        boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
        transition: 'all 0.3s ease',
        textShadow: `0 0 3px ${color}`,
    };

    const handleMouseOver = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
        e.currentTarget.style.textShadow = `0 0 5px ${color}`;
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        e.currentTarget.style.textShadow = `0 0 3px ${color}`;
    };

    const handleClick = (callback, soundRef) => {
        if (soundRef.current) {
            soundRef.current.play();
        }
        callback();
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '32px',
                pointerEvents: 'auto',
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000, // Asegúrate de que esté por encima de otros elementos
            }}
        >
            <button
                style={buttonStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={() => handleClick(onPrev, clickSoundRef)}
            >
                ⟵
            </button>
            <button
                style={buttonStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={() => handleClick(onViewMore, planetSoundRef)}
            >
                Ver más
            </button>
            <button
                style={buttonStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onClick={() => handleClick(onNext, clickSoundRef)}
            >
                ⟶
            </button>
        </div>
    );
}