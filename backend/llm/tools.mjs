// tools.js
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product, Variant, OrderItem, Order } from '../models/index.js';
import { fn, literal, Op, col } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// Tool: Get all products
// ----------------------
const getAllProductsFromDB = async () => {
  try {
    const products = await Product.findAll({
      where: { status: 'Available' },
      include: [{ model: Variant }]
    });

    if (!products.length) return "No products found.";

    return products.map((p) => {
      const variants = p.variants && p.variants.length > 0 
        ? p.variants.map((v) =>
            `  ${v.size} | ${v.color}:\n    Price: ₱${v.price}, Stock: ${v.stock}`
          ).join('\n')
        : '  No variants available';
      
      return `Product: ${p.product_name} (${p.category})\nDescription: ${p.description}\nVariants:\n${variants}`;
    }).join('\n\n');
  } catch (err) {
    console.error("Error fetching products:", err);
    return "Failed to fetch products from database.";
  }
};

export const productTool = tool(
  getAllProductsFromDB,
  {
    name: "productSearchTool",
    description: "Search products by name, stock, prices from the inventory.",
    schema: z.object({})
  }
);

// ---------------------------
// Tool: Get total products sold
// ---------------------------
const getProductsTotalSold = async () => {
  try {
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
          where: { status: { [Op.in]: ["Delivered", "Completed"] } }
        },
        {
          model: Product,
          attributes: ["product_name"],
          as: 'product',
          required: true
        }
      ],
      group: ["product_id", "product.product_id", "product.product_name"],
      order: [[literal("totalSold"), "DESC"]],
      raw: false
    });

    if (!products.length) {
      return "No sales data found for completed orders.";
    }

    return products.map((p) => 
      `Product: ${p.product.product_name}\nQuantity Sold: ${p.dataValues.totalSold}`
    ).join('\n\n');

  } catch (err) {
    console.error("Error fetching total sold:", err);
    return "Failed to fetch total sold products.";
  }
};

export const productsTotalSoldTool = tool(
  getProductsTotalSold,
  {
    name: "productTotalSoldTool",
    description: "Retrieve the total quantity sold per product to identify top-selling items",
    schema: z.object({})
  }
);

// ----------------------
// Tool: Read QA text file
// ----------------------
const readQATextFile = async () => {
  const filePath = path.join(__dirname, "..", "public", "qa.txt");

  if (!fs.existsSync(filePath)) {
    return `File not found: ${filePath}`;
  }

  try {
    const text = fs.readFileSync(filePath, "utf8");

    return text || "QA file is empty.";
  } catch (err) {
    console.error("Text file read error:", err);
    return "Failed to read QA file.";
  }
};

export const textReaderTool = tool(
  readQATextFile,
  {
    name: "textReaderTool",
    description: `
Use this tool to answer customer questions by looking up information in the QA text file.
The QA file contains common questions and answers about Ballin Wear products, returns, orders, shipping, and policies.
If a customer's question matches or is related to something in the QA file, use this tool to provide the answer.
Do not guess—always rely on the QA file content for these questions.
    `,
    schema: z.object({})
  }
);