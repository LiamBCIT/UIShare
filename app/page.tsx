"use client"
import React,{useState} from 'react'
import Post from "./Post"
import AddPost from "./AddPost"
import { useQuery } from "react-query"
import axios from "axios"
import { PostsType } from "./types/Posts"
import '../styles/global.css'

//Fetch All posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts")
  return response.data
}

export default function Home() {
  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  })
  if (error) return error
  if (isLoading) return "Loading....."
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-20 mb-16">
            <h2 className="font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">UIShare
            </h2>
            <h3 className="font-display font-regular text-4xl md:text-4xl text-center max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-6">
                <span className="block">Share UI Design Tips and Tricks</span>
            </h3>
          </div>
      <AddPost />
      {data?.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          comments={post.comments}
        />
      ))}
    </div>
  )
}
