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
          <div className="add-comment-box">
            <textarea 
              placeholder="Add comment.."
              onChange={(e)=>setContent(e.target.value)}
              value={content}
              />
            <button type="submit" onClick={submitComment}>Send</button>
            <style jsx>{`
              .add-comment-box {
                display: flex;
                background: #fff; 
                margin: 2.5rem 0.5rem 0 1.5rem;
                padding: 5px;
                border-radius: 10px; 
                border:1px solid #ccc;
              }

              textarea {
                flex-grow: 1;
                background: none;
                border: none;
                outline: none!important;
                resize: none; 
                font-family: inherit;
              }

              button {
                color: dodgerblue;
                border: none;
                background: none;
                text-transform: uppercase;  
              }
            `}</style>
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