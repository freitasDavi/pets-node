import prisma from "../../utils/prisma";
import { CreateProductRequest } from "./product.schema";

export async function createProduct(
  data: CreateProductRequest & { ownerId: number }
) {
  return await prisma.product.create({
    data: {
      ...data,
    },
  });
}

export async function getProducts() {
  return await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
