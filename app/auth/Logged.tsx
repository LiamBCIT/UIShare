"use client"

import Image from "next/image"
import { signOut } from "next-auth/react"
import Link from "next/link"

type User = {
  image: string
}

export default function Logged({ image }: User) {
  return (
    <li className="flex gap-8 items-center">
      <button
        className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-white text-lg px-6 py-2"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
      <Link href={"/dashboard"}>
        <Image
          width={64}
          height={64}
          className="w-14 rounded-full"
          src={image}
          alt=""
          priority
        />
      </Link>
    </li>
  )
}
