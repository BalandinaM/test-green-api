import { useEffect, useState } from 'react'
import { BASE_API_URL } from '../App'
import type { Credentials, Message } from '../types'
import { handleChangeValue, sleep } from '../utils'
import s from './ChatWindow.module.css'

type Props = {
  credentials: Credentials
  chatId: string
  phoneNumber: string
}

export const ChatWindow = ({ credentials, chatId, phoneNumber }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    let isActive = true

    const poll = async () => {
      while (isActive) {
        try {
          const res = await fetch(
            `${BASE_API_URL}/waInstance${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}?receiveTimeout=20`
          )
          if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)
          const json = await res.json()
          if (json === null) continue
          const { body } = json
          if (
            isActive &&
            body.typeWebhook === 'incomingMessageReceived' &&
            body.senderData.chatId === chatId &&
            body.messageData.typeMessage === 'textMessage'
          ) {
            setMessages(prev =>
              prev.some(m => m.id === body.idMessage)
                ? prev
                : [
                    ...prev,
                    {
                      id: body.idMessage,
                      text: body.messageData.textMessageData.textMessage,
                      direction: 'incoming',
                    },
                  ]
            )
          }
          const delRes = await fetch(
            `${BASE_API_URL}/waInstance${credentials.idInstance}/deleteNotification/${credentials.apiTokenInstance}/${json.receiptId}`,
            { method: 'DELETE' }
          )
          if (!delRes.ok) throw new Error(`Ошибка сервера ${delRes.status}`)
        } catch (e) {
          if (!isActive) return
          setError(e instanceof Error ? e.message : 'Неизвестная ошибка')
          await sleep(5000)
        }
      }
    }
    poll()

    return () => {
      isActive = false
    }
  }, [credentials, chatId])

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
    <div className={s.chat}>
      <header className={s.header}>
        <div className={s.avatar} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
          </svg>
        </div>
        <div>
          <p className={s.title}>+{phoneNumber}</p>
          <p className={s.subtitle}>MAX</p>
        </div>
      </header>

      <div className={s.messages}>
        {messages.length ? (
          <ul className={s.list}>
            {messages.map(msg => (
              <li key={msg.id} className={`${s.message} ${s[msg.direction]}`}>
                {msg.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.empty}>Начните общение…</p>
        )}
      </div>

      {error && <p className={s.error}>{error}</p>}

      <form className={s.composer} onSubmit={handleSendMessage}>
        <label className="visually-hidden" htmlFor="message">
          Введите текст сообщения
        </label>
        <input
          className={s.input}
          name="message"
          id="message"
          type="text"
          placeholder="Сообщение"
          autoComplete="off"
          value={message}
          onChange={e => handleChangeValue(e, setMessage)}
        />
        <button
          className={s.send}
          type="submit"
          disabled={!canSubmit || isLoading}
          aria-label="Отправить"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
          </svg>
        </button>
      </form>
    </div>
  )
}
