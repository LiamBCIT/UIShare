import { PrismaClient } from "@/prisma/client" 

const client = globalThis.prisma || new PrismaClient() //creating 1 new prisma client, if exists: it will check on global enviorment (gloalThis for if .prisma exists in client) if yes, it creates a new one
if (process.env.NODE_ENV !== "production") globalThis.prisma = client //if in production or not

export default client

// client.user.findAny()