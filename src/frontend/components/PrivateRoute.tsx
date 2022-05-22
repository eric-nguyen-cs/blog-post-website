import Router from "next/router"
import { ReactNode, useEffect } from "react"
import { useAuthContext } from "../services/auth"

interface Props {
  children: ReactNode
}

const PrivateRoute: React.FC<Props> = (props) => {
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user) {
      Router.push("/login")
    }
  }, [user])

  return(
    <>
      {user ? (
        <>{props.children}</>
      ):
      (<></>)
      }
    </>
  )
} 

export default PrivateRoute