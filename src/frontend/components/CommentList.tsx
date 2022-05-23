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
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment}/>
      ))}
      <AddComment postId={props.postId} fetchComments={fetchComments}/>
    </>
  )
}

export default CommentList