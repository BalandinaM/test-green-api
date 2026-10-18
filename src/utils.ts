export const handleChangeValue = (
  e: React.ChangeEvent<HTMLInputElement>,
  fn: (value: string) => void
) => {
  fn(e.currentTarget.value)
}
