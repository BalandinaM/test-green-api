import { useState } from 'react'
import { handleChangeValue } from '../utils'

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
    <form onSubmit={handleSubmit}>
      <label htmlFor="phoneNumber">Введите номер телефона</label>
      <input
        name="phoneNumber"
        id="phoneNumber"
        type="tel"
        value={phoneNumber}
        onChange={e => handleChangeValue(e, setPhoneNumber)}
        placeholder="7XXXXXXXXXX"
      />
      <button
        type="submit"
        disabled={!isValidContact(phoneNumber) || isLoading}
      >
        Создать новый чат
      </button>
      {isLoading && <p>Loading....</p>}
      {error && <p>{error}</p>}
    </form>
  )
}
