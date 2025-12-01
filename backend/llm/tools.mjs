// tools.js
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Product, Variant, OrderItem, OrderAddress, Order, Thumbnail } from '../models/index.js';
import { fn, literal, Op, col } from "sequelize";
import { formatDate } from "../utils/date.js";

// ----------------------
// Tool: Get all products
// ----------------------
const getAllProductsFromDB = async () => {
  try {
    const products = await Product.findAll({
      where: { status: 'Available' },
      include: [
        { 
          model: Variant,
          required: false // Use LEFT JOIN to include products even without variants
        }, 
        { 
          model: Thumbnail,
          required: false // Use LEFT JOIN in case some products don't have thumbnails
        }
      ]
    });

    if (!products.length) return "No products found.";

    return products.map((p) => {
      const variants = p.variants && p.variants.length > 0 
        ? p.variants.map((v) =>
            `  ${v.size} | ${v.color}:\n    Price: ₱${v.price}, Stock: ${v.stock}`
          ).join('\n')
        : '  No variants available';
      
      const imageUrl = p.thumbnail ? p.thumbnail.thumbnailUrl : 'No image available';
      
      return `Product: ${p.product_name}\nCategory: ${p.category}\nImage: ${imageUrl}\nVariants:\n${variants}`;
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
          required: true,
          include: [
            { 
              model: Thumbnail,
              required: false // Use LEFT JOIN in case some products don't have thumbnails
            }
          ]
        }
      ],
      group: ["product_id", "product.product_name"],
      order: [[literal("totalSold"), "DESC"]],
      raw: false
    });

    if (!products.length) {
      return "No sales data found for completed orders.";
    }

    return products.map((p) => {
      const imageUrl = p.product.thumbnail ? p.product.thumbnail.thumbnailUrl : 'No image available';
      return `Product: ${p.product.product_name}\nImage: ${imageUrl}\nQuantity Sold: ${p.dataValues.totalSold}`;
    }).join('\n\n');

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


const getOrderDetailsFromDB = async ({ order_id }) => {
  try {
    const order = await Order.findOne({
      where: { order_id },
      include: [
        {
          model: OrderItem,
          required: false,
          as: 'order_items',
          include: [
            {
              model: Product,
              required: false,
              as: 'product'
            }
          ]
        },
        {
          model: OrderAddress,
          required: false,
          as: 'orderAddress'
        },
      ]
    });

    if (!order) {
      return `No order found with ID: ${order_id}`;
    }

    // Summary
    const summary = `
Order ID: ${order.order_id}
Customer ID: ${order.customer_id}
Status: ${order.status}
Payment Method: ${order.payment_method}
Subtotal: ₱${order.subtotal}
Shipping Fee: ₱${order.shipping_fee}
Total: ₱${order.total}
Order Date: ${formatDate(order.order_date)}
`;

const cancellation_reason = order?.cancellation_reason || `No cancellation reason.`

    // Address
    const address = order.orderAddress
      ? `
Shipping Address:
  Name: ${order.orderAddress.fullname}
  ${order.orderAddress.address_line_1}
  ${order.orderAddress.address_line_2}
  ${order.orderAddress.admin_area_2}, ${order.orderAddress.admin_area_1}
  ${order.orderAddress.postal_code}
  Phone: ${order.orderAddress.phone}\n
`
      : "No shipping address found.\n";

    // Items
    const items = order.order_items.length
      ? order.order_items
          .map((item, i) => {
            return `
Item ${i + 1}:
Product Name: ${item.product.product_name}\n
Size: ${item.size}\n
Color: ${item.color}\n
Price: ₱${item.price}\n
Quantity: ${item.quantity}\n
Total: ₱${item.total}\n\n
`;
          })
          .join("\n")
      : "No items found for this order.";

    return `Order summary:${summary}\n${address}\nOrder items:\n${items}\nCancellation Reason:${cancellation_reason}\n`;
  } catch (err) {
    console.log("Error fetching order details:", err);
    return "Failed to fetch order details.";
  }
};

export const orderDetailsTool = tool(
  getOrderDetailsFromDB,
  {
    name: "orderDetailsTool",
    description: "Get order details by order_id",
    schema: z.object({
      order_id: z.string().describe("Order ID to retrieve")
    })
  }
);

/*
// ----------------------
// Tool: Read QA text file
// ----------------------
const readQATextFile = async () => {
  const filePath = path.join(__dirname, "..", "public", "qa.txt");

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return `QA file not found at: ${filePath}`;
    }

    // Read file with error handling
    const text = fs.readFileSync(filePath, "utf8");

    // Check if file has content
    if (!text || text.trim().length === 0) {
      return "QA file exists but is empty.";
    }

    return text.trim();
  } catch (err) {
    console.error("Error reading QA file:", err);
    return `Failed to read QA file: ${err.message}`;
  }
};

export const textReaderTool = tool(
  readQATextFile,
  {
    name: "textReaderTool",
    description: `
Use this tool to answer customer questions by looking up information in the QA text file.
The QA file contains common questions and answers about Ballin Wear.
If a customer's question matches or is related to something in the QA file, use this tool to provide the answer.
Do not guess—always rely on the QA file content for these questions.
    `,
    schema: z.object({})
  }
); */