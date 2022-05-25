import Router from "next/router"
import { ReactNode, useEffect } from "react"
import { useAuthContext } from "../services/auth"

interface Props {
  children: ReactNode
}

const PrivateRoute: React.FC<Props> = (props) => {
  const { email } = useAuthContext()

  useEffect(() => {
    if (!email) {
      Router.push("/login")
    }
  }, [email])

  return(
    <>
      {email ? (
        <>{props.children}</>
      ):
      (<></>)
      }
    </>
  )
} 

export default PrivateRoute