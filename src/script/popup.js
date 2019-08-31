// Открытие и закрытие модальных окон
import disablePopUpButton from './disablepopupbutton.js';
import resetErrorMessages from './reseterror.js';


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

const popUpDialog = document.querySelector('#add-new-card');
const theForm = document.forms.new;
const submitFormButton = popUpDialog.querySelector('.popup__button')
const popUpBigImage = document.querySelector('#show-image');
const popUpEditUserInfo = document.querySelector('#edit-user-info');
const theEditForm = document.forms.user;

export const popup = new PopUp();