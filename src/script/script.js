import {popup} from './popup.js'
import {api} from './api.js'
import Card from './card.js'

export default function main() {

// Объявляем переменные

const thePlaces = document.querySelector('.places-list');
const popUpDialog = document.querySelector('#add-new-card');
const popUpEditUserInfo = document.querySelector('#edit-user-info');
const theForm = document.forms.new;
const theEditForm = document.forms.user;
const submitFormButton = popUpDialog.querySelector('.popup__button');
const submitEditUser = popUpEditUserInfo.querySelector('.popup__button');

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
    api.editUserInfo(userName, userAbout)
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


};