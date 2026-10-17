import { useState } from 'react'
import type { Credentials } from '../types'

type Props = {
  onSend: (data: Credentials) => void
  isLoading: boolean
  error: string | null
}

export const LoginForm = ({ onSend, isLoading, error }: Props) => {
  const [idInstance, setIdInstance] = useState('')
  const [apiToken, setApiToken] = useState('')

  const handleChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    fn: (value: string) => void
  ) => {
    fn(e.currentTarget.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const idInstanceTrim = idInstance.trim()
    const apiTokenTrim = apiToken.trim()
    onSend({ idInstance: idInstanceTrim, apiTokenInstance: apiTokenTrim })
  }

  const canSubmit = idInstance.trim() !== '' && apiToken.trim() !== ''

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="idInstance">idInstance</label>
      <input
        value={idInstance}
        type="text"
        id="idInstance"
        name="idInstance"
        onChange={e => handleChangeValue(e, setIdInstance)}
      />
      <label htmlFor="apiToken">apiToken</label>
      <input
        value={apiToken}
        type="password"
        id="apiToken"
        name="apiToken"
        onChange={e => handleChangeValue(e, setApiToken)}
      />
      <button type="submit" disabled={!canSubmit || isLoading}>
        Login
      </button>
      {isLoading && <p>Loading....</p>}
      {error && <p>{error}</p>}
    </form>
  )
}
