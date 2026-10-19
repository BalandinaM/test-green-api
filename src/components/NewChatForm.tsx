import { useState } from 'react'
import { handleChangeValue } from '../utils'
import s from './Form.module.css'

type Props = {
  onSend: (value: number) => void
  error: string | null
  isLoading: boolean
}

const isValidContact = (phoneNumber: string) => /^7\d{10}$/.test(phoneNumber)

export const NewChatForm = ({ onSend, error, isLoading }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSend(Number(phoneNumber))
  }

  return (
    <div className={s.page}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>Новый чат</h1>
        <p className={s.subtitle}>Номер собеседника, зарегистрированного в MAX</p>
        <div className={s.field}>
          <label className={s.label} htmlFor="phoneNumber">
            Номер телефона
          </label>
          <input
            className={s.input}
            name="phoneNumber"
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={e => handleChangeValue(e, setPhoneNumber)}
            placeholder="7XXXXXXXXXX"
          />
        </div>
        <button
          className={s.button}
          type="submit"
          disabled={!isValidContact(phoneNumber) || isLoading}
        >
          Создать чат
        </button>
        {isLoading && <p className={s.status}>Ищем пользователя…</p>}
        {error && <p className={s.error}>{error}</p>}
      </form>
    </div>
  )
}
