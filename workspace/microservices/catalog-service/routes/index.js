const express = require("express");

const requireAdmin = require("../lib/requireAdmin");
const CatalogService = require("../lib/CatalogService");

const router = express.Router();

function createResponse(item) {
  return { id: item.id, price: item.price, name: item.name, sku: item.sku };
}

router.get("/items", async (req, res) => {
  try {
    const items = await CatalogService.getAll();
    return res.json(items.map(createResponse));
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.getOne(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    }
    return res.json(createResponse(item));
  } catch (error) {
    console.error("Error fetching item:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.post("/items", requireAdmin, async (req, res) => {
  try {
    const newItem = await CatalogService.create(req.body);
    return res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.put("/items/:id", requireAdmin, async (req, res) => {
  try {
    const updatedItem = await CatalogService.update(req.params.id, req.body);
    if (!updatedItem) {
      res.status(404).json({ error: "Item not found" });
    }
    return res.json(createResponse(updatedItem));
  } catch (error) {
    console.error("Error updating item:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

router.delete("/items/:id", requireAdmin, async (req, res) => {
  try {
    const deletionResult = await CatalogService.remove(req.params.id);
    if (deletionResult.deletedCount === 0) {
      res.status(404).json({ error: "Item not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting item:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

module.exports = router;
