// TarjetaConfirmacion.js
import React from 'react';

export default function TarjetaConfirmacion({ title, onConfirm, onClose }) {
  return (
    <div className="tarjeta-confirmacion">
      <div className="tarjeta-contenido">
        <h2>{title}</h2>
        <div className="botones">
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
