import type { Request, Response } from "express"
import { z } from "zod"
import { signUpUseCase } from "../../app/use-cases/sign-up-usecase.js"
import { UserAlreadyExistError } from "../../app/errors/user-already-exist-error.js"


const schemaSignUpRequestBody = z.object({
  email: z.email("Email required."),
  password: z
    .string("password required.")
    .min(3, "password must be at least 3 characters long."),
})


export async function signUpController(
    request: Request,
    response: Response
){
    try {
      const { email, password } = schemaSignUpRequestBody.parse(request.body)

      await signUpUseCase({ email, password })

      return response.status(201).send()

  } catch (error) {

    if(error instanceof UserAlreadyExistError) {
      return response.status(409).send({ message: error.message })
    }
  }
}
