import express from "express";

const app = express();

app.use(express.json())

app.get("/test", (request, response)=> {
  return response.status(200).send({ message: "Minha segunda API" })
})

app.get("/", (request, response)=> {
  return response.status(200).send({ message: "Seja bem-vindo" })
})

app.listen(3333, ()=> console.log("Server running in dev mode."))