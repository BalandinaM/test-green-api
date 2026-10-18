import { useState } from 'react'
import { BASE_API_URL } from '../App'
import type { Credentials } from '../types'
import { handleChangeValue } from '../utils'

type Props = {
  credentials: Credentials
  chatId: string
}

export const ChatWindow = ({ credentials, chatId }: Props) => {
  const [message, setMessage] = useState('')
  const handleSendMessage = async () => {
    try {
      const res = await fetch(
        `${BASE_API_URL}/waInstance${credentials.idInstance}/sendMessage/${credentials.apiTokenInstance}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: chatId,
            message: message,
          }),
        }
      )

      const json = await res.json()
      console.log(json)
      //{"idMessage":"1792267527667"}
    } catch {}
  }

  return (
    <div>
      <ul>
        <li>тут типа список контактов</li>
        <li>боковой сайдбар для выбора контакта</li>
      </ul>
      <div>
        так то тут по сути тоже список сообщений, в порядке - свежие внизу и
        потом стилями разложеные по сторонам
      </div>
      <input
        name="message"
        id="message"
        onChange={e => handleChangeValue(e, setMessage)}
      />
      <button onClick={() => handleSendMessage()}>Send message</button>
    </div>
  )
}
