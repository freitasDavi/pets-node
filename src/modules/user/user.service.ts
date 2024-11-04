import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput } from "./user.schema";

const saltRounds = 10;

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;
  const passwordHashed = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      ...rest,
      password: passwordHashed,
    },
  });

  return user;
}
