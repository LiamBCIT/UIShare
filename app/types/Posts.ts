import React from 'react';

export type PostsType = {
  title: string
  id: string
  createdAt?: string
  comments?: {
    createdAt: string
    id: string
    postId: string
    userId: string
  }[]
  user: {
    name: string
    image: string
  }
  key?: React.Key // Use React.Key instead of just Key
}

// export type PostsType = {
//   title: string
//   id: string
//   createdAt?: string
//   comments?: {
//     createdAt: string
//     id: string
//     postId: string
//     userId: string
//   }[]
//   user: {
//     name: string
//     image: string
//   }
// }
