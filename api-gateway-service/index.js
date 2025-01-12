const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "https://auth:3000" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "https://product:3001" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "https://order:3002" });
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
