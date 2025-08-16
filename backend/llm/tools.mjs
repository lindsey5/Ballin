import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product, Variant } from '../models/index.js';

export const productTool = tool(
  async () => {
    const products = await Product.findAll({
      where: { status: 'Available' },
      include: [{ model: Variant }]
    });

    if (!products.length) return "No products found.";

    return products
      .map((p) => {
        const variants = p.variants
          .map(
            (v) =>
              `SKU: ${v.sku}, Price: $${v.price}, Stock: ${v.stock}, Size: ${v.size}, Color: ${v.color}`
          )
          .join('\n  ');

        return `Product: ${p.product_name} (${p.category})\nDescription: ${p.description}\nVariants:\n  ${variants}`;
      })
      .join('\n\n');
  },
  {
    name: "productSearchTool",
    description: "Search products by name, stock, prices from the inventory.",
    schema: z.object({}) 
  }
);
