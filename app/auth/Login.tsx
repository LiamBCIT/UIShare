"use client"

import { signIn } from "next-auth/react"

export default function Login() {
  return (
    <li>
      <button className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-white px-6 py-2" onClick={() => signIn()}>Sign In</button>
    </li>
  )
}
