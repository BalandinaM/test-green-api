import { useState } from 'react'
import type { Credentials } from '../types'
import { handleChangeValue } from '../utils'
import s from './Form.module.css'

type Props = {
  onSend: (data: Credentials) => void
  isLoading: boolean
  error: string | null
}

export const LoginForm = ({ onSend, isLoading, error }: Props) => {
  const [idInstance, setIdInstance] = useState('')
  const [apiToken, setApiToken] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const idInstanceTrim = idInstance.trim()
    const apiTokenTrim = apiToken.trim()
    onSend({ idInstance: idInstanceTrim, apiTokenInstance: apiTokenTrim })
  }

  const canSubmit = idInstance.trim() !== '' && apiToken.trim() !== ''

  return (
    <div className={s.page}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>Вход</h1>
        <p className={s.subtitle}>
          Данные инстанса из личного кабинета GREEN-API
        </p>
        <div className={s.field}>
          <label className={s.label} htmlFor="idInstance">
            idInstance
          </label>
          <input
            className={s.input}
            value={idInstance}
            type="text"
            id="idInstance"
            name="idInstance"
            onChange={e => handleChangeValue(e, setIdInstance)}
          />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="apiToken">
            apiTokenInstance
          </label>
          <input
            className={s.input}
            value={apiToken}
            type="password"
            id="apiToken"
            name="apiToken"
            onChange={e => handleChangeValue(e, setApiToken)}
          />
        </div>
        <button
          className={s.button}
          type="submit"
          disabled={!canSubmit || isLoading}
        >
          Войти
        </button>
        {isLoading && <p className={s.status}>Проверяем инстанс…</p>}
        {error && <p className={s.error}>{error}</p>}
      </form>
    </div>
  )
}
