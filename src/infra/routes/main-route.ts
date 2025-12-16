
import { Router } from "express"

import { signUpController } from "../controllers/sign-up-controller.js"
import { signInController } from "../../controllers/sign-in-controller.js"
import { profileController } from "../../controllers/profile-controller.js"
import { isAuth } from "../middlewares/isAuth.js"


export const mainRoute = Router()

 mainRoute.post("/sign-up", signUpController)
 mainRoute.post("/sign-in", signInController)
 mainRoute.get("/profile", isAuth, profileController)


