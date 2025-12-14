import { hashSync } from "bcrypt"
import { prisma } from "../lib/prisma/prisma.js"
import "dotenv/config"

interface ISugnUpUseCaseRequest {
  email: string
  password: string
}

interface ISignUpUseCaseResponse {
  user: {
    id: string
    email: string
    password: string
    createdAt: Date
  }
}

export async function signUpUseCase({
  email,
  password
}: ISugnUpUseCaseRequest): Promise<ISignUpUseCaseResponse>{

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if(userExist){
    throw new Error("User already exist.")
  }

  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
  const hashPassword = hashSync(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    }
  })

  return {
    user,
  }
}

