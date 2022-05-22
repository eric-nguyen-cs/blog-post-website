import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthContext } from '../services/auth'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean =
    pathname => router.pathname === pathname

  const { user } = useAuthContext()

  return(
    <nav>
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
        <Link href="/signup">
          <a data-active={isActive('/signup')}>Signup</a>
        </Link>
        {user ? (
            <Link href="/create">
              <a data-active={isActive('/create')}>+ Create draft</a>
            </Link>
          ) : ( 
            <Link href="/login">
              <a data-active={isActive('/login')}>Login</a>
            </Link>
          )
        }
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }

        .right {
          margin-left: auto;
        }

        .right a {
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }
      `}</style>
    </nav>
  )
}

export default Header
