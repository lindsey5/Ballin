import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product, Variant, OrderItem, Order } from '../models/index.js';
import { fn, literal, Op, col } from "sequelize";

const getAllProductsFromDB = async () => {
    const products = await Product.findAll({
      where: { status: 'Available' },
      include: [{ model: Variant }]
    });

    if (!products.length) return "No products found.";

    return products.map((p) => {
        const variants = p.variants.map((v) =>`  ${v.size} | ${v.color}: \n  Price: ₱${v.price}, Stock: ${v.stock}`).join('\n  ');
        return `Product: ${p.product_name} (${p.category})\nDescription: ${p.description}\nVariants:\n  ${variants}`;
    }).join('\n\n');
}

export const productTool = tool(
  getAllProductsFromDB,
  {
    name: "productSearchTool",
    description: "Search products by name, stock, prices from the inventory.",
    schema: z.object({}) 
  }
);

const getProductsTotalSold = async () => {
    try{
    const products = await OrderItem.findAll({
      attributes: [
          "product_id",
          [fn("SUM", col("quantity")), "totalSold"]
      ],
      include: [
          {
            model: Order,
            attributes: ['status'],
            as: 'order',
            required: true,
            where: {  status: { [Op.in]: ["Delivered", "Completed"] } }
          },
          {
            model: Product,
            attributes: ["product_name"],
            as: 'product',
          }
      ],
      group: ["product_id"],
      order: [[literal("totalSold"), "DESC"]],
    });
    return products.map((p) => `Product: ${p.product.product_name}\nQuantity Sold: ${p.dataValues.totalSold}`).join('\n\n');
  }catch(err){
    console.log(err)
  }
}

export const productsTotalSoldTool = tool(
  getProductsTotalSold,
  {
    name: "productTotalSoldTool",
    description: "Retrieve the total quantity sold per product to identify top-selling items",
    schema: z.object({}) 
  }
)