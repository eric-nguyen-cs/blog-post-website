import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthContext } from '../services/auth'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean =
    pathname => router.pathname === pathname

  const { email, name, logout } = useAuthContext()

  const connectedMessage = ( email ? (`Connected as ${name}`) : ("\u00a0"))

  return(
    <nav>
      <span className="logged-in-message">{connectedMessage}</span>
      <div className="buttons-container">
        <div className="left">
          <Link href="/">
            <a className="bold" data-active={isActive('/')}>
              Blog
            </a>
          </Link>
          <Link href="/drafts">
            <a data-active={isActive('/drafts')}>Drafts</a>
          </Link>
        </div>
        <div className="right">
          <div>
            {email ? (
              <>
                  <Link href="/create">
                    <a data-active={isActive('/create')}>+ Create draft</a>
                  </Link>
                  <button onClick={logout}>Logout</button>
                </>
              ) : ( 
                <>
                  <Link href="/signup">
                    <a data-active={isActive('/signup')}>Signup</a>
                  </Link>
                  <Link href="/login">
                    <a data-active={isActive('/login')}>Login</a>
                  </Link>
                </>
              )
            }
          </div>
        </div>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          flex-direction: column;
          padding: 1.4rem 2rem 2rem 2rem;
        }

        .buttons-container {
          display: flex;
          align-items: center;
          justify-content: space-between; 
        }

        .logged-in-message {
          font-weight: bold;
          text-align: right;
          margin: 0 0 0.5rem 0;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        button {
          font-size: inherit;
        }
        
        .left a[data-active='true'] {
          color: gray;
        }

        a + a, a + button {
          margin-left: 1rem;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-content: center;
        }

        .right a, .right button{
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }
      `}</style>
    </nav>
  )
}

export default Header
