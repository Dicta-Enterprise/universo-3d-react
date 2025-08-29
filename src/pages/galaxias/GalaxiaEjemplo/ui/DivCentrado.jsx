import React from 'react';

export default function DivCentrado({ title, children }) {
  return (
    <div className="div-centrado">
      <h1>{title}</h1>
      {children}
    </div>
  );
}