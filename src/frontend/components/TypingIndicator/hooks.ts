import { useCallback, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import throttle from "lodash/throttle"
import debounce from "lodash/debounce"
import { DebouncedFunc } from "lodash"

interface TypingUserType {
  userName: string, 
  debouncedUpdateState: DebouncedFunc<() => void>
}

/**
  * Hook that handles socket creation and cleanup
  * @return Returns the socket stored in a React state
*/
export const useSocket = (postId: number, currentUser: string): Socket => {
  const [socket, setSocket] = useState<Socket | null>(null)
  useEffect(() => {
    const newSocket = io("http://localhost:3001")
    newSocket.on("connect", () => {
      newSocket.emit('join-post', postId)
      newSocket.emit('join-user', currentUser)
    }) 
    setSocket(newSocket)
    return () => { newSocket.close() }
  }, [postId, currentUser])

  return socket
}

/**
  * Hook that creates a throttled socket emitter
  * @return Returns the "i-am-typing" socket emitter callback
*/
export const useSocketEmitter = (socket: Socket, postId: number, currentUser: string) => {
  const MINIMUM_TIME_BTW_EMITTING_EVENTS = 1000
  const throttledEmiter = useCallback(
    throttle(() => { socket.emit('i-am-typing', postId, currentUser) }, MINIMUM_TIME_BTW_EMITTING_EVENTS)
    , [socket, postId, currentUser])
  useEffect(() => {
    const cleanUpEmitter = () => { throttledEmiter.cancel() }
    return cleanUpEmitter
  }, [])
  return throttledEmiter
}

/**
  * Hook that keeps in memory the users that are typing
  * @return Returns the typingUsers state and a handleIsTypingUser callback to correctly update the typingUsers state from a socket event
*/
export const useTypingUsers = () => {
  const WAIT_TIME_BEFORE_REMOVING_A_TYPING_USER = 2000
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: TypingUserType }>({})
  const addTypingUser = (userEmail: string, userName: string, debouncedUpdateState: DebouncedFunc<() => void> ) => {
      setTypingUsers((previousTypingUsers) => { 
        return {
          ...previousTypingUsers, 
          [`${userEmail}`]: {userName: userName, debouncedUpdateState: debouncedUpdateState}
        }})
  }
  const removeTypingUser = (userEmail: string) => {
    setTypingUsers((previousTypingUsers) => { 
        const {[userEmail]: name ,...newTypingUsers} = previousTypingUsers
        return newTypingUsers
      })
  }
  const handleIsTypingUser = useCallback((userEmail: string, userName: string) => {
    if (!(userEmail in typingUsers)) { 
      const debouncedUpdateState = debounce(() => removeTypingUser(userEmail), WAIT_TIME_BEFORE_REMOVING_A_TYPING_USER)
      addTypingUser(userEmail, userName, debouncedUpdateState)
      debouncedUpdateState()
    } else {
      const debouncedUpdateState = typingUsers[userEmail].debouncedUpdateState
      debouncedUpdateState()
    }
  }, [typingUsers, setTypingUsers])

  useEffect(() => {
    return () => Object.values(typingUsers).forEach((user) => user.debouncedUpdateState.cancel())
  }, [])

  return {typingUsers, handleIsTypingUser} 
}

/**
  * Hook that generate the "...is typing..." message in function of the state of typingUsers
  * @return Returns the isTypingMessage state
*/
export const useMessage = (typingUsers: { [key: string]: TypingUserType }) => {
  const [isTypingMessage, setIsTypingMessage] = useState<string>('')

  const generateIsTypingMessage = (typingUsers: {[key: string]: TypingUserType}): string => {
    const names: string[] = []
    Object.values(typingUsers).forEach(({userName}) => names.push(userName))
    const messageEnd = (names.length > 1 ) ? (" are typing...") : (
      (names.length === 1) ? (" is typing...") : ("\u00a0")
    )
    const message = names.join(", ").concat(messageEnd)
    return message
  }

  useEffect(() => {
    const message = generateIsTypingMessage(typingUsers)
    setIsTypingMessage(message)
  }, [typingUsers])

  return isTypingMessage
}
