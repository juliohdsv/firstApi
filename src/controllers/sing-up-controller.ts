import type { Request, Response } from "express"
import { z, ZodError } from "zod"

import { prisma } from "../lib/prisma/prisma.js"


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

      const userExist = await prisma.user.findUnique({
        where: {
          email,
        }
      })
    
      if(userExist){
        return response.status(409).send({ message: "User already exist." })
      }

      const users = await prisma.user.create({
        data: {
          email,
          password,
        }
      })
      
      return response.status(201).send({ users })
  
  } catch (error) {

    if(error instanceof ZodError) {
      return response.status(400).send({ 
        message: "Validation error", 
        issues: error.format() 
      })
    }
    
    return response.status(500).send({ message: "Internal server error." })
  }
}