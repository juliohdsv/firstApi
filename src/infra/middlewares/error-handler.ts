import type { Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response
){

  if(error instanceof ZodError) {
    return response.status(400).send({
      message: "Validation error",
      issues: error.format()
    })
  }

  return response.status(500).send({ message: "Internal server error." })
}
