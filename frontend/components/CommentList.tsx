import { useEffect, useState } from "react"
import AddComment from "./AddComment"
import Comment, { CommentType } from './Comment'

interface CommentListProps {
  postId: number
}

const CommentList: React.FC<CommentListProps> = (props) => {
  const [comments, setComments] = useState<CommentType[]>([])
  
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3001/comments/${props.postId}`)
      const newComments = await res.json() as CommentType[]
      setComments(newComments)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <>
      <h3>Comments</h3>
      <div className="comments-content">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment}/>
          ))}
      </div>
      <AddComment postId={props.postId} fetchComments={fetchComments}/>
      <style jsx>{`
        .comments-content {
          margin: 0.5rem 1.5rem 0.5rem 0.5rem;
        }
      `}</style>
    </>
  )
}

export default CommentList