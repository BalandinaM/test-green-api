import { useState } from 'react'
import type { Credentials } from '../types'
import { NewChatForm } from './NewChatForm'
import { ChatWindow } from './ChatWindow'
import { BASE_API_URL } from '../App'

type Props = { credentials: Credentials }

export const ChatPage = ({ credentials }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSend = async (data: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${BASE_API_URL}/waInstance${credentials.idInstance}/checkAccount/${credentials.apiTokenInstance}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: data }),
        }
      )
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)
      const json = await res.json()
      if (json.exist === false) {
        throw new Error('Пользователь с таким номером не зарегистрирован в MAX')
      }
      setChatId(json.chatId)
    } catch (e) {
      if (e instanceof TypeError) {
        setError(
          'Не удалось связаться с сервером. Проверьте idInstance и подключение к интернету.'
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

  return (
    <>
      {!chatId ? (
        <NewChatForm onSend={onSend} error={error} isLoading={isLoading} />
      ) : (
        <ChatWindow credentials={credentials} chatId={chatId} />
      )}
    </>
  )
}
