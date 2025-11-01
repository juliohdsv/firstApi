
import { Router } from "express"

const users = []

export const mainRoute = Router()

 mainRoute.post("/sign-up", (request, response)=> {
  const { email, password } = request.body

  if(!email){
    return response.status(400).send({ message: "Email required." })
  }

  if(!password){
    return response.status(400).send({ message: "password required." })
  }

  const userExist = users.find(item => item.email == email)

  if(userExist){
    return response.status(409).send({ message: "User already exist." })
  }

  users.push({ email, password })

  return response.status(201).send({ users })
})