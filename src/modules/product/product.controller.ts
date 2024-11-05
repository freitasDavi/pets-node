import { FastifyReply, FastifyRequest } from "fastify";
import { createProduct, getProducts } from "./product.service";
import { CreateProductRequest } from "./product.schema";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductRequest;
  }>,
  reply: FastifyReply
) {
  try {
    const product = await createProduct({
      ...request.body,
      ownerId: request.user.id,
    });

    return reply.status(201).send(product);
  } catch (e) {
    return reply.status(400).send({ errorMessage: e });
  }
}

export async function getProductsHandler(
  _: FastifyRequest,
  reply: FastifyReply
) {
  const products = await getProducts();

  return reply.status(200).send(products);
}
