import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import UserRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { ProductRoutes } from "./modules/product/product.route";

export const server = fastify();

server.register(fjwt, {
  secret: "epyjq9034yu390239450tkfgmsa5urjions",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.get("/healthcheck", async function () {
  return {
    status: "OK",
  };
});

const schemas = [...userSchemas, ...productSchemas];

async function main() {
  for (const schema of schemas) {
    server.addSchema(schema);
  }

  server.register(UserRoutes, {
    prefix: "api/users",
  });

  server.register(ProductRoutes, {
    prefix: "api/products",
  });

  try {
    await server.listen(
      {
        port: 3000,
        host: "0.0.0.0",
      },
      (a, b) => {
        console.log(`Server ready at ${b}`);
      }
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
