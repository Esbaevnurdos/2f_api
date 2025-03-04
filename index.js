const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// CORS Configuration (Warn: Set only allowed origins in production)
app.use(cors({ origin: "*" })); // Allow all origins (Use specific domains in production)
app.use(express.json()); // Middleware to parse JSON

// Mock database (in-memory)
let users = [];

// Routes

// Create User (POST /users)
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  res.status(201).json({ message: "User created", user: newUser });
});

// Get All Users (GET /users)
app.get("/users", (req, res) => {
  res.json(users);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
