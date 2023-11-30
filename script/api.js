import { Notification } from "./Notification";

export const getGames = async () => {
  // https://speckled-humble-sulfur.glitch.me/games
  // http://localhost:8080/games
  try {
     const response = await fetch('https://speckled-humble-sulfur.glitch.me/games');
    if (!response.ok) {
      throw new Error(`Серевер вернул ошибку ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Проблема с fetch запросом ${error.message}`);
    Notification.getInstance().show("Возникла ошибка, попробуйте позже");
  }  
};

export const sendData = async (method, data, id) => {
  try {
    const response = await fetch(
      `https://speckled-humble-sulfur.glitch.me/clients${id ? `/${id}` : ""}`,
      {
        method,
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
   if (!response.ok) {
    const errorMessage = await response.text();
     throw new Error(`${errorMessage}`);
   }
   return true;
 } catch (error) {
   console.error(`Проблема с fetch запросом ${error.message}`);

   Notification.getInstance().show(`${error.message}`);
   return false;
 } 
};