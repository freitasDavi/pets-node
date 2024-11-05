import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productRequest = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...productRequest,
});
const productResponse = z.object({
  ...productRequest,
  ...productGenerated,
});

const productsResponseSchema = z.array(productResponse);

export type CreateProductRequest = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponse,
    productsResponseSchema,
  },
  {
    $id: "productsSchema",
  }
);
