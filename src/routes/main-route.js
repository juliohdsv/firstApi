
import { Router } from "express"

export const mainRoute = Router()

mainRoute.get("/test", (request, response)=> {
  return response.status(200).send({ message: "OK" })
})

 mainRoute.get("/", (request, response)=> {
  return response.status(200).send({ message: "Seja bem-vindo" })
})

 mainRoute.post("/login", (request, response)=> {
  const { email, password } = request.body

  return response.status(201).send({ body: { email, password} })
})
