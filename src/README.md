# Your tasks

IMPORTANT: For all the tasks, focus on best practices. Aim for solutions that not only work but that you'd be happy to push to a production app.

## 1. Draft post bugfix

After running this app, you'll notice that the backend crashes if you try adding a new draft post with an email address that doesn't belong to any existing user. To reproduce this issue:

- Click "Create draft"
- Enter a title
- Enter an email address that doesn't belong to any user, for example 'test@hellopolygon.com'
- Enter content
- Click "Create"
- You'll see the server crash with the following error message:

```
/Users/polygon/Documents/development.nosync/recruitment-task/backend/node_modules/@prisma/client/runtime/index.js:45405
        throw new PrismaClientKnownRequestError(message, e.code, this.client._clientVersion, e.meta);
              ^
PrismaClientKnownRequestError:
Invalid `prisma.post.create()` invocation in
/Users/polygon/Documents/development.nosync/recruitment-task/backend/src/index.ts:50:36

  47
  48 app.post(`/post`, async (req, res) => {
  49   const { title, content, authorEmail } = req.body
→ 50   const result = await prisma.post.create(
  An operation failed because it depends on one or more records that were required but not found. No 'User' record(s) (needed to inline the relation on 'Post' record(s)) was found for a nested connect on one-to-many relation 'PostToUser'.
    at Object.request (/Users/polygon/Documents/development.nosync/recruitment-task/backend/node_modules/@prisma/client/runtime/index.js:45405:15)
    at async PrismaClient._request (/Users/polygon/Documents/development.nosync/recruitment-task/backend/node_modules/@prisma/client/runtime/index.js:46301:18) {
  code: 'P2025',
  clientVersion: '3.14.0',
  meta: {
    cause: "No 'User' record(s) (needed to inline the relation on 'Post' record(s)) was found for a nested connect on one-to-many relation 'PostToUser'."
  }
}
```

There are many ways to address this bug, please address it using a solution of your choice. Remember that a good solution is not only technically sound but should also result in good user experience.

## 2. Leaving comments

Make it possible for users to leave comments under published posts.

## 3. Typing indicator

You're probaly familiar with typing indicators such as [this one](https://support.signal.org/hc/en-us/articles/360020798451-Typing-Indicators).

Now that users can add comments, add a typing indicator to show others that someone is writing a comment.

## 4. Be prepared to discuss your solutions with us :)

During the technical interview, among other things, we're going to discuss how you approached the tasks. We're probably going to ask you about why you decided on a specific solution, pros and cons of different ways of addressing the same problem etc.

<br />

# ⬇️ PROJECT DOCUMENTATION ⬇️

# Fullstack Example with Next.js (REST API)

This example shows how to implement a **fullstack app in TypeScript with [Next.js](https://nextjs.org/)** using [React](https://reactjs.org/) (frontend), [Express](https://expressjs.com/) and [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client) (backend). It uses a SQLite database file with some initial dummy data which you can find at [`./backend/prisma/dev.db`](./backend/prisma/dev.db).

## Getting Started

### 1. Install npm dependencies:

Install dependencies for your [`backend`](./backend). Open a terminal window and install the `backend`'s dependencies

```bash
cd backend
npm install
```

Open a separate terminal window and navigate to your [`frontend`](./frontend) directory and install its dependencies

```bash
cd frontend
npm install
```

### 2. Create and seed the database (backend)

On the terminal window used to install the backend npm dependencies, run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./backend/prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./backend/prisma/seed.ts) will be executed and your database will be populated with the sample data.

### 3. Start the server (backend)

On the same terminal used in step 2, run the following command to start the server:

```bash
npm run dev
```

The server is now running at [`http://localhost:3001/`](http://localhost:3001/).

### 4. Start the app (frontend)

On the terminal window used to install frontend npm dependencies, run the following command to start the app:

```bash
npm run dev
```

The app is now running, navigate to [`http://localhost:3000/`](http://localhost:3000/) in your browser to explore its UI.

<details><summary>Expand for a tour through the UI of the app</summary>
<br />

**Blog** (located in [`./pages/index.tsx`](./pages/index.tsx))

![](https://imgur.com/eepbOUO.png)

**Signup** (located in [`./pages/signup.tsx`](./pages/signup.tsx))

![](https://imgur.com/iE6OaBI.png)

**Create post (draft)** (located in [`./pages/create.tsx`](./pages/create.tsx))

![](https://imgur.com/olCWRNv.png)

**Drafts** (located in [`./pages/drafts.tsx`](./pages/drafts.tsx))

![](https://imgur.com/PSMzhcd.png)

**View post** (located in [`./pages/p/[id].tsx`](./pages/p/[id].tsx)) (delete or publish here)

![](https://imgur.com/zS1B11O.png)

</details>

## Using the REST API

You can also access the REST API of the API server directly. It is running [`localhost:3001`](http://localhost:3001) (so you can e.g. reach the API with [`localhost:3000/feed`](http://localhost:3001/feed)).

### `GET`

- `/api/post/:id`: Fetch a single post by its `id`
- `/api/feed`: Fetch all _published_ posts
- `/api/filterPosts?searchString={searchString}`: Filter posts by `title` or `content`

### `POST`

- `/api/post`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (optional): The content of the post
    - `authorEmail: String` (required): The email of the user that creates the post
- `/api/user`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (optional): The name of the user

### `PUT`

- `/api/publish/:id`: Publish a post by its `id`

### `DELETE`

- `/api/post/:id`: Delete a post by its `id`

## Evolving the app

Evolving the application typically requires three steps:

1. Migrate your database using Prisma Migrate
1. Update your server-side application code
1. Build new UI features in React

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Profile`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// schema.prisma

model Post {
  id        Int     @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  userId Int     @unique
+  user   User    @relation(fields: [userId], references: [id])
+}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```
npx prisma migrate dev
```

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Profile` table. Here are some examples:

#### Create a new profile for an existing user

```ts
const profile = await prisma.profile.create({
  data: {
    bio: "Hello World",
    user: {
      connect: { email: "alice@prisma.io" },
    },
  },
});
```

#### Create a new user with a new profile

```ts
const user = await prisma.user.create({
  data: {
    email: "john@prisma.io",
    name: "John",
    profile: {
      create: {
        bio: "Hello World",
      },
    },
  },
});
```

#### Update the profile of an existing user

```ts
const userWithUpdatedProfile = await prisma.user.update({
  where: { email: "alice@prisma.io" },
  data: {
    profile: {
      update: {
        bio: "Hello Friends",
      },
    },
  },
});
```

### 3. Build new UI features in React

Once you have added a new endpoint to the API (e.g. `/api/profile` with `/POST`, `/PUT` and `GET` operations), you can start building a new UI component in React. It could e.g. be called `profile.tsx` and would be located in the `pages` directory.

In the application code, you can access the new endpoint via `fetch` operations and populate the UI with the data you receive from the API calls.
