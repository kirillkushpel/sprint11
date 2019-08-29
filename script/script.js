"use strict";

// Объявляем классы


//Получение и отправка на сервер имени пользователя, получение карточек с сервера 

class Api {
    constructor({ host, cohort, token, contentType, }) {
        this.baseURL = `${host}/${cohort}`;
        this.headers = {
            authorization: token,
            'Content-Type': contentType
        }
    }
    getInitialCards() {
        return fetch(`${this.baseURL}/cards`, {
            headers: this.headers
        })            
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((result) => {
                if (result) {
                    return result;
                }
                return Promise.reject(`Ошибка: нет данных`);
            })

    }
    loadUserInfo() {
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
                    document.querySelector('.user-info__name').textContent = result.name;
                    document.querySelector('.user-info__job').textContent = result.about;
                }
                else {
                    return Promise.reject(`Нет данных`);
                }
            });

    }
    editUserInfo(name, about) {
        return fetch(`${this.baseURL}/users/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                name: name,
                about: about
            })
        });
    }
}

//Создание, удаление и "лайк" карточки

class Card {
    constructor(name, link, options) {
        this.card = { name, link };
        this.options = options;
        this.removeCard = this.removeCard.bind(this);
        this.container = document.querySelector('.places-list');
    }

    createCard() {
        const theCard = document.createElement('div');
        const cardImageElement = document.createElement('div');
        const deleteIconElement = document.createElement('button');
        const cardDescription = document.createElement('div');
        const cardName = document.createElement('h3');
        const likeIcon = document.createElement('button');

        theCard.classList.add('place-card');

        cardImageElement.classList.add('place-card__image');
        cardImageElement.setAttribute('imageURL', this.card.link);
        cardImageElement.style.backgroundImage = `url(${this.card.link})`;

        deleteIconElement.classList.add('place-card__delete-icon');
        cardImageElement.appendChild(deleteIconElement);

        cardDescription.classList.add('place-card__description');

        cardName.classList.add('place-card__name');
        cardName.textContent = this.card.name;

        likeIcon.classList.add('place-card__like-icon');

        cardDescription.appendChild(cardName);
        cardDescription.appendChild(likeIcon);

        theCard.appendChild(cardImageElement);
        theCard.appendChild(cardDescription);

        thePlaces.appendChild(theCard);

        theCard.querySelector('.place-card__delete-icon').addEventListener('click', this.removeCard);
        theCard.querySelector('.place-card__like-icon').addEventListener('click', this.likeCard);
    }

    removeCard(event) {
        thePlaces.removeChild(event.target.closest('.place-card'));
        document.querySelector('.place-card__like-icon').removeEventListener('click', this.removeCard);
    }

    likeCard(event) {
        event.target.classList.toggle('place-card__like-icon_liked');
    }
}

// Добавление загруженных и пользовательких карточек на страницу  и их отрисовка

class CardList {
    constructor(options) {
        this.options = options;
        this.render();
    }

    addCard(name, link) {
        const theCard = new Card(name, link);
        theCard.createCard();
    }

    render() {
        const closeButtonArray = document.querySelectorAll('.popup__close');        
        const host = new Api(this.options);

        closeButtonArray.forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                popup.close(event);
            });
        });
       
        host.loadUserInfo()
        host.getInitialCards()
            .then((res) => {
                if (res) {
                    for (let i = 0; i < res.length; i++) {
                        this.addCard(res[i].name, res[i].link);
                    }
                }
            })
            .catch((err) => {
                alert('Что-то пошло не так :(, ошибка' + err)
            });

        document.querySelector('.user-info__button').addEventListener('click', function (event) {
            popup.open(event);
        });

        document.querySelector('.places-list').addEventListener('click', function (event) {
            popup.open(event);
        });

        disablePopUpButton(submitFormButton);
    }
}

// Открытие и закрытие модальных окон

class PopUp {

    open(event) {
        if (event.target.classList.contains('user-info__button')) {
            popUpDialog.classList.add('popup_is-opened');
            theForm.elements.name.value = '';
            theForm.elements.link.value = '';
            disablePopUpButton(submitFormButton);
        }
        if (event.target.classList.contains('user-info__edit-button')) {
            popUpEditUserInfo.classList.add('popup_is-opened');
            theEditForm.elements.username.value = document.querySelector('.user-info__name').textContent;
            theEditForm.elements.about.value = document.querySelector('.user-info__job').textContent;
        }
        if (event.target.classList.contains('place-card__image')) {
            const bigPicture = document.querySelector('.popup__big-image');
            bigPicture.src = event.target.getAttribute('imageURL');
            popUpBigImage.classList.add('popup_is-opened');
        }
    }

    close(event) {
        if (event.target.classList.contains('popup__close')) {
            event.target.closest('.popup').classList.remove('popup_is-opened');
            if (event.target.closest('#edit-user-info')) {
                resetErrorMessages(theEditForm);
            }
            if (event.target.closest('#add-new-card')) {
                resetErrorMessages(theForm);
            }
            if (event.target.closest('#show-image')) {
                event.target.closest('#show-image').querySelector('.popup__big-image').src = '';
            }
        }
    }
}

// Объявляем переменные

const thePlaces = document.querySelector('.places-list');
const popUpDialog = document.querySelector('#add-new-card');
const popUpEditUserInfo = document.querySelector('#edit-user-info');
const theForm = document.forms.new;
const theEditForm = document.forms.user;
const submitFormButton = popUpDialog.querySelector('.popup__button');
const submitEditUser = popUpEditUserInfo.querySelector('.popup__button');
const popUpBigImage = document.querySelector('#show-image');
const options = {
    host: 'http://95.216.175.5',
    cohort: 'cohort1',
    token: 'b0f7914b-0b67-4fc8-95a9-59a1c36c47f7',
    contentType: `application/json`
};
const popup = new PopUp();
const defaultCards = new CardList(options);


// Объявляем функции

function disablePopUpButton(button) {
    button.setAttribute('disabled', true);
    button.classList.add('popup__button_disabled');
}

function enablePopUpButton(button) {
    button.removeAttribute('disabled');
    button.classList.remove('popup__button_disabled');
}


function isValid(elementToCheck) {
    const errorElement = document.querySelector(`#error-${elementToCheck.name}`)

    if (!elementToCheck.validity.valid) {

        if (elementToCheck.validity.typeMismatch) { errorElement.textContent = 'Здесь должна быть ссылка'; }
        if (elementToCheck.value.length < Number(elementToCheck.getAttribute('minlength'))) {
            if (elementToCheck.validity.valueMissing) { errorElement.textContent = 'Это обязательное поле'; }
            else { errorElement.textContent = 'Длина должна быть от 2 до 30 символов'; }
        }
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function resetErrorMessages(parentNode) {
    const errorsCollection = Array.from(parentNode.getElementsByTagName('span'));
    errorsCollection.forEach(function (item) {
        let idToCheck = item.id;
        if (idToCheck.includes('error')) { item.textContent = ''; }
    });
}

function formInputHandler() {
    let validatePlace = isValid(theForm.elements.name);
    let validateURL = isValid(theForm.elements.link);
    if (validatePlace && validateURL) {
        enablePopUpButton(submitFormButton);
    } else {
        disablePopUpButton(submitFormButton);
    }
}

function editFormHandler() {
    let validateUserName = isValid(theEditForm.elements.username);
    let validateAbout = isValid(theEditForm.elements.about);

    if (validateUserName && validateAbout) { enablePopUpButton(submitEditUser); }
    else { disablePopUpButton(submitEditUser); }
}

function editFormSubmit(event) {
    event.preventDefault();
    const userName = theEditForm.elements.username.value;
    const userAbout = theEditForm.elements.about.value;
    const host = new Api(options);
    host.editUserInfo(userName, userAbout)
        .then((res) => {
            if (res.ok) {
                document.querySelector('.user-info__name').textContent = theEditForm.elements.username.value;
                document.querySelector('.user-info__job').textContent = theEditForm.elements.about.value;
                popUpEditUserInfo.classList.remove('popup_is-opened');
            }
        })
        .catch((res) => {
            alert('Невозможно загрузить данные профиля на сервер');
        });

}

function formAddElement(event) {
    event.preventDefault();
    const name = theForm.elements.name;
    const link = theForm.elements.link;
    const card = new Card(name.value, link.value);
    card.createCard();

    theForm.reset();
    disablePopUpButton(submitFormButton);
    popUpDialog.classList.remove('popup_is-opened');
}


// Слушатели форм
theForm.addEventListener('input', formInputHandler);
theForm.addEventListener('submit', formAddElement);

theEditForm.addEventListener('input', editFormHandler);
theEditForm.addEventListener('submit', editFormSubmit);

document.querySelector('.user-info__edit-button').addEventListener('click', function (event) {
    popup.open(event);
});
