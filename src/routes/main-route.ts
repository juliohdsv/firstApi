
import { Router } from "express"

import { signUpController } from "../controllers/sign-up-controller.js"


export const mainRoute = Router()

 mainRoute.post("/sign-up", signUpController)


