export interface CommentType {
  content: string,
  createdAt: string,
  author: {
    name: string
  }
}

interface Props {
  comment: CommentType
}

const Comment: React.FC<Props> = (props) => {
  const date = new Date(props.comment.createdAt)
  const [day, time] = [date.toLocaleDateString(), date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })]
  return(
    <div>
      <small>{props.comment.author.name}</small>
      <p>{props.comment.content}</p>
      <small>{`${day} ${time}`}</small>
    </div>
  )
}

export default Comment