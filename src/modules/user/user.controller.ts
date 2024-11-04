import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail } from "./user.service";
import { CreateUserInput, LoginRequest } from "./user.schema";
import { compare } from "bcrypt";
import { server } from "../../app";

async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.status(201).send(user);
  } catch (e) {
    console.error(e);
    return reply.status(400).send(e);
  }
}

async function loginHandler(
  request: FastifyRequest<{
    Body: LoginRequest;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.status(401).send({
      message: "Invalid email or password",
    });
  }

  const passwordMatches = compare(body.password, user.password);

  if (!passwordMatches) {
    return reply.status(401).send({
      message: "Invalid email or password",
    });
  }

  const { password, ...rest } = user;

  return reply.status(200).send({ accessToken: server.jwt.sign(rest) });
}

export { registerUserHandler, loginHandler };
