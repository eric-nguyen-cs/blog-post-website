import {createContext} from 'react'

export interface Credentials {
  email: string
}

export interface AuthContextType {
  login: (creds: Credentials) => Promise<void>,
  logout: () => void,
  email: string | null,
  name: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)