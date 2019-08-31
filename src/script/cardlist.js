// Добавление загруженных и пользовательких карточек на страницу  и их отрисовка

import {api} from './api.js'
import {popup} from './popup.js'
import Card from './card.js'
import disablePopUpButton from './disablepopupbutton.js'
const popUpDialog = document.querySelector('#add-new-card')
const submitFormButton = popUpDialog.querySelector('.popup__button')

export default class CardList {
  constructor () {
    this.render()
  }

  addCard (name, link) {    
    const card = new Card(name, link)
    card.createCard()    
  }

  render () {
    const closeButtonArray = document.querySelectorAll('.popup__close')

    closeButtonArray.forEach(function (elem) {
      elem.addEventListener('click', function (event) {
        popup.close(event)
      })
    })

    api.loadUserInfo()
    api.getInitialCards()
      .then((res) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            this.addCard(res[i].name, res[i].link)
          }
        }
      })
      .catch((err) => {
        alert('Что-то пошло не так :(, ошибка' + err)
      })

    document.querySelector('.user-info__button').addEventListener('click', function (event) {
      popup.open(event)
    })

    document.querySelector('.places-list').addEventListener('click', function (event) {
      popup.open(event)
    })

    disablePopUpButton(submitFormButton)
  }
}
