import { useContext } from "react";
import { AuthContext, AuthContextType } from "./authContext";

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext) as AuthContextType
  if (!context) {
    console.error("No auth provider found !")
  }
  return context
}