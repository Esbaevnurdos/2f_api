const express = require("express");
const cors = require("cors"); // Import cors
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";

app.use(express.json());
app.use(cors()); // Enable CORS for all requests

// Read users from file
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Get all users
app.get("/users", (req, res) => {
  res.json(readUsers());
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const user = readUsers().find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Create user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required" });

  const users = readUsers();
  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

// Update user
app.put("/users/:id", (req, res) => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users[index] = { ...users[index], ...req.body };
  writeUsers(users);

  res.json(users[index]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
