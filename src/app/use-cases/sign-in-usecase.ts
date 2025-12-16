import { compare } from "bcrypt"
import { prisma } from "../../lib/prisma/prisma.js"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { UserAlreadyExistError } from "../errors/user-already-exist-error.js"
import { UnauthorizedError } from "../errors/unauthorized-error.js"

interface ISignInUseCaseRequest {
  email: string
  password: string
}

interface ISignInUseCaseResponse {
  user: {
    email: string
  },
  token: string
}

export async function signInUseCase({
  email,
  password
}: ISignInUseCaseRequest): Promise<ISignInUseCaseResponse>{

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if(!userExist){
    throw new UserAlreadyExistError()
  }

  const matchPassword = await compare(password, userExist.password)

  if(!matchPassword){
    throw new UnauthorizedError()
  }

  const JWT_SECRET = String(process.env.JWT_SECRET)
  const token = jwt.sign(
    {
      sub: userExist.id,
    },
    JWT_SECRET,
    {
      expiresIn: 30
    }
  )

  return {
    user: {
      email: userExist.email,
    },
    token,
  }
}

