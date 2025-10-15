import React from 'react'

function LetterTitle({children}) {
    const sep_title = children.split("")
  return (
    <h2 className='titulo-grande titulo-individual'>{sep_title.map((e,i) => (<span key={i}>{e}</span>))}</h2>
  )
}

export default LetterTitle