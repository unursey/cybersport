import './style.css';
import TomSelect from 'tom-select';

const gamesList = document.querySelector(".booking__games-list");
const MAX_GAMES = 6;

const createGameBlock = (games) => {
  console.log('games: ', games);
  const bookingGame = document.createElement("li");
  bookingGame.classList.add("booking__game");

  const bookingSelectGame = document.createElement("select");
  bookingSelectGame.classList.add("booking__select", "booking__select_game");

  const bookingSelectTime = document.createElement("select");
  bookingSelectTime.classList.add("booking__select", "booking__select_time");

  const inputHidden = document.createElement("input");
  inputHidden.type = "hidden";
  inputHidden.name = "booking";

  const bookingHall = document.createElement("button");
  bookingHall.classList.add("booking__hall");
  bookingHall.type = "button";

  bookingGame.append(bookingSelectGame, bookingSelectTime, inputHidden);

  const bookingTomSelectGame = new TomSelect(bookingSelectGame, {
    hideSelected: true, //Скрывает выбранный элемент
    placeholder: 'Выбрать турнир',
    options: games.map(item => ({
      value: item.id,
      text: item.game,
    })),
  });
  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true, //Скрывает выбранный элемент
    placeholder: 'Выбрать время',
  });
  bookingTomSelectTime.disable();

  bookingTomSelectGame.on('change', (id) => {
    bookingTomSelectTime.enable();
    bookingTomSelectGame.blur();

    const {performances} = games.find(item => item.id === id);
    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();

    bookingTomSelectTime.addOption(performances.map(item => ({
      value: item.time,
      text: item.time,
    })));

    bookingHall.remove();
  });

  bookingTomSelectTime.on('change', (time) => {
    if (!time) return;
    const idGame = bookingTomSelectGame.getValue();
    const {performances} = games.find(item => item.id === idGame);
    const {hall} = performances.find(item => item.time === time);

    inputHidden.value = `${idGame},${time}`;
    bookingTomSelectTime.blur()
    bookingHall.textContent = hall;
    bookingGame.append(bookingHall)
  });
    // !

  const createNextBookingGame = () => {
    if (gamesList.children.length < MAX_GAMES) {
      const nextGamesBlock = createGameBlock(games);
      gamesList.append(nextGamesBlock);
    }
    bookingTomSelectTime.off('change', createNextBookingGame); 
  };

  bookingTomSelectTime.on("change", createNextBookingGame);

  return bookingGame;
}

const getGames = async () => {
  const response = await fetch('https://speckled-humble-sulfur.glitch.me/games');
  return response.json();
}

const init = async () => {
  const countGames = document.querySelector('.event__info-item_games .event__info-number');
  const games = await getGames();

  countGames.textContent = games.length;
  const gameBlock = createGameBlock(games);
  gamesList.append(gameBlock);
}

init();
