import { useState } from "react"
import { useAuthContext } from "../services/auth";

interface Props {
  postId: number,
  fetchComments: () => Promise<void>
}

const AddComment: React.FC<Props> = (props) => {
  const { user: authorEmail } = useAuthContext();

  const [content, setContent] = useState<string>('')

  const submitComment = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const postId = props.postId
      const body = { content, postId, authorEmail  }
      await fetch(`http://localhost:3001/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await props.fetchComments()
      setContent('')
    } catch (error) {
      console.error(error)
    }
  }

  return(
    <>
      {authorEmail ? (
          <div>
            <textarea 
              placeholder="Add comment"
              onChange={(e)=>setContent(e.target.value)}
              value={content}
              />
            <button type="submit" onClick={submitComment}>Send</button>
          </div>
        ): (
          <div>
            <small>
              Login to add comments
            </small>
          </div>
        ) 
      }
    </>
    )
}

export default AddComment