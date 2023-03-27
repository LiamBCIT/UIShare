"use client"

import Post from "../../Post";
import AddComment from "../../AddComment";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { PostType } from "../../types/Post";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import Toggle from "../../dashboard/Toggle";

type URL = {
  params: {
    slug: string;
  };
  searchParams?: string;
};

//Fetch All posts
const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

type Comment = {
  commentId?: string;
  title: string;
};

export default function PostDetail(url: URL) {
  const [commentToEdit, setCommentToEdit] = useState("");
  const [title, setTitle] = useState("");
  const { data, isLoading } = useQuery<PostType>({
    queryKey: ["detail-post", url.params.slug],
    queryFn: () => fetchDetails(url.params.slug),
  });

  console.log(data);

  //delete functionality
  const [toggle, setToggle] = useState(false);
  const queryClient = useQueryClient();
  let deleteToastID: string;
  const deletePostMutation = useMutation(
    async (id: string) => await axios.delete(`/api/posts/${id}`),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries("getAuthPosts");
        toast.success("Post has been deleted.", { id: deleteToastID });
      },
    }
  );

  const { mutate } = useMutation(
    async (data: Comment) => {
      return axios.patch(`/api/posts/editComment/${data.commentId}`, {
        title: data.title,
      });
    },
    {
      onSuccess: (res) => {
        console.log("data==>>", res);
        setCommentToEdit("");
        queryClient.invalidateQueries(["detail-post"]);
        setTitle("");
        toast.success("Edited your comment");
      },
      onError: (error) => {
        console.log("error==>>", error);
        /*console.log(error)
        setIsDisabled(false)
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.messfvage, { id: commentToastId })
        }*/
      },
    }
  );

  const deletePost = (id: string) => {
    deleteToastID = toast.loading("Deleting your post.", { id: deleteToastID })
    deletePostMutation.mutate(id)
  }

  const handleEditComment = (commentId: string) => {
    if (commentToEdit === commentId) {
      mutate({ title, commentId });
    } else {
      const comment = data?.comments?.find((c) => c.id === commentId);
      setTitle(comment?.title || "");
      setCommentToEdit(commentId);
    }
  };

  if (isLoading) return "Loading";

  return (
    <div>
      <Post
        id={data?.id!}
        name={data?.user.name!}
        avatar={data?.user.image!}
        postTitle={data?.title!}
        comments={data?.comments} title={""} isAuthenticated={false}      />
      <AddComment id={data?.id} />
      {data?.comments?.map((comment) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ ease: "easeOut" }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 my-8 p-8 rounded-lg text-white"
          key={comment.id}
        >
          <div className="flex items-center gap-2">
            <Image
              width={24}
              height={24}
              src={comment.user?.image}
              alt="avatar"
            />
            <h3 className="font-bold text-white">{comment?.user?.name}</h3>
            <h2 className="text-sm text-white">{comment.createdAt}</h2>
          </div>
          {commentToEdit === comment.id ? 
          <input className="text-black" value={title} onChange={e => setTitle(e.target.value)} /> :
          <div className="py-4">{comment.title}</div>}
          <button className="text-white text-sm" onClick={() => handleEditComment(comment.id)} >{commentToEdit === comment.id ? 'Update' : 'Edit'}</button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setToggle(true)
              deletePost(data.id)
            }}
            className="text-sm font-medium text-white pl-4"
          >
            Delete
          </button>
        </motion.div>
      ))}
      {/* {toggle && (
        <Toggle
          deletePost={() => deletePost(data.id)}
          setToggle={setToggle}
        />
      )} */}
    </div>
  );
}
