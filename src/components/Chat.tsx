import type { Credentials } from '../types'

type Props = { credentials: Credentials }

export const Chat = ({ credentials }: Props) => {
  //может тут  тоже сделать условный рендеринг, если чата нет показывать этот инпут,
  //если чат есть - вместо инпута номер узера как заголовок чата и окно чата с полем ввода
  return (
    <>
      <div>
        <label htmlFor="phone">Введите номер телефона</label>
        <input name="phone" id="phone" type="tel" />
        <button>Создать новый чат</button>
      </div>
      <div>
        <ul>
          <li>тут типа список контактов</li>
          <li>боковой сайдбар для выбора контакта</li>
        </ul>
        <div>
          так то тут по сути тоже список сообщений, в порядке - свежие внизу и
          потом стилями разложеные по сторонам
        </div>
        <textarea />
        <button>Send message</button>
      </div>
    </>
  )
}
