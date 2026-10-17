import { useState } from 'react'
import './App.css'
import { LoginForm } from './components/LoginForm'
import type { Credentials } from './types'
import { Chat } from './components/Chat'

const BASE_API_URL = 'https://api.green-api.com'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSend = async (data: Credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${BASE_API_URL}/waInstance${data.idInstance}/getStateInstance/${data.apiTokenInstance}`
      )
      if (res.status === 401) throw new Error('Неверный apiToken')
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`)

      const json = await res.json()
      if (json.stateInstance !== 'authorized') {
        throw new Error(
          'Инстанс не авторизован: привяжите MAX в личном кабинете GREEN-API'
        )
      }
      setCredentials(data)
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
      {credentials ? (
        <Chat credentials={credentials} />
      ) : (
        <LoginForm onSend={onSend} isLoading={isLoading} error={error} />
      )}
    </>
  )
}

export default App
