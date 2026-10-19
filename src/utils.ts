export const handleChangeValue = (
  e: React.ChangeEvent<HTMLInputElement>,
  fn: (value: string) => void
) => {
  fn(e.currentTarget.value)
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
