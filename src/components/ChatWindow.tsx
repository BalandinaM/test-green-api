import { useState } from 'react'
import { BASE_API_URL } from '../App'
import type { Credentials, Message } from '../types'
import { handleChangeValue } from '../utils'

type Props = {
  credentials: Credentials
  chatId: string
}

export const ChatWindow = ({ credentials, chatId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
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
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)
      const json = await res.json()
      setMessages(prev => [
        ...prev,
        {
          id: json.idMessage,
          text: message,
          direction: 'outgoing',
        },
      ])
      setMessage('')
    } catch (e) {
      if (e instanceof TypeError) {
        setError(
          'Не удалось связаться с сервером. Проверьте подключение к интернету.'
        )
      } else if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Неизвестная ошибка')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = message.trim() !== ''

  return (
    <div>
      {messages.length ? (
        <ul>
          {messages.map(msg => (
            <li
              key={msg.id}
              className={`s.message s.message--${msg.direction}`}
            >
              {msg.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>Начните общение...</p>
      )}
      <form onSubmit={handleSendMessage}>
        <label htmlFor="message">Введите текст сообщения</label>
        {/* скрыть видимость этого лабела */}
        <input
          name="message"
          id="message"
          type="text"
          value={message}
          onChange={e => handleChangeValue(e, setMessage)}
        />
        <button type="submit" disabled={!canSubmit || isLoading}>
          Send message
        </button>
      </form>
      {isLoading && <p>Loading....</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

// План на 19.10: правки выше и коммит, потом опрос receiveNotification / deleteNotification: входящие идут в тот же список с фильтром по chatId. Дальше стили, README, скрины и письмо. GitHub и Vercel мы так и не подключили, их лучше сделать в первой половине дня, чтобы вечером не оказалось сюрпризов с деплоем.
