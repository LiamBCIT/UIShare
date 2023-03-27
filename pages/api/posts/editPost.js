import prisma from "../../../prisma/client";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) { //post
  const session = await unstable_getServerSession(req, res, authOptions); //is there a session?
  console.log('met==>>', req.method, 'body==>>', req.body)

  if (!session) { //if no session = unauthorized
    res.status(401).json({ message: "Please sign in to edit a post. You're unauthorized!" });
    return 
  }

  // Get User
  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!prismaUser) {
    res.status(401).json({ message: "User not found or Unauthorized!" });
    return 
  }

  if (req.method === "PATCH") {
    const { title, postId } = req.body.data; //if authorized = update post and throw it into prisma database, but make it associated with user in Prisma
    console.log(title, postId);

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          userId: true,
        },
      });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      if (post.userId !== prismaUser.id) {
        res.status(403).json({ message: "You are not authorized to edit this post!" });
        return;
      }

      if (!title.length) {
        return res.status(400).json({ message: "Please enter some text" });
      }

      const result = await prisma.post.update({ 
        where: {
          id: postId,
        },
        data: {
          title,
        },
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error has occurred while updating a post" });
    }
  }
}