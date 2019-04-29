// Imports correspondant à différents exports dans leurs composants
import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'
import './App.css'
import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'
import PropTypes from 'prop-types'
import HighScoreInput from './HighScoreInput'

// Nb de paire de carte
const SIDE = 6
// Différent symbole choisit par paire
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
// Temps d'affichage des 2 cartes retourner
const VISUAL_PAUSE_MSECS = 1000

class App extends Component {

  // Initialisation de l'état local du composant App
  state = {
    cards: this.generateCards(),
    // Tableau représentant la paire en cours de sélection
    // par le joueur. À vide, aucune sélection en cours.
    // Un élément signifie qu’une première carte a été retournée.
    // Deux éléments signifient qu’on a retourné une seconde carte,
    // ce qui déclenchera une analyse de la paire et l’avancée éventuelle
    // de la partie.
    currentPair: [],
    // nombre de tentatives de la partie en cours 
    guesses: 0,
    //  liste les positions des cartes appartenant aux paires déjà réussies,
    // et donc visibles de façon permanente
    matchedCardIndices: [],
    HallOfFame: null,
  }

  // Methode qui génére des paires de cartes aléatoirements
  generateCards() {
    // initialisation d'un tableau vide qui récupérera les 36 cartes choisi
    const result = []
    // constante qui double le nombre de cartes
    const size = SIDE * SIDE
    // constante qui récupère de manière aléatoire un symbole
    const candidates = shuffle(SYMBOLS)

    // On boucle sur le tableau résult
    while (result.length < size) {
      // à chaque tour de boucle, on récupère un élément aléatoirement
      // puis on le supprime pour ne pas l'avoir en plusieurs fois
      const card = candidates.pop()
      // on rajoute l'élément récupéré que l'on rajoute dans le tableau result
      result.push(card, card)
    }
    // On récupére le tableau result généré et on mélange ses éléments
    return shuffle(result)
  }

  // Méthode qui cache toutes les cartes
  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)
    
    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }
  
    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }
  
    return indexMatched ? 'visible' : 'hidden'
  }

  // Méthode qui réagit au click sur une carte
  // Utilisation d'une fonction fléché pour garantir le this
  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  // Méthode qui gère l'affichage des 2 cartes en même temps
  // en fonction de si elles sont identiques ou non
  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  // Arrow fx for binding
  displayHallOfFame = (hallOfFame) => {
    this.setState({ hallOfFame })
  }

  // Methode pour l'affichage sur le navigateur
  render() {
    const { cards, guesses, hallOfFame, matchedCardIndices } = this.state
    const won = matchedCardIndices.length === 4 //cards.length
    // Résultat de la constante
    return (
      // Génère une div dans le DOM
      <div className="memory">
        {/* Affichage du Nb de tentative */}
        <GuessCount guesses={guesses} />
        {/* On boucle sur le tableau grâce à map */}
        {cards.map((card, index) => (
          <Card
            //* Affichage de la carte
            card={card}
            // état d'affichage de la carte
            // fait appel à la methode plus haut
            feedback={this.getFeedbackForCard(index)}
            // Avec key et la donnée unique par card (index), on s'assure
            // de la cohérence des données et on optimise la retranscription
            // dans le DOM des changements de données d'origine
            key={index}
            index={index}
            // Affectation de l'évènement sur chacune des cartes
            onClick={this.handleCardClick}
          />
        ))}
        {/* Affichage des résultats des différentes parties */}
        {
          won &&
            // Si hallOfFame est true
            (hallOfFame ? (
              // Alors on affiche le taleau de score
              <HallOfFame entries={hallOfFame} />
            ) : (
              // Sinon on entre ses informations pour les ajouter au tableau
              <HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />
            ))
        }
      </div>
    )
  }
}

  // Typage des props
  Card.propTypes = {
    card: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
      'hidden',
      'justMatched',
      'justMismatched',
      'visible',
    ]).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }

// Ne pas oublier d'exporter la class App pour quelle soit visible dans les autres composants
export default App