import Inputmask from 'inputmask';
import JustValidate from 'just-validate';
import { Notification } from './Notification';
import { sendData } from './api';

const notification = Notification.getInstance();

export const initForm = (
  bookingForm, 
  bookingInputFullName,
  bookingInputPhone,
  bookingInputTicket,
  changeSection,
  gamesList
) => {
  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: 'booking__input_invalid',
    successFieldCssClass: 'booking__input_valid',
  });

  new Inputmask('+7(999)-999-9999').mask(bookingInputPhone);
  new Inputmask('99999999').mask(bookingInputTicket);

  validate
  .addField(bookingInputFullName, [
    {
      rule: 'required',
      errorMessage: "Введите Имя"
    },
  ])
  .addField(bookingInputPhone, [{
      rule: 'required',
      errorMessage: "Введите телефон"
    }, 
    {
      validator() {
        const phone = bookingInputPhone.inputmask.unmaskedvalue();
        return phone.length === 10 && !!Number(phone); 
      }
      ,
      errorMessage: "Некорректный телефон",
    },
  ])
  .addField(bookingInputTicket, [{
      rule: 'required',
      errorMessage: "Введите номер билета"
    }, 
    {
      validator() {
        const ticket = bookingInputTicket.inputmask.unmaskedvalue();
        return ticket.length === 8 && !!Number(ticket); 
      },
      errorMessage: "Неверный номер билета",
    },
  ]).onFail((fields) => {
    let errorMessage = '';
    for (const key in fields) {
      if (!Object.hasOwnProperty.call(fields, key)) {
        continue;     
      }

      const elem = fields[key];
      if (!elem.isValid) {
        errorMessage += `${elem.errorMessage}, `;
      }
    }

    notification.show(errorMessage.slice(0, -2), false)
  })

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate.isValid) {
      return;
    }

    const data = {booking: []};
    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      console.log('value, field: ', value, field);
      if (field === 'booking') {
        const [game, time] = value.split(",");

        if (game && time) {
          data.booking.push({game, time})
          times.add(time);
        }
      } else {
        data[field] = value;        
      }
    });

    if (times.size !== data.booking.length) { 
      notification.show('Вы уже записаны на это время', false);
      return;
    }

    if (!times.size) {
      notification.show('Вы не выбрали время', false);
      return;
    }

    const method = bookingForm.getAttribute('method');

    let isSend = false;

    if (method === 'PATCH') {
      isSend = await sendData(method, data, ticketNumber);
    } else {
      isSend = await sendData(method, data);
    }

    if (isSend) {
      notification.show('Бронь принята', true);
      changeSection();
      bookingForm.reset();
      gamesList.textContent = '';
    }

    console.log(' data: ',  data);
  })
}