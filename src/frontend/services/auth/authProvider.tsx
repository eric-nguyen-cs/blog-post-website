import { ReactNode, useState } from "react"
import { AuthContext, AuthContextType } from "./authContext"

type Props = {
  children: ReactNode
}

export const AuthProvider: React.FC<Props> = (props) => {
  const [user, setUser] = useState<string | null>(null)

  const contextValue: AuthContextType = {
    user,
    login: async ({ email }) => {
      if (email.length == 0) {
        throw new Error("Email was not provided")
      }
      try {
        const body = { email }
        const res = await fetch(`http://localhost:3001/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const { email: userEmail } = await res.json()
        setUser(userEmail)
      } catch (error) {
        throw error
      }
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  )
}