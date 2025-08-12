// Import necessary modules
const express = require("express");
const OrderService = require("../../../services/OrderServiceClient");

// Create a new Express router
const router = express.Router();

// Route for getting all orders
router.get("/", async (req, res) => {
  try {
    const orders = await OrderService.getAll();
    return res.render("admin/orders", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    req.session.messages.push({
      type: "danger",
      text: "There was an error fetching the orders"
    });
    return res.redirect("/");
  }
});

// Route for setting an order's status to "Shipped"
router.get("/setshipped/:orderId", async (req, res) => {
  try {
    // Use the OrderService to update the status of an order
    await OrderService.setStatus(req.params.orderId, "Shipped");

    // Push a success message to the session
    req.session.messages.push({
      type: "success",
      text: "Status updated"
    });

    // Redirect back to the admin orders page
    return res.redirect("/admin/orders");
  } catch (err) {
    // Push an error message to the session
    req.session.messages.push({
      type: "danger",
      text: "There was an error updating the order"
    });
    // Log the error and redirect back to the admin orders page
    console.error(err);
    return res.redirect("/admin/orders");
  }
});

// Export the router
module.exports = router;
