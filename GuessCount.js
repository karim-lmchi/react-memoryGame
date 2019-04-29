import React from 'react'
import './GuessCount.css'
import PropTypes from 'prop-types'

// Il s'agit là d'un compteur de tentative
const GuessCount = ({ guesses }) => <div className="guesses">{guesses}</div>

GuessCount.propTypes = {
    guesses: PropTypes.number.isRequired,
  }

export default GuessCount