"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Toggle from "./dashboard/Toggle";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import axios from "axios";

type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  postTitle: string;
  comments?: {
    id: string;
    postId: string;
    userId: string;
  }[];
  isAuthenticated: boolean; // add this prop
};

export default function Post({
  id,
  name,
  avatar,
  postTitle,
  comments,
  title,
  isAuthenticated, // add this prop
}: EditProps) {
  
  const [postToEdit, setPostToEdit] = useState("");
  const [updatedPostTitle, setUptedPostTitle] = useState(postTitle);
  const [toggle, setToggle] = useState(false);
  const queryClient = useQueryClient();
  let deleteToastID: string;

  const deletePostMutation = useMutation(
    async (id: string) => await axios.delete("/api/posts/deletePost", { data: id }),
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

  const editPost = useMutation(
    async (data: Comment) => {
      return axios.patch("/api/posts/editPost", { data });
    },
    {
      onSuccess: (res) => {
        console.log("data==>>", res);
        // setCommentToEdit(data?.comments.find(c => c.id === commentToEdit)?.title);
        setPostToEdit("");
        queryClient.invalidateQueries(["posts"]);
        //setTitle("");
        toast.success("Edited your comment");
        window.location.reload();
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

  const deletePost = () => {
    deleteToastID = toast.loading("Deleting your post.", { id: deleteToastID });
    deletePostMutation.mutate(id);
  };

  const handleEditPost = (postId: string) => {
    if (postToEdit) {
      console.log("ddd==>>", { updatedPostTitle, postId });
      //mutate({ title, commentId });
      const data: any = {
        title: updatedPostTitle,
        postId,
      };
      editPost.mutate(data);
    } else {
      setPostToEdit(postId);
    }
  };

  return (
  <>
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ ease: "easeOut" }}
      className="bg-gradient-to-r from-purple-500 to-pink-500 outline-4 my-8 p-8 rounded-lg "
    >
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          src={avatar}
          alt="avatar"
        />
        <h3 className="font-medium text-white">{name}</h3>
      </div>
      <div className="my-8 ">
        {postToEdit === id ? 
            <input className="text-black" value={ updatedPostTitle} onChange={e => {
              e.stopPropagation()
              setUptedPostTitle(e.target.value)} }/> :
            <div className="py-4 text-white">{postTitle}</div>}
      </div>

      <div className="flex gap-4 cursor-pointer items-center">
        <Link
          href={{
            pathname: `/post/${id}`,
          }}
        >
          <p className=" text-sm font-medium text-white underline">
            {comments?.length} Comments
          </p>
        </Link>

          <button className="text-white text-sm" onClick={() => handleEditPost(id)}>{postToEdit === id ? 'Update' : 'Edit'}</button><button
              onClick={(e) => {
                e.stopPropagation();
                setToggle(true);
              } }
              className="text-sm font-medium text-white"
            >
              Delete
          </button>

      </div>
    </motion.div>
  {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
</>
  )
}
