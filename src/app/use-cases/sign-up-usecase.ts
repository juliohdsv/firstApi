import { hashSync } from "bcrypt"
import { prisma } from "../../lib/prisma/prisma.js"
import "dotenv/config"
import { UserAlreadyExistError } from "../errors/user-already-exist-error.js"

interface ISignUpUseCaseRequest {
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
}: ISignUpUseCaseRequest): Promise<ISignUpUseCaseResponse>{

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if(userExist){
    throw new UserAlreadyExistError()
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

