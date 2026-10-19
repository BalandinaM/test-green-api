import { useEffect, useState } from 'react'
import { BASE_API_URL } from '../App'
import type { Credentials, Message } from '../types'
import { handleChangeValue, sleep } from '../utils'
import s from './ChatWindow.module.css'

type Props = {
  credentials: Credentials
  chatId: string
}

export const ChatWindow = ({ credentials, chatId }: Props) => {
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
    <div>
      {messages.length ? (
        <ul>
          {messages.map(msg => (
            <li key={msg.id} className={`${s.message} ${s[msg.direction]}`}>
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
