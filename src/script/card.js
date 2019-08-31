// Создание, удаление и "лайк" карточки

class Card {
  constructor (name, link) {
    this.card = { name, link }
    this.removeCard = this.removeCard.bind(this)
    this.container = document.querySelector('.places-list')
  }

  createCard () {
    const theCard = document.createElement('div')
    const cardImageElement = document.createElement('div')
    const deleteIconElement = document.createElement('button')
    const cardDescription = document.createElement('div')
    const cardName = document.createElement('h3')
    const likeIcon = document.createElement('button')

    theCard.classList.add('place-card')

    cardImageElement.classList.add('place-card__image')
    cardImageElement.setAttribute('imageURL', this.card.link)
    cardImageElement.style.backgroundImage = `url(${this.card.link})`

    deleteIconElement.classList.add('place-card__delete-icon')
    cardImageElement.appendChild(deleteIconElement)

    cardDescription.classList.add('place-card__description')

    cardName.classList.add('place-card__name')
    cardName.textContent = this.card.name

    likeIcon.classList.add('place-card__like-icon')

    cardDescription.appendChild(cardName)
    cardDescription.appendChild(likeIcon)

    theCard.appendChild(cardImageElement)
    theCard.appendChild(cardDescription)

    this.container.appendChild(theCard)

    theCard.querySelector('.place-card__delete-icon').addEventListener('click', this.removeCard)
    theCard.querySelector('.place-card__like-icon').addEventListener('click', this.likeCard)
  }

  removeCard (event) {
    this.container.removeChild(event.target.closest('.place-card'))
    document.querySelector('.place-card__like-icon').removeEventListener('click', this.removeCard)
  }

  likeCard (event) {
    event.target.classList.toggle('place-card__like-icon_liked')
  }
}

export default Card
