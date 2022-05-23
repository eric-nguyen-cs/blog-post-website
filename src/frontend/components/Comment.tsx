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
    <div className="comment-item">
      <small className="author-name">{props.comment.author.name}</small>
      <span>{props.comment.content}</span>
      <small className="time">{`${day} ${time}`}</small>
      <style jsx>{`
        .comment-item {
          background-color: white;
          border: 1px solid lightgrey;
          padding: 0.8rem 0.8rem 0.4rem;
          margin: 1.2rem 0;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: bold;
          font-size: 12px;
        }

        .time {
          align-self: flex-end;
          font-size: 11px;
          color: dimgrey;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

export default Comment