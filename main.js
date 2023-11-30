import './style.css';
import { getGames } from './script/api';
import { initForm } from './script/form';
import { createGameBlock } from './script/games';
import { initChangeSection } from './script/changeSection';


const init = async () => {

  const gamesList = document.querySelector(".booking__games-list");
  const bookingForm = document.querySelector(".booking__form");
  const countGames = document.querySelector('.event__info-item_games .event__info-number');

  const bookingInputFullName = document.querySelector(".booking__input_fullname");
  const bookingInputPhone = document.querySelector(".booking__input_phone");
  const bookingInputTicket = document.querySelector(".booking__input_ticket");

  const event = document.querySelector(".event");
  const booking = document.querySelector(".booking");
  const eventButtonReserve = document.querySelector(".event__button_reserve");
  const eventButtonEdit = document.querySelector(".event__button_edit");
  const bookingTitle = document.querySelector(".booking__title");

  const games = await getGames();
  
  if (!games) return;

  countGames.textContent = games.length;

  const changeSection = initChangeSection(
    bookingForm,
    event,
    booking,
    eventButtonReserve,
    eventButtonEdit,
    bookingTitle,
    games,
    gamesList
  );

  initForm(
    bookingForm, 
    bookingInputFullName, 
    bookingInputPhone, 
    bookingInputTicket,
    changeSection,
    gamesList
  );
}

init();
