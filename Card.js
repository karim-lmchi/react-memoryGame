import React from 'react'

import './Card.css'

const HIDDEN_SYMBOL = '❓'

/* Le Composant Card est constitué de plusieurs props 
    qui s'implémentent au fur et à mesure,
    card qui est ce qu'affiche notre carte et feedback qui
    est l'état de notre carte (masquée ou affichée) */
const Card = ({ card, feedback, index, onClick }) => (
    <div className={`card ${feedback}`} onClick={() => onClick(index)}>
      <span className="symbol">
        {/* Si la condition est true alors on affiche le ?
            Sinon (false) on affiche la carte */}
        {feedback === 'hidden' ? HIDDEN_SYMBOL : card}
      </span>
    </div>
  )

// Ne pas oublier d'exporter la classe Card
export default Card