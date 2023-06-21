export interface User {
  id: string
  name?: string
  bio?: string
  avatar?: string
  account: string
  pvkey: string
  $publicKey: string
}

export interface Follower {
  id: string
  follower: string
  followee: string
  email: string
  $pk: string
}

export interface Message {
  id: string
  message: string
  account: string
  timestamp: string
  $pk: string
}
