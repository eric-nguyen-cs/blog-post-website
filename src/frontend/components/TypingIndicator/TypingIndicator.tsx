import { useEffect } from "react"

import { useAuthContext } from "../../services/auth"
import { useSocket, useSocketEmitter, useTypingUsers, useMessage } from "./hooks"

interface Props {
  myMessage: string,
  postId: number
}

export const TypingIndicator: React.FC<Props> = (props) => {
  const { email: currentUser } = useAuthContext();
  const postSocket = useSocket(props.postId, currentUser)

  const IAmTypingEmiter = useSocketEmitter(postSocket, props.postId, currentUser)
  // Emits a throttled event whenever the myMessage value changes
  useEffect(() => {
    if (postSocket != null && props.myMessage) {
      IAmTypingEmiter()
    }
  }, [props.myMessage])

  const {typingUsers, handleIsTypingUser} = useTypingUsers()
  // Whenever a "is-typing" event is detected, adds the is-typing user and calls a debounced function to remove it later 
  useEffect(() => {
    if ( postSocket != null) {
      postSocket.on('is-typing', handleIsTypingUser)
      return () => {postSocket.off('is-typing', handleIsTypingUser)}
    }
  }, [postSocket, handleIsTypingUser])

  const isTypingMessage = useMessage(typingUsers)

  return (
    <div>
      {isTypingMessage}
      <style jsx>{`
        div {
          margin: 0 0 0 0.3rem;
          color: dimgrey;
          font-style: italic;
          font-size: 15px;
        }
      `}</style>
    </div>
  )
}