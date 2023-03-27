import prisma from "../../../prisma/client";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log('met==>>', req.method, 'body==>>', req.body)
  if (!session) {
    return res
      .status(401)
      .json({ message: "Please sign in to edit a comment." });
  }
  //Get User
  /*const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });*/
  if (req.method === "PATCH") {
    const { title, commentId } = req.body.data;
    console.log(title, commentId);
    if (!title.length) {
      return res.status(401).json({ message: "Please enter some text" });
    }
    try {
      const result = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          title,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occurred while updating a comment" });
    }
  }
}
