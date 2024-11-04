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

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
