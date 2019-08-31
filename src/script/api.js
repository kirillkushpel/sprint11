// Получение и отправка на сервер имени пользователя, получение карточек с сервера
import {options} from './options.js'


class Api {
// можно лучше:  нет понимания за что отвечают некоторые переменные
  constructor ({ host, cohort, token, contentType }) {
    this.baseURL = `${host}/${cohort}`
    this.headers = {
      authorization: token,
      'Content-Type': contentType
    }
  }
  getInitialCards () {
    return fetch(`${this.baseURL}/cards`, {
      headers: this.headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
      })
      .then((result) => {
        if (result) {
          return result
        }
        return Promise.reject(`Ошибка: нет данных`)
      })
      .catch((err) => {
        // alert('Что-то пошло не так :(, ошибка' + err)
        // console.log лучше всего убрать, он нужен только для разработки, пользователи его не видят
        console.log(options)
      })
  }
  loadUserInfo () {
    fetch(`${this.baseURL}/users/me`, {
      headers: this.headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .then((result) => {
        if (result) {
          document.querySelector('.user-info__name').textContent = result.name
          document.querySelector('.user-info__job').textContent = result.about
        } else {
          return Promise.reject(`Нет данных`)
        }
      })
  }
  editUserInfo (name, about) {
    return fetch(`${this.baseURL}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
  }
}

export const api = new Api(options)
