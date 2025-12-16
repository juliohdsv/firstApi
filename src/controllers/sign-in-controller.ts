import type { Request, Response } from "express"
import { z } from "zod"
import { signInUseCase } from "../app/use-cases/sign-in-usecase.js"
import { UnauthorizedError } from "../app/errors/unauthorized-error.js"

const schemaSignUpRequestBody = z.object({
  email: z.email("Email required."),
  password: z
    .string("password required.")
    .min(3, "password must be at least 3 characters long."),
})


export async function signInController(
    request: Request,
    response: Response
){
    try {
      const { email, password } = schemaSignUpRequestBody.parse(request.body)

      const data = await signInUseCase({ email, password })

      return response.status(200).send(data)

  } catch (error) {

    if(error instanceof UnauthorizedError) {
      return response.status(401).send({ message: error.message })
    }
  }
}
