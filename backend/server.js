import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dbHealth, dbQuery, pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Allow the frontend on Live Server (http://localhost:5500) to call this API.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- In-memory menu (served to frontend) ---
const MENU_ITEMS = [
  {
    id: "cappuccino",
    name: "Cappuccino",
    priceCents: 350,
    description: "Rich espresso with steamed milk and foam.",
    imageUrl: "/images/coffee.jpg",
    category: "breakfast"
  },
  {
    id: "croissant",
    name: "Butter Croissant",
    priceCents: 200,
    description: "Flaky and buttery, baked fresh daily.",
    imageUrl: "/images/croissant.jpg",
    category: "breakfast"
  },
  {
    id: "smoothie",
    name: "Strawberry Smoothie",
    priceCents: 400,
    description: "Refreshing blend of strawberries and yogurt.",
    imageUrl: "/images/smoothie.jpg",
    category: "breakfast"
  },
  {
    id: "chocolate-muffin",
    name: "Chocolate Muffin",
    priceCents: 250,
    description: "Soft, rich muffin loaded with chocolate chips.",
    imageUrl: "/images/pastry.jpg",
    category: "breakfast"
  },
  {
    id: "french-toast",
    name: "French Toast",
    priceCents: 200,
    description:
      "Pan fried toast topped with strawberries, blueberries and powdered sugar.",
    imageUrl: "/images/toast.jpg",
    category: "breakfast"
  },
  {
    id: "lemon-cake",
    name: "Lemon cake",
    priceCents: 200,
    description: "Moist, tart lemon cake.",
    imageUrl: "/images/cake.jpg",
    category: "breakfast"
  },
  {
    id: "banku-tilapia",
    name: "Banku and Tilapia",
    priceCents: 500,
    description:
      "Soft banku and grilled tilapia served with spicy green and black sauce.",
    imageUrl: "/images/banku.jpg",
    category: "main"
  },
  {
    id: "jollof-chicken",
    name: "Jollof and Chicken",
    priceCents: 450,
    description: "Ghanaian jollof rice with grilled chicken.",
    imageUrl: "/images/jollof.jpg",
    category: "main"
  },
  {
    id: "lasanga",
    name: "Lasanga",
    priceCents: 500,
    description: "Tasty, cheesy goodness!",
    imageUrl: "/images/lasanga.jpg",
    category: "main"
  },
  {
    id: "spaghetti-beef",
    name: "Spaghetti with beef tomato sauce",
    priceCents: 600,
    description:
      "Italian spaghetti with hearty sauce, packed with ground beef, tomatoes, garlic, and Italian herbs.",
    imageUrl: "/images/pasta.jpg",
    category: "main"
  },
  {
    id: "mac-n-cheese",
    name: "Mac 'n' Cheese",
    priceCents: 500,
    description: "Tini's 3 cheese thanksgiving mac and cheese.",
    imageUrl: "/images/man_n_cheese.jpg",
    category: "main"
  }
];

function isValidEmail(email) {
  // Simple sanity check (good enough for class projects)
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatMoneyUSD(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// --- API routes ---
app.get("/api/health", async (req, res) => {
  const db = await dbHealth();
  res.json({ ok: true, db });
});

app.get("/api/menu", async (req, res) => {
  // If the DB has menu_items, serve from DB; otherwise fall back to in-memory list.
  try {
    const { rows } = await dbQuery(
      `select id, name, description, image_url as "imageUrl", category, price_cents as "priceCents"
       from menu_items
       where is_active = true
       order by category, name`,
      []
    );
    if (rows.length > 0) {
      return res.json({ items: rows, source: "db" });
    }
  } catch (e) {
    // If DB isn't configured yet, or tables aren't created yet, continue with in-memory menu.
    const isNotConfigured = e?.code === "DB_NOT_CONFIGURED";
    const isUndefinedTable =
      e?.code === "42P01" ||
      String(e?.message || "").toLowerCase().includes("does not exist");
    if (!isNotConfigured && !isUndefinedTable) {
      return res.status(500).json({ error: e?.message || "Database error" });
    }
  }

  res.json({ items: MENU_ITEMS, source: "memory" });
});

app.get("/api/orders", async (req, res) => {
  try {
    const { rows } = await dbQuery(
      `
      select
        o.id,
        o.created_at as "createdAt",
        o.customer_name as "customerName",
        o.customer_email as "customerEmail",
        o.menu_item_id as "itemId",
        mi.name as "itemName",
        o.quantity,
        o.unit_price_cents as "unitPriceCents",
        (o.quantity * o.unit_price_cents) as "subtotalCents"
      from orders o
      left join menu_items mi on mi.id = o.menu_item_id
      order by o.created_at desc
      limit 100
      `,
      []
    );
    res.json({ orders: rows });
  } catch (e) {
    if (e?.code === "DB_NOT_CONFIGURED") {
      return res.status(503).json({
        error:
          "Database not configured. Set DATABASE_URL (Render Postgres) and create the required tables in pgAdmin."
      });
    }
    if (e?.code === "42703") {
      return res.status(500).json({
        error:
          'Database schema mismatch: column "menu_item_id" (and related columns) is missing from "orders". Update your orders table in pgAdmin to include menu_item_id, quantity, and unit_price_cents.'
      });
    }
    res.status(500).json({ error: e?.message || "Database error" });
  }
});

app.post("/api/orders", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const itemId =
    typeof req.body?.itemId === "string" ? req.body.itemId.trim() : "";
  const quantityRaw = req.body?.quantity;
  const quantity = Number(quantityRaw);

  if (!pool) {
    return res.status(503).json({
      error:
        "Database not configured. Set DATABASE_URL (Render Postgres) and create the required tables in pgAdmin."
    });
  }

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Valid email is required." });
  }
  if (!itemId) {
    return res.status(400).json({ error: "Item is required." });
  }
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
    return res.status(400).json({ error: "Quantity must be between 1 and 50." });
  }

  const item = MENU_ITEMS.find((x) => x.id === itemId);

  // Prefer DB price/name if menu_items exists; fallback to in-memory.
  let menuItem = item || null;
  try {
    const { rows } = await dbQuery(
      `select id, name, price_cents as "priceCents"
       from menu_items
       where id = $1 and is_active = true
       limit 1`,
      [itemId]
    );
    if (rows[0]) menuItem = rows[0];
  } catch (e) {
    if (e?.code === "DB_NOT_CONFIGURED") {
      // ignore; still can validate against in-memory list
    } else {
      return res.status(500).json({ error: e?.message || "Database error" });
    }
  }

  if (!menuItem) {
    return res.status(400).json({ error: "Selected item not found." });
  }

  const unitPriceCents = menuItem.priceCents;
  const subtotalCents = unitPriceCents * quantity;

  const client = await pool.connect();
  try {
    await client.query("begin");

    const insertedOrder = await client.query(
      `insert into orders (customer_name, customer_email, menu_item_id, quantity, unit_price_cents)
       values ($1, $2, $3, $4, $5)
       returning id, created_at as "createdAt"`,
      [name, email, itemId, quantity, unitPriceCents]
    );
    const orderRow = insertedOrder.rows[0];

    await client.query("commit");

    const order = {
      id: orderRow.id,
      createdAt: orderRow.createdAt,
      customer: { name, email },
      item: { id: menuItem.id, name: menuItem.name, priceCents: unitPriceCents },
      quantity,
      subtotalCents
    };

    return res.status(201).json({
      message: "Order received!",
      order: {
        ...order,
        subtotal: formatMoneyUSD(order.subtotalCents),
        unitPrice: formatMoneyUSD(order.item.priceCents)
      }
    });
  } catch (e) {
    try {
      await client.query("rollback");
    } catch {
      // ignore
    }
    if (e?.code === "42703") {
      return res.status(500).json({
        error:
          'Database schema mismatch: your "orders" table is missing required columns (menu_item_id, quantity, unit_price_cents). Add them in pgAdmin and try again.'
      });
    }
    return res.status(500).json({ error: e?.message || "Database error" });
  } finally {
    client.release();
  }
});

// --- Serve frontend ---
const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

// Fallback to index.html for any non-API route (useful for single-page layouts)
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});


