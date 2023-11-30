import { createGameBlock } from "./games";

export const initChangeSection = (
  bookingForm,
  event,
  booking,
  eventButtonReserve,
  eventButtonEdit,
  bookingTitle,
  games,
  gamesList
) => {
  eventButtonReserve.classList.remove("event__button_hidden");
  eventButtonEdit.classList.remove("event__button_hidden");

  const changeSection = () => {
    event.classList.toggle("event_hidden");
    booking.classList.toggle("booking_hidden");

    if (!booking.classList.contains("booking_hidden")) {
      const gameBlock = createGameBlock(games, gamesList);
      gamesList.append(gameBlock);
    }
  }

  eventButtonReserve.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = "Забронируйте место в зале";
    bookingForm.method = 'POST';
  });
  eventButtonEdit.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = "Редактирование брони";
    bookingForm.method = 'PATCH';
  });

  return changeSection;
}