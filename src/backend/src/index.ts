import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import express from 'express'
import { createServer } from "http"
import { Server } from "socket.io"
import asyncErrorHandler from './errorHandler'

const prisma = new PrismaClient()
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { 
  cors: { origin: '*'}
})

app.use(express.json())
app.use(cors())

app.get('/drafts', asyncErrorHandler( async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: false },
    include: { author: true }
  })
  res.json(posts)
}))

app.get('/feed', asyncErrorHandler( async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  })
  res.json(posts)
}))

app.get('/filterPosts', asyncErrorHandler( async (req, res) => {
  const { searchString }: { searchString?: string } = req.query;
  const filteredPosts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString,
          },
        },
        {
          content: {
            contains: searchString,
          },
        },
      ],
    },
  })
  res.json(filteredPosts)
}))

app.post(`/post`, asyncErrorHandler( async (req, res) => {
    const { title, content, authorEmail } = req.body
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
      },
    })
    res.json(result)
}))

app.delete(`/post/:id`, asyncErrorHandler( async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
}))

app.post(`/comment`, asyncErrorHandler( async (req, res) => {
  const { postId, authorEmail, content } = req.body
  const comment = await prisma.comment.create({
    data: {
      content,
      post: {connect: {id: postId}},
      author: {connect: {email: authorEmail}},
    }
  })
  res.json(comment)
}))

app.get(`/comments/:postId`, asyncErrorHandler( async (req, res) => {
  const { postId } = req.params
  const comments = await prisma.comment.findMany({
    where: { 
      postId: Number(postId) 
    },
    include: { author: true }
  })
  res.json(comments)
}))

app.get(`/post/:id`, asyncErrorHandler( async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: { author: true }
  })
  res.json(post)
}))

app.put('/publish/:id', asyncErrorHandler( async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.json(post)
}))

app.post(`/login`, asyncErrorHandler( async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      ...req.body
    },
    select: {
      email: true, 
      name: true
    }
  })
  res.json(user)
}))

app.post(`/user`, asyncErrorHandler( async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
}))

httpServer.listen(3001, () =>
  console.log(
    '🚀 Server ready at: http://localhost:3001',
  ),
)

io.on('connection', (socket) => {
  socket.on('join-post', postId => {
    socket.join(`post-${postId}`)
  })
  socket.on('join-user', (userEmail) => {
    socket.join(`user-${userEmail}`)
  })

  socket.on('i-am-typing', async (postId, userEmail) => {
    const { name: userName } = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        name: true
      }
    }) as { name: string }
    socket.to(`post-${postId}`).except(`user-${userEmail}`).emit('is-typing', userEmail, userName)
  })
})
