import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import UserRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import { ProductRoutes } from "./modules/product/product.route";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";

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

  server.register(swagger, {
    openapi: {
      info: {
        title: "API Exemplo",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Servidor de desenvolvimento",
        },
      ],
    },
  });
  server.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

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
        if (a) {
          console.log(a);
        }
        console.log(`Server ready at ${b}`);
      }
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
