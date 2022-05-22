import {createContext} from 'react'

export interface Credentials {
  email: string
}

export interface AuthContextType {
  login: (creds: Credentials) => Promise<void>
  user: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)