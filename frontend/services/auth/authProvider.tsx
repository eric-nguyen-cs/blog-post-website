import { ReactNode, useEffect, useState } from "react"
import { LocalEmail, LocalName } from "../localStorage"
import { AuthContext, AuthContextType } from "./authContext"

type Props = {
  children: ReactNode
}

export const AuthProvider: React.FC<Props> = (props) => {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (userEmail) return
    const storedEmail = LocalEmail.get()
    const storedName = LocalName.get()
    if (storedEmail) {
      setUserEmail(storedEmail)
      setUserName(storedName)
    }
  }, [])

  const contextValue: AuthContextType = {
    email: userEmail,
    name: userName,
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
        const { email : resEmail, name: resName } = await res.json()
        setUserEmail(resEmail)
        setUserName(resName)
        LocalEmail.set(resEmail)
        LocalName.set(resName)
      } catch (error) {
        throw error
      }
    },
    logout: () => {
      LocalEmail.reset()
      LocalName.reset()
      setUserEmail(null)
      setUserName(null)
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
  )
}