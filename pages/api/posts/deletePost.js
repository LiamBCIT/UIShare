import prisma from "../../../prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Please signin to delete a post." });
  }

  if (req.method === "DELETE") {
    const postId = req.body;
    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!prismaUser) {
      res.status(401).json({ message: "User not found or Unauthorized!" });
      return;
    }
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post) {
        res.status(404).json({ message: "Post not found." });
        return;
      }
      if (post.userId !== prismaUser.id) {
        res.status(401).json({ message: "You're unauthorized to delete this post." });
        return;
      }
      const result = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while deleting a post" });
    }
  }
}