export type Credentials = {
  idInstance: string
  apiTokenInstance: string
}

export type Message = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
}
