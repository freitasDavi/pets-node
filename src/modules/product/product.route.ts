import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

export async function ProductRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        description: "post some data",
        tags: ["Products"],
        summary: "create",
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productResponse"),
          default: {
            description: "Default response",
            type: "object",
            properties: {
              foo: { type: "string" },
            },
          },
        },
      },
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        description: "post some data",
        tags: ["Products"],
        summary: "get all",
        response: {
          200: $ref("productsResponseSchema"),
          default: {
            description: "Default response",
            type: "object",
            properties: {
              foo: { type: "string" },
            },
          },
        },
      },
    },
    getProductsHandler
  );
}
