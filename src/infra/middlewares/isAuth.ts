import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload} from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  sub: string
}

export function isAuth(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    const authHeader = request.headers.authorization

    if(!authHeader){
      return response.status(401).send({ message: "Unauthorized." })
    }

    const [_, token] = authHeader.split(' ')
    const JWT_SECRET = String(process.env.JWT_SECRET)
    const { sub } = jwt.verify(String(token), JWT_SECRET) as TokenPayload

    request.userId = sub

    return next()

  } catch (error) {
    return response.status(401).send({ message: "Unauthorized." })
  }

}
