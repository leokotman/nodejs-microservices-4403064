const amqp = require("amqplib");
const express = require("express");
const morgan = require("morgan");

const OrderService = require("./lib/OrderService");

const app = express();
const routes = require("./routes");
const config = require("./config");

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log HTTP requests
app.use(morgan("tiny"));

// Mount the router
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  // You can also log the error to a file or console
  console.error(err);

  res.status(status).json({
    error: {
      message,
      status
    }
  });
});

// RabbitMQ queue connection and message consumption
(async () => {
  try {
    const connection = await amqp.connect("amqp://127.0.0.1");
    const channel = await connection.createChannel();
    const queue = "orders";
    await channel.assertQueue(queue, { durable: true });
    console.log(" [x] Waiting for messages in %s", queue);
    channel.consume(
      queue,
      async (message) => {
        const order = JSON.parse(message.content.toString());
        console.log(" [x] Received order:", order);
        await OrderService.create(order.userId, order.email, order.items);
        // Process the order
        channel.ack(message);
      },
      { noAck: false } // remove from queue only after successful creation of order
    );
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
})();

module.exports = app;
