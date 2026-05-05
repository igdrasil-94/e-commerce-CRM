import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(__dirname, "db.json");

  app.use(express.json());

  // API Helper
  const getDb = async () => JSON.parse(await fs.readFile(DB_PATH, "utf-8"));
  const saveDb = async (db: any) => await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

  // Middleware to simulate delay
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    next();
  });

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const db = await getDb();
      res.json(db);
    } catch (error) {
      res.status(500).json({ error: "Failed to read database" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const db = await getDb();
      const user = db.auth.users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json({ token: "mock-jwt-token", user: userWithoutPassword });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Auth failed" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const db = await getDb();
      db.settings = { ...db.settings, ...req.body };
      await saveDb(db);
      res.json(db.settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const db = await getDb();
      const newProduct = { ...req.body, id: `p${Date.now()}` };
      db.products.unshift(newProduct);
      await saveDb(db);
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const index = db.products.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        db.products[index] = { ...db.products[index], ...req.body };
        await saveDb(db);
        res.json(db.products[index]);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
        const db = await getDb();
        const newCustomer = { ...req.body, id: `u${Date.now()}` };
        db.customers.unshift(newCustomer);
        await saveDb(db);
        res.json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: "Failed to add customer" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await getDb();
      const index = db.orders.findIndex((o: any) => o.id === id);
      if (index !== -1) {
        db.orders[index].status = status;
        await saveDb(db);
        res.json(db.orders[index]);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
